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

export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING_FEE = 49;

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
    const canonicalProduct = productMap.get(productId);

    // Canonical price from server data, fallback to item.price if strictly positive number
    let unitPrice = 0;
    let title = item.title || 'Rezoni Designer Phone Case';
    let image = item.image || '';

    if (canonicalProduct) {
      unitPrice = canonicalProduct.price;
      title = canonicalProduct.title;
      image = canonicalProduct.primary_image || image;
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

  // Delivery Fee calculation: Free for orders >= 999 or test checkouts, otherwise standard fee (Rs. 49)
  const isTestCheckout = verifiedItems.some((i) => i.id === 'live-test-case' || i.price === 1);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || isTestCheckout ? 0 : STANDARD_SHIPPING_FEE;
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
