import AdminCRMView from '@/components/AdminCRMView';

export const metadata = {
  title: 'Contact Inquiries | admin.rezoni.shop',
};

export default function InquiriesPage() {
  return <AdminCRMView initialTab="inquiries" />;
}
