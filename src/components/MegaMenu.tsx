'use client';

import React from 'react';
import Link from 'next/link';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'category' | 'device';
}

const brands = [
  { name: 'iPhone Cases', link: '/collections/iphone-cases' },
  { name: 'Samsung Cases', link: '/products/anti-yellow-magsafe-clear-case-samsung' },
  { name: 'OnePlus Cases', link: '/products/anti-yellow-magsafe-case-oneplus' },
  { name: 'Google Pixel Cases', link: '/products/anti-yellow-magsafe-clear-case-google-pixel' },
  { name: 'Nothing Cases', link: '/products/anti-yellow-magsafe-clear-case-nothing' },
  { name: 'Vivo Cases', link: '/products/anti-yellow-magsafe-clear-case-vivo' },
  { name: 'iQOO Cases', link: '/products/anti-yellow-magsafe-clear-case-iqoo' },
  { name: 'Oppo Cases', link: '/products/anti-yellow-magsafe-clear-case-oppo-x-series' },
  { name: 'Realme Cases', link: '/products/anti-yellow-magsafe-clear-case-realme' },
  { name: 'Redmi Cases', link: '/products/anti-yellow-magsafe-clear-case-redmi' },
  { name: 'Xiaomi Cases', link: '/products/anti-yellow-magsafe-clear-case-xiaomi' },
  { name: 'Motorola Cases', link: '/products/anti-yellow-magsafe-clear-case-motorola' },
];

const categories = [
  { name: 'Anti-Yellow Clear Case', link: '/products/anti-yellow-magsafe-clear-case' },
  { name: 'Reverb 2.0 Impact Case', link: '/products/reverb-2-0-impact-magsafe-clear-case' },
  { name: 'Polaroid & Custom Cases', link: '/collections/custom-photo-case' },
  { name: 'Football Collection', link: '/collections/football' },
  { name: 'Best Sellers', link: '/collections/best-sellers' },
  { name: 'Mixtape & Vintage', link: '/collections/mixtape' },
];

export default function MegaMenu({ isOpen, onClose, type }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      onMouseLeave={onClose}
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        width: '100%',
        backgroundColor: '#ffffff',
        color: '#000000',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        borderTop: '1px solid #ebebeb',
        zIndex: 40,
        padding: '36px 0',
      }}
    >
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 3fr', gap: '40px' }}>
        {/* Column 1: Brands / Devices */}
        <div>
          <h4
            style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#707070',
              marginBottom: '16px',
            }}
          >
            {type === 'category' ? 'Shop by Device' : 'Popular Brands'}
          </h4>
          <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {brands.map((b) => (
              <li key={b.name}>
                <Link
                  href={b.link}
                  onClick={onClose}
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#282828',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6700')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#282828')}
                >
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Collections & Models */}
        <div>
          <h4
            style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#707070',
              marginBottom: '16px',
            }}
          >
            Featured Collections
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {categories.map((c) => (
              <li key={c.name}>
                <Link
                  href={c.link}
                  onClick={onClose}
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#282828',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6700')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#282828')}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Visual Feature Promo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Link
            href="/products/anti-yellow-magsafe-clear-case"
            onClick={onClose}
            style={{
              position: 'relative',
              borderRadius: '6px',
              overflow: 'hidden',
              display: 'block',
              aspectRatio: '1',
              backgroundColor: '#f5f5f5',
            }}
          >
            <img
              src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/DSC00062.jpg?v=1729097458"
              alt="Anti-Yellow Case"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '12px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              Anti-Yellow Series
            </div>
          </Link>

          <Link
            href="/collections/football"
            onClick={onClose}
            style={{
              position: 'relative',
              borderRadius: '6px',
              overflow: 'hidden',
              display: 'block',
              aspectRatio: '1',
              backgroundColor: '#f5f5f5',
            }}
          >
            <img
              src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/DSC01921.jpg?v=1733748876"
              alt="Football Collection"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '12px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              Football Collection
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
