import AdminCRMView from '@/components/AdminCRMView';

export const metadata = {
  title: 'Admin Sign In | admin.rezoni.shop',
};

export default function LoginPage() {
  return <AdminCRMView initialTab="overview" />;
}
