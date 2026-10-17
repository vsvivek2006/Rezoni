import AdminCRMView from '@/components/AdminCRMView';

export const metadata = {
  title: 'Orders Fulfillment | admin.rezoni.shop',
};

export default function OrdersPage() {
  return <AdminCRMView initialTab="orders" />;
}
