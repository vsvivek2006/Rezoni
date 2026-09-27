'use client';

import React, { useState, useEffect } from 'react';
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

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 200,
        display: 'flex',
        justifyContent: 'flex-start',
        fontFamily: 'Montserrat, sans-serif',
      }}
      onClick={onClose}
    >
      {/* Predictive Search Drawer sliding from LEFT matching live Rezoni markup */}
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '100%',
          backgroundColor: '#ffffff',
          color: '#000000',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '10px 0 30px rgba(0,0,0,0.25)',
          animation: 'slideFromLeft 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header matching predictive-search-drawer */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #ebebeb',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              backgroundColor: '#f7f7f7',
              borderRadius: '4px',
              padding: '10px 14px',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#222" strokeWidth="1.9">
              <path d="M12.336 12.336c2.634-2.635 2.682-6.859.106-9.435-2.576-2.576-6.8-2.528-9.435.106C.373 5.642.325 9.866 2.901 12.442c2.576 2.576 6.8 2.528 9.435-.106zm0 0L17 17"></path>
            </svg>
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                marginLeft: '10px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#111111',
                fontFamily: 'inherit',
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                style={{ color: '#888', fontSize: '14px', padding: '2px 4px' }}
              >
                ✕
              </button>
            )}
          </form>

          {/* Close button on right */}
          <button
            onClick={onClose}
            aria-label="Close search"
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#333',
              fontSize: '18px',
              cursor: 'pointer',
              borderRadius: '50%',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 13L1 1M13 1L1 13"></path>
            </svg>
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {query.trim() === '' ? (
            /* Suggested / Popular Searches */
            <div>
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                {suggestedSearches.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(s)}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#f2f2f2',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#222222',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e5e5')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f2f2f2')}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Quick Categories */}
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
                Collections
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  href="/collections/iphone-cases"
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '6px',
                    backgroundColor: '#fafafa',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#111',
                  }}
                >
                  <span>iPhone Cases</span>
                  <span>&rarr;</span>
                </Link>
                <Link
                  href="/collections/anti-yellow-case"
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '6px',
                    backgroundColor: '#fafafa',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#111',
                  }}
                >
                  <span>Anti-Yellow Case</span>
                  <span>&rarr;</span>
                </Link>
                <Link
                  href="/collections/football"
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '6px',
                    backgroundColor: '#fafafa',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#111',
                  }}
                >
                  <span>Football Club Collection</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#777' }}>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#222', marginBottom: '8px' }}>
                No results found for &quot;{query}&quot;
              </p>
              <p style={{ fontSize: '13px' }}>Try checking your spelling or use more general terms.</p>
            </div>
          ) : (
            /* Results matching live predictive search items */
            <div>
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
                Products ({filtered.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filtered.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.handle}`}
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '8px',
                      borderRadius: '6px',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f7f7f7')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        backgroundColor: '#f5f5f5',
                        flexShrink: 0,
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
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#ff6700',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.category_tag || 'REVERB CASE'}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#111111', margin: '2px 0' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>
                        <span style={{ color: '#e53935', marginRight: '6px' }}>Rs. {item.price.toFixed(2)}</span>
                        {item.compare_at_price > item.price && (
                          <span style={{ color: '#888888', textDecoration: 'line-through', fontSize: '11px' }}>
                            Rs. {item.compare_at_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer matching live site */}
        {filtered.length > 0 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #ebebeb' }}>
            <Link
              href={`/collections/all?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              style={{
                display: 'block',
                width: '100%',
                backgroundColor: '#ff6700',
                color: '#ffffff',
                textAlign: 'center',
                padding: '12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              View all results ({filtered.length})
            </Link>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideFromLeft {
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
