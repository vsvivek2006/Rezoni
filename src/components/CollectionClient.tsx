'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

interface CollectionClientProps {
  handle: string;
  initialProducts: any[];
}

export default function CollectionClient({ handle, initialProducts }: CollectionClientProps) {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const title = handle
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const sorted = [...initialProducts];
  if (sortBy === 'price-asc') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    sorted.sort((a, b) => b.price - a.price);
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh', padding: '32px 0 64px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#555' }}>
            Home
          </Link>{' '}
          / <span style={{ color: '#000', fontWeight: 600 }}>{title}</span>
        </div>

        {/* Collection Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="section-title">{title}</h1>
          <p style={{ fontSize: '14px', color: '#707070', marginTop: '8px' }}>
            Explore our curated selection of premium protective cases designed for everyday durability.
          </p>
        </div>

        {/* Filter and Sort Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #eee',
            paddingBottom: '16px',
            marginBottom: '32px',
            fontSize: '13px',
          }}
        >
          <div style={{ color: '#666' }}>
            Showing <strong>{sorted.length}</strong> products
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="sort-select" style={{ fontWeight: 600, color: '#333' }}>
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontFamily: 'inherit',
                fontSize: '13px',
                backgroundColor: '#fff',
              }}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '32px 20px',
          }}
        >
          {sorted.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: String(product.id),
                title: product.title,
                handle: product.handle,
                category_tag: product.category_tag,
                sub_title: product.sub_title,
                price: product.price,
                compare_at_price: product.compare_at_price,
                primary_image: product.primary_image,
                secondary_image: product.secondary_image,
                swatches: product.swatches,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
