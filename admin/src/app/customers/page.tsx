import AdminCRMView from '@/components/AdminCRMView';

export const metadata = {
  title: 'Customer Directory | admin.rezoni.shop',
};

export default function CustomersPage() {
  return <AdminCRMView initialTab="customers" />;
}
