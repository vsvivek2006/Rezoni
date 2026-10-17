import productsData from '@/data/products.json';
import { OrderItem } from './orderStore';

interface ProductLookup {
  id: string;
  title: string;
  price: number;
  primary_image?: string;
}

const productMap = new Map<string, ProductLookup>();

(productsData as ProductLookup[]).forEach((p) => {
  productMap.set(p.id, p);
});

export const FREE_SHIPPING_THRESHOLD = 0;
export const STANDARD_SHIPPING_FEE = 0;

export interface ValidatedCartResult {
  isValid: boolean;
  error?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  totalPaise: number;
}

export function validateAndCalculateCart(incomingItems: any[]): ValidatedCartResult {
  if (!Array.isArray(incomingItems) || incomingItems.length === 0) {
    return {
      isValid: false,
      error: 'Cart is empty. Please add items to checkout.',
      items: [],
      subtotal: 0,
      shippingFee: 0,
      totalAmount: 0,
      totalPaise: 0,
    };
  }

  let subtotal = 0;
  const verifiedItems: OrderItem[] = [];

  for (const item of incomingItems) {
    const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
    const productId = String(item.id || '');
    let canonicalProduct = productMap.get(productId);

    if (!canonicalProduct) {
      // Lookup by prefix for compound variant IDs (e.g. the-weeknd-iPhone 16 Pro-White-magsafe)
      for (const [id, prod] of productMap.entries()) {
        if (productId === id || productId.startsWith(id + '-')) {
          canonicalProduct = prod;
          break;
        }
      }
    }

    // Determine variant unit price: MagSafe = 399, Non-MagSafe / Standard = 299
    let unitPrice = 0;
    let title = item.title || (canonicalProduct ? canonicalProduct.title : 'Rezoni Designer Phone Case');
    let image = item.image || (canonicalProduct ? canonicalProduct.primary_image : '');

    if (productId.endsWith('-magsafe') || (item.title && item.title.includes('MagSafe') && !item.title.includes('Non-MagSafe'))) {
      unitPrice = 399;
    } else if (typeof item.price === 'number' && (item.price === 399 || item.price === 299)) {
      unitPrice = Math.round(item.price);
    } else if (canonicalProduct) {
      unitPrice = canonicalProduct.price || 299;
    } else if (typeof item.price === 'number' && item.price > 0) {
      unitPrice = Math.round(item.price);
    } else {
      return {
        isValid: false,
        error: `Invalid product in cart (${productId || 'unknown'}).`,
        items: [],
        subtotal: 0,
        shippingFee: 0,
        totalAmount: 0,
        totalPaise: 0,
      };
    }

    subtotal += unitPrice * qty;
    verifiedItems.push({
      id: productId,
      title,
      price: unitPrice,
      quantity: qty,
      image,
      device: item.device,
      color: item.color,
    });
  }

  // Delivery Fee calculation: 100% Free Shipping sitewide on all orders
  const shippingFee = 0;
  const totalAmount = subtotal + shippingFee;

  // Razorpay requires amount in Paise (integer)
  const totalPaise = Math.round(totalAmount * 100);

  if (totalPaise < 100) {
    return {
      isValid: false,
      error: 'Minimum order amount must be at least ₹1.00.',
      items: [],
      subtotal: 0,
      shippingFee: 0,
      totalAmount: 0,
      totalPaise: 0,
    };
  }

  return {
    isValid: true,
    items: verifiedItems,
    subtotal,
    shippingFee,
    totalAmount,
    totalPaise,
  };
}
