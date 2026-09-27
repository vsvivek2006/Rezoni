import React from 'react';
import productsData from '@/data/products.json';
import ProductDetailClient from '@/components/ProductDetailClient';

export function generateStaticParams() {
  return productsData.map((p) => ({
    handle: p.handle,
  }));
}

interface PageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;
  const product = productsData.find((p) => p.handle === handle) || productsData[0];

  return <ProductDetailClient product={product} />;
}
