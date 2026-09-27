'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import productsData from '@/data/products.json';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const suggestedSearches = [
  'Anti-Yellow Case',
  'The Weeknd',
  'Football',
  'Mixtape',
  'Barcelona',
  'Manchester United',
  'iPhone 16 Pro Max',
  'MagSafe',
];

const availableCollections = [
  { title: 'iPhone Cases', href: '/collections/iphone-cases' },
  { title: 'Anti-Yellow Case', href: '/collections/anti-yellow-case' },
  { title: 'Football Club Collection', href: '/collections/football' },
  { title: 'The Weeknd Collection', href: '/collections/the-weeknd' },
  { title: 'Mixtape Collection', href: '/collections/mixtape' },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'collections'>('products');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setActiveTab('products');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? productsData.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.handle.toLowerCase().includes(query.toLowerCase()) ||
        p.category_tag.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredCollections = query.trim()
    ? availableCollections.filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase())
      )
    : availableCollections;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'flex-start',
        fontFamily: 'Montserrat, sans-serif',
      }}
      onClick={onClose}
    >
      {/* Search Drawer matching live Rezoni mobile search */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#ffffff',
          color: '#000000',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '10px 0 30px rgba(0,0,0,0.2)',
          animation: 'slideInLeft 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Exact Header matching live_mobile_search_opened.png */}
        <div
          style={{
            height: '62px',
            padding: '0 20px',
            borderBottom: '1px solid #ebebeb',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Thin Search Icon on Left */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#222222" strokeWidth="1.8" style={{ flexShrink: 0 }}>
            <circle cx="8.5" cy="8.5" r="5.5" />
            <line x1="12.5" y1="12.5" x2="18" y2="18" />
          </svg>

          {/* Borderless Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '15px',
              fontWeight: 400,
              color: '#111111',
              fontFamily: 'inherit',
            }}
          />

          {/* Thin Close Icon on Right */}
          <button
            onClick={onClose}
            aria-label="Close search"
            style={{
              background: 'transparent',
              border: 'none',
              padding: '6px',
              cursor: 'pointer',
              color: '#222222',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="2" y1="2" x2="16" y2="16" />
              <line x1="16" y1="2" x2="2" y2="16" />
            </svg>
          </button>
        </div>

        {/* When Query is Present: Show PRODUCTS / COLLECTIONS tabs matching live_mobile_search_results.png */}
        {query.trim() !== '' ? (
          <>
            <div
              style={{
                display: 'flex',
                gap: '24px',
                padding: '16px 20px 0',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <button
                onClick={() => setActiveTab('products')}
                style={{
                  background: 'none',
                  border: 'none',
                  paddingBottom: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: activeTab === 'products' ? '#000000' : '#888888',
                  borderBottom: activeTab === 'products' ? '2.5px solid #000000' : '2.5px solid transparent',
                  cursor: 'pointer',
                }}
              >
                PRODUCTS
              </button>
              <button
                onClick={() => setActiveTab('collections')}
                style={{
                  background: 'none',
                  border: 'none',
                  paddingBottom: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: activeTab === 'collections' ? '#000000' : '#888888',
                  borderBottom: activeTab === 'collections' ? '2.5px solid #000000' : '2.5px solid transparent',
                  cursor: 'pointer',
                }}
              >
                COLLECTIONS
              </button>
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {activeTab === 'products' ? (
                filteredProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#777' }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#222', marginBottom: '8px' }}>
                      No products found for &quot;{query}&quot;
                    </p>
                    <p style={{ fontSize: '12px' }}>Try checking your spelling or use more general terms.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredProducts.map((item) => (
                      <Link
                        key={item.id}
                        href={`/products/${item.handle}`}
                        onClick={onClose}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          textDecoration: 'none',
                        }}
                      >
                        <div
                          style={{
                            width: '58px',
                            height: '70px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            backgroundColor: '#fafafa',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <img
                            src={item.primary_image}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: '13px',
                              fontWeight: 500,
                              color: '#222222',
                              lineHeight: 1.4,
                              marginBottom: '4px',
                            }}
                          >
                            {item.title}
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 600 }}>
                            <span style={{ color: '#e53935', marginRight: '8px' }}>
                              Rs. {item.price.toFixed(2)}
                            </span>
                            {item.compare_at_price > item.price && (
                              <span style={{ color: '#999999', textDecoration: 'line-through', fontSize: '12px', fontWeight: 400 }}>
                                Rs. {item.compare_at_price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              ) : (
                /* Collections Tab */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredCollections.map((col, idx) => (
                    <Link
                      key={idx}
                      href={col.href}
                      onClick={onClose}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '4px',
                        backgroundColor: '#f8f8f8',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#111111',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{col.title}</span>
                      <span style={{ color: '#888888' }}>&rarr;</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom View All Results Button matching live_mobile_search_results.png */}
            {filteredProducts.length > 0 && (
              <div style={{ padding: '16px 20px', borderTop: '1px solid #ebebeb' }}>
                <Link
                  href={`/collections/all?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    backgroundColor: '#ff6700',
                    color: '#ffffff',
                    height: '48px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 800,
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e65c00')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ff6700')}
                >
                  VIEW ALL RESULTS
                </Link>
              </div>
            )}
          </>
        ) : (
          /* Empty state: Clean with Popular Searches & Featured Collections */
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#888888',
                marginBottom: '14px',
              }}
            >
              Popular Searches
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
              {suggestedSearches.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(s)}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#222222',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e8e8e8')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                >
                  {s}
                </button>
              ))}
            </div>

            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#888888',
                marginBottom: '14px',
              }}
            >
              Featured Collections
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {availableCollections.slice(0, 3).map((col, idx) => (
                <Link
                  key={idx}
                  href={col.href}
                  onClick={onClose}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '4px',
                    backgroundColor: '#fafafa',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{col.title}</span>
                  <span style={{ color: '#888888' }}>&rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
