import React from 'react';
import productsData from '@/data/products.json';
import ProductDetailClient from '@/components/ProductDetailClient';
import { notFound } from 'next/navigation';

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
  const product = productsData.find((p) => p.handle === handle);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
