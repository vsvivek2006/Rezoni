import React from 'react';
import StaticPageClient from '@/components/StaticPageClient';
import { redirect } from 'next/navigation';

export function generateStaticParams() {
  return [
    { slug: 'our-story' },
    { slug: 'contact' },
    { slug: 'shipping-policy' },
    { slug: 'returns-refunds-exchanges' },
    { slug: 'cancellation-policy' },
    { slug: 'terms-and-conditions' },
    { slug: 'privacy-policy' },
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function StaticInfoPage({ params }: PageProps) {
  const { slug } = await params;
  if (slug === 'track-order') {
    redirect('/track-order');
  }
  return <StaticPageClient slug={slug} />;
}
