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
    <section style={{ padding: '48px 0', backgroundColor: '#ffffff' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h3 className="section-title">{title}</h3>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '24px 18px',
          }}
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
