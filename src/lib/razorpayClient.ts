declare global {
  interface Window {
    Razorpay?: any;
  }
}

let scriptLoadingPromise: Promise<boolean> | null = null;

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve) => {
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay Checkout SDK. It might be blocked by an ad-blocker or network error.');
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return scriptLoadingPromise;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayFailureResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id?: string;
    };
  };
}

export interface OpenRazorpayOptions {
  keyId: string;
  orderId: string;
  amount: number; // in paise
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (response: RazorpaySuccessResponse) => void;
  onDismiss?: () => void;
  onFailure?: (response: RazorpayFailureResponse) => void;
}

export async function openRazorpayCheckout(options: OpenRazorpayOptions): Promise<boolean> {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error('Razorpay Checkout failed to load. Please check your internet connection or disable ad blockers and try again.');
  }

  const rzpOptions = {
    key: options.keyId,
    amount: options.amount,
    currency: options.currency || 'INR',
    name: 'REZONI',
    description: 'Designer Phone Cases & Premium Accessories',
    order_id: options.orderId,
    prefill: {
      name: options.customerName,
      email: options.customerEmail,
      contact: options.customerPhone,
    },
    notes: {
      merchant: 'REZONI India',
    },
    theme: {
      color: '#ff6700',
      backdrop_color: 'rgba(0, 0, 0, 0.7)',
    },
    modal: {
      ondismiss: () => {
        if (options.onDismiss) {
          options.onDismiss();
        }
      },
      backdropclose: false,
      escape: true,
    },
    retry: {
      enabled: true,
      max_count: 2,
    },
    handler: (response: RazorpaySuccessResponse) => {
      options.onSuccess(response);
    },
  };

  const razorpayInstance = new window.Razorpay(rzpOptions);

  if (options.onFailure) {
    razorpayInstance.on('payment.failed', (response: RazorpayFailureResponse) => {
      options.onFailure!(response);
    });
  }

  razorpayInstance.open();
  return true;
}
