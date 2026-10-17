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
  searchParams?: Promise<{ model?: string; variant?: string }>;
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { handle } = await params;
  const sParams = searchParams ? await searchParams : {};
  const initialModel = sParams.model ? decodeURIComponent(sParams.model) : undefined;
  let product = productsData.find((p) => p.handle === handle);


  if (!product) {
    const lower = handle.toLowerCase();
    if (lower.includes('samsung')) {
      product = productsData.find((p) => p.handle === 'anti-yellow-magsafe-clear-case-samsung');
    } else if (lower.includes('oneplus')) {
      product = productsData.find((p) => p.handle === 'anti-yellow-magsafe-case-oneplus');
    } else if (lower.includes('pixel')) {
      product = productsData.find((p) => p.handle === 'anti-yellow-magsafe-clear-case-google-pixel');
    } else if (lower.includes('nothing')) {
      product = productsData.find((p) => p.handle === 'anti-yellow-magsafe-clear-case-nothing');
    } else if (lower.includes('vivo')) {
      product = productsData.find((p) => p.handle === 'anti-yellow-magsafe-clear-case-vivo');
    } else if (lower.includes('iqoo')) {
      product = productsData.find((p) => p.handle === 'anti-yellow-magsafe-clear-case-iqoo');
    } else if (lower.includes('oppo')) {
      product = productsData.find((p) => p.handle === 'anti-yellow-magsafe-clear-case-oppo-x-series');
    } else if (lower.includes('realme')) {
      product = productsData.find((p) => p.handle === 'anti-yellow-magsafe-clear-case-realme');
    } else if (lower.includes('redmi')) {
      product = productsData.find((p) => p.handle === 'anti-yellow-magsafe-clear-case-redmi') || productsData.find((p) => p.handle === 'anti-yellow-magsafe-clear-case-xiaomi');
    } else if (lower.includes('xiaomi') || lower.includes('mi-') || lower.includes('mi10')) {
      product = productsData.find((p) => p.handle === 'anti-yellow-magsafe-clear-case-xiaomi');
    } else if (lower.includes('motorola') || lower.includes('moto') || lower.includes('razr')) {
      product = productsData.find((p) => p.handle === 'anti-yellow-magsafe-clear-case-motorola');
    } else if (lower.includes('iphone') || lower.includes('apple') || lower.includes('clear-case')) {
      product = productsData.find((p) => p.handle === 'anti-yellow-magsafe-clear-case');
    }
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product as any} initialModel={initialModel} />;
}

