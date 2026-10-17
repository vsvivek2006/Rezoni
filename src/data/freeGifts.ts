export interface FreeGiftItem {
  id: string;
  title: string;
  subtitle: string;
  originalPrice: number;
  image: string;
}

export const FREE_GIFTS: FreeGiftItem[] = [
  {
    id: 'free-gift-sticky-pod',
    title: 'Sticky Pod',
    subtitle: 'Strong grip • Stick it anywhere',
    originalPrice: 199,
    image: '/images/gifts/sticky_pod_thumb.jpg',
  },
  {
    id: 'free-gift-cable-protector',
    title: 'Cable Protector',
    subtitle: 'Protects cables from bending & damage',
    originalPrice: 199,
    image: '/images/gifts/cable_protector_thumb.jpg',
  },
  {
    id: 'free-gift-usb-cable',
    title: 'Fast Charging Cable',
    subtitle: 'Durable, tangle-free & fast sync',
    originalPrice: 249,
    image: '/images/gifts/usb_cable_thumb.jpg',
  },
];

export const TOTAL_FREE_GIFTS_VALUE = FREE_GIFTS.reduce((sum, g) => sum + g.originalPrice, 0); // 647
