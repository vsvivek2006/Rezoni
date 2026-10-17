import AdminCRMView from '@/components/AdminCRMView';

export const metadata = {
  title: 'Reviews Moderation | admin.rezoni.shop',
};

export default function ReviewsPage() {
  return <AdminCRMView initialTab="reviews" />;
}
