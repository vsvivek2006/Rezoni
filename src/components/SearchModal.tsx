'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import productsData from '@/data/products.json';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = query.trim()
    ? productsData.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.handle.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '60px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '700px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid #ebebeb',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#707070" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search products, collections, devices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              marginLeft: '12px',
              fontSize: '16px',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={onClose}
            style={{
              padding: '4px 8px',
              fontSize: '18px',
              color: '#707070',
            }}
          >
            ✕
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '16px' }}>
          {query.trim() === '' ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: '#888', fontSize: '14px' }}>
              Type to search for phone models, clear cases, MagSafe, or collections...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: '#888', fontSize: '14px' }}>
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filtered.slice(0, 8).map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.handle}`}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '8px',
                    borderRadius: '4px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f8f8')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <img
                    src={p.primary_image}
                    alt={p.title}
                    style={{
                      width: '54px',
                      height: '54px',
                      objectFit: 'contain',
                      borderRadius: '4px',
                      backgroundColor: '#f5f5f5',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{p.title}</div>
                    <div style={{ fontSize: '12px', color: '#ff6700', fontWeight: 600 }}>
                      Rs. {p.price.toFixed(2)}{' '}
                      <span style={{ textDecoration: 'line-through', color: '#999', marginLeft: '6px' }}>
                        Rs. {p.compare_at_price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
