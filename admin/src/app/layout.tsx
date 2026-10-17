import './globals.css';

export const metadata = {
  title: 'Rezoni Operations & CRM | admin.rezoni.shop',
  description: 'Isolated Executive Control Panel for Rezoni e-Commerce Operations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body>{children}</body>
    </html>
  );
}
