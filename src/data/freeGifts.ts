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
    title: 'Sticky Pod (Universal Phone Suction Mount)',
    subtitle: 'Strong grip • Stick it anywhere',
    originalPrice: 199,
    image: '/images/gifts/sticky_pod.jpg',
  },
  {
    id: 'free-gift-cable-protector',
    title: 'Cable Protector (4 Pcs Spiral Guards)',
    subtitle: 'Protects cables from bending & damage',
    originalPrice: 149,
    image: '/images/gifts/cable_protector.jpg',
  },
  {
    id: 'free-gift-usb-cable',
    title: 'USB Fast Charging Cable',
    subtitle: 'Durable, tangle-free & fast sync',
    originalPrice: 299,
    image: '/images/gifts/usb_cable.jpg',
  },
];

export const TOTAL_FREE_GIFTS_VALUE = FREE_GIFTS.reduce((sum, g) => sum + g.originalPrice, 0); // 647
