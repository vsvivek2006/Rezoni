'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

interface CollectionClientProps {
  handle: string;
  initialProducts: any[];
}

const subCollectionPills: { [key: string]: { label: string; href: string; iconText?: string; img?: string }[] } = {
  'iphone-cases': [
    { label: 'All', href: '/collections/iphone-cases', iconText: 'ALL' },
    { label: 'Clear Case', href: '/collections/anti-yellow-case', img: 'https://cdn.shopify.com/s/files/1/0621/7829/6040/files/6_c0ebdd0a-d5a3-45ab-bf59-14744104fae1_600x.jpg?v=1729101657' },
    { label: 'Unisex', href: '/collections/unisex', img: 'https://www.rezoni.com/cdn/shop/files/1_d1dd6cde-4f21-448b-b467-3190b372131e_950x.jpg?v=1712571168' },
    { label: 'Mixtape', href: '/collections/mixtape', img: 'https://www.rezoni.com/cdn/shop/files/1_ba23e34f-dfaf-4723-b59f-bf10f1397ae1.jpg?v=1722677673' },
  ],
  'all': [
    { label: 'All', href: '/collections/all', iconText: 'ALL' },
    { label: 'Clear Case', href: '/collections/anti-yellow-case', img: 'https://cdn.shopify.com/s/files/1/0621/7829/6040/files/6_c0ebdd0a-d5a3-45ab-bf59-14744104fae1_600x.jpg?v=1729101657' },
    { label: 'Football', href: '/collections/football', img: 'https://cdn.shopify.com/s/files/1/0621/7829/6040/files/DSC01921.jpg?v=1733748876' },
    { label: 'Mixtape', href: '/collections/mixtape', img: 'https://www.rezoni.com/cdn/shop/files/1_ba23e34f-dfaf-4723-b59f-bf10f1397ae1.jpg?v=1722677673' },
  ]
};

export default function CollectionClient({ handle, initialProducts }: CollectionClientProps) {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const pills = subCollectionPills[handle] || null;

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh', padding: '12px 0 60px', fontFamily: 'Montserrat, sans-serif' }}>
      <div className="container">
        {/* Filters Top Bar matching live_05_collection_football.png & live_05_collection_iphone.png */}
        <div
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 0 16px',
            cursor: 'pointer',
            color: '#555555',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#222" strokeWidth="1.8">
            <line x1="3" y1="6" x2="17" y2="6" />
            <line x1="3" y1="14" x2="17" y2="14" />
            <circle cx="7" cy="6" r="2.5" fill="#fff" stroke="#222" strokeWidth="1.8" />
            <circle cx="13" cy="14" r="2.5" fill="#fff" stroke="#222" strokeWidth="1.8" />
          </svg>
          <span>Filters</span>
        </div>

        {/* Optional Filter / Sort drawer dropdown when opened */}
        {isFilterOpen && (
          <div
            style={{
              padding: '14px',
              backgroundColor: '#fafafa',
              borderRadius: '6px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
            }}
          >
            <span style={{ fontWeight: 600 }}>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: '#fff',
                fontSize: '13px',
              }}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        )}

        {/* Circular Sub-collection Filter Pills matching live_05_collection_iphone.png */}
        {pills && (
          <div
            className="hide-scrollbar"
            style={{
              display: 'flex',
              gap: '24px',
              overflowX: 'auto',
              justifyContent: 'flex-start',
              paddingBottom: '20px',
              marginBottom: '10px',
            }}
          >
            {pills.map((pill, idx) => (
              <Link
                key={idx}
                href={pill.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textDecoration: 'none',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: pill.iconText ? '#ff6700' : '#f5f5f5',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    marginBottom: '8px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  }}
                >
                  {pill.iconText ? (
                    <span style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '1px' }}>
                      {pill.iconText}
                    </span>
                  ) : pill.img ? (
                    <img
                      src={pill.img}
                      alt={pill.label}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : null}
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#222222', whiteSpace: 'nowrap' }}>
                  {pill.label}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Collection Title matching live site */}
        {!pills && (
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 900,
              color: '#000000',
              textAlign: 'center',
              letterSpacing: '-0.5px',
              margin: '0 0 24px',
            }}
          >
            {title}
          </h1>
        )}

        {/* Mobile 2-Column Product Grid matching live site */}
        <div className="rezoni-product-grid">
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
