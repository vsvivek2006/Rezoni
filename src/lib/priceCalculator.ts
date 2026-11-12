import productsData from '@/data/products.json';
import { OrderItem } from './orderStore';

interface ProductLookup {
  id: string;
  title: string;
  price: number;
  primary_image?: string;
}

const productMap = new Map<string, ProductLookup>();

(productsData as any[]).forEach((p) => {
  productMap.set(String(p.id), p);
  if (p.handle) {
    productMap.set(String(p.handle), p);
  }
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

    // Determine unit price: strictly canonical product price (₹699)
    let unitPrice = 699;
    let title = item.title || (canonicalProduct ? canonicalProduct.title : 'Rezoni Designer Phone Case');
    let image = item.image || (canonicalProduct ? canonicalProduct.primary_image : '');

    if (canonicalProduct && typeof canonicalProduct.price === 'number' && canonicalProduct.price > 0) {
      unitPrice = canonicalProduct.price;
    } else {
      unitPrice = 699;
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

  // Automatically attach 3 Free Gifts to every confirmed order at ₹0 cost
  verifiedItems.push(
    {
      id: 'free-gift-sticky-pod',
      title: 'Sticky Pod (Universal Phone Suction Mount) [FREE GIFT]',
      price: 0,
      quantity: 1,
      image: '/images/gifts/sticky_pod.jpg',
    },
    {
      id: 'free-gift-cable-protector',
      title: 'Cable Protector (4 Pcs Spiral Guards) [FREE GIFT]',
      price: 0,
      quantity: 1,
      image: '/images/gifts/cable_protector.jpg',
    },
    {
      id: 'free-gift-usb-cable',
      title: 'USB Fast Charging Cable [FREE GIFT]',
      price: 0,
      quantity: 1,
      image: '/images/gifts/usb_cable.jpg',
    }
  );

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
