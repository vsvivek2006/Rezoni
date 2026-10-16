import Razorpay from 'razorpay';

export function getRazorpayKeys() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

  return {
    keyId,
    keySecret,
    webhookSecret,
    isConfigured: Boolean(keyId && keySecret),
  };
}

export function getRazorpayInstance(): Razorpay {
  const { keyId, keySecret, isConfigured } = getRazorpayKeys();

  if (!isConfigured) {
    throw new Error(
      'Razorpay credentials missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment (.env.local).'
    );
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}
