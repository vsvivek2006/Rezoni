import AdminCRMView from '@/components/AdminCRMView';

export const metadata = {
  title: 'Security & Database Status | admin.rezoni.shop',
};

export default function SecurityPage() {
  return <AdminCRMView initialTab="security" />;
}
