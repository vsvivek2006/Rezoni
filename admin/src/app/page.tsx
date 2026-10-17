import AdminCRMView from '@/components/AdminCRMView';

export const metadata = {
  title: 'Executive CRM Dashboard | admin.rezoni.shop',
  description: 'Isolated Operations Control for Rezoni Store',
};

export default function AdminRootPage() {
  return <AdminCRMView initialTab="overview" />;
}
