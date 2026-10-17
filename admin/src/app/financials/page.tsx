import AdminCRMView from '@/components/AdminCRMView';

export const metadata = {
  title: 'Revenue & Financials | admin.rezoni.shop',
};

export default function FinancialsPage() {
  return <AdminCRMView initialTab="financials" />;
}
