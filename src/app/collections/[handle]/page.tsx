import React from 'react';
import productsData from '@/data/products.json';
import CollectionClient from '@/components/CollectionClient';

export function generateStaticParams() {
  return [
    { handle: 'all' },
    { handle: 'iphone-cases' },
    { handle: 'anti-yellow-case' },
    { handle: 'football' },
    { handle: 'best-sellers' },
    { handle: 'custom-photo-case' },
    { handle: 'mixtape' },
    { handle: 'featured-prints' },
  ];
}

interface PageProps {
  params: Promise<{ handle: string }>;
}

export default async function CollectionPage({ params }: PageProps) {
  const { handle } = await params;
  let filtered = [...productsData];

  if (handle !== 'all' && handle !== 'best-sellers') {
    const term = handle.replace(/-/g, ' ').toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.handle.includes(handle) ||
        p.title.toLowerCase().includes(term) ||
        p.category_tag.toLowerCase().includes(term) ||
        (p.sub_title && p.sub_title.toLowerCase().includes(term))
    );
  }

  if (filtered.length === 0) {
    filtered = productsData.slice(0, 16);
  }

  return <CollectionClient handle={handle} initialProducts={filtered} />;
}
