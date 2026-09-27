import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import MiniCart from '@/components/MiniCart';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Rezoni - A case for every mood',
  description: 'A case for every mood. Stylish and protective tech-accessories for your iPhone & Android #Rezoni',
  icons: {
    icon: 'https://www.rezoni.com/cdn/shop/files/d3282d5e-8b1a-4631-95a0-2d76d4858e6d_96x96.png?v=1662053839',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <MiniCart />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
