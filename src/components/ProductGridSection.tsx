'use client';

import React from 'react';
import { ProductItem } from '@/data/siteData';
import ProductCard from './ProductCard';

interface ProductGridSectionProps {
  title: string;
  products: ProductItem[];
}

export default function ProductGridSection({ title, products }: ProductGridSectionProps) {
  return (
    <section style={{ padding: '36px 0 48px', backgroundColor: '#ffffff' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h3 className="section-title">{title}</h3>
        </div>

        <div className="rezoni-product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
