import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import MiniCart from '@/components/MiniCart';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Rezoni - A case for every mood',
  description: 'A case for every mood. Stylish and protective tech-accessories for your iPhone & Android #Rezoni',
  icons: {
    icon: 'https://www.rezoni.com/cdn/shop/files/d3282d5e-8b1a-4631-95a0-2d76d4858e6d_96x96.png?v=1662053839',
  },
  other: {
    'p:domain_verify': 'af207071a0871ae92bad697aafd63a33',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="p:domain_verify" content="af207071a0871ae92bad697aafd63a33" />
        {/* Preconnect to Razorpay servers for instant checkout popup launch */}
        <link rel="preconnect" href="https://checkout.razorpay.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.razorpay.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        <link rel="dns-prefetch" href="https://api.razorpay.com" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <MiniCart />
            <main>{children}</main>
            <Footer />
            <AuthModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

