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
    filtered = filtered.filter(
      (p) =>
        p.handle.includes(handle) ||
        p.title.toLowerCase().includes(handle.replace(/-/g, ' ')) ||
        p.category_tag.toLowerCase().includes(handle.replace(/-/g, ' '))
    );
  }

  if (filtered.length === 0) {
    filtered = productsData.slice(0, 16);
  }

  return <CollectionClient handle={handle} initialProducts={filtered} />;
}
