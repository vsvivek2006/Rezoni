import React from 'react';
import StaticPageClient from '@/components/StaticPageClient';

export function generateStaticParams() {
  return [
    { slug: 'our-story' },
    { slug: 'contact' },
    { slug: 'shipping-policy' },
    { slug: 'returns-refunds-exchanges' },
    { slug: 'cancellation-policy' },
    { slug: 'terms-and-conditions' },
    { slug: 'privacy-policy' },
    { slug: 'track-order' },
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function StaticInfoPage({ params }: PageProps) {
  const { slug } = await params;
  return <StaticPageClient slug={slug} />;
}
