'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import productsData from '@/data/products.json';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Popular quick suggestion chips
const suggestedSearches = [
  'Anti-Yellow Case',
  'The Weeknd',
  'Football',
  'Mixtape',
  'Barcelona',
  'Real Madrid',
  'Manchester United',
  'iPhone 16 Pro Max',
  'MagSafe',
  'Coldplay',
  'Clear Case',
];

// Curated collections with matching keywords for smart collection search
const availableCollections = [
  {
    title: 'Anti-Yellow Clear Cases',
    href: '/collections/anti-yellow-case',
    keywords: ['anti-yellow', 'antiyellow', 'clear', 'transparent', 'transperent', 'crystal', 'clean', 'yellow', 'magsafe'],
  },
  {
    title: 'Football Club Collection',
    href: '/collections/football',
    keywords: ['football', 'soccer', 'jersey', 'barca', 'barcelona', 'madrid', 'real madrid', 'united', 'manchester', 'manu', 'mancity', 'city', 'arsenal', 'gunners', 'chelsea', 'juventus', 'juve', 'bayern', 'munich', 'messi', 'ronaldo', 'cr7', 'club'],
  },
  {
    title: 'The Weeknd Collection',
    href: '/collections/the-weeknd',
    keywords: ['the weeknd', 'weeknd', 'weekend', 'starboy', 'xo', 'abel', 'after hours', 'dawn fm', 'mixtape'],
  },
  {
    title: 'Mixtape Collection',
    href: '/collections/mixtape',
    keywords: ['mixtape', 'music', 'cassette', 'rock', 'band', 'bands', 'coldplay', 'metallica', 'linkin park', 'nirvana', 'songs', 'playlist'],
  },
  {
    title: 'iPhone Cases',
    href: '/collections/iphone-cases',
    keywords: ['iphone', 'apple', 'ios', 'iphone 16', 'iphone 15', 'iphone 14', 'iphone 13', 'pro max'],
  },
  {
    title: 'Reverb Case Collection',
    href: '/collections/reverb-case',
    keywords: ['reverb', 'bumper', 'shockproof', 'camera protection', 'matte', 'grip'],
  },
  {
    title: 'Best Sellers',
    href: '/collections/best-sellers',
    keywords: ['best', 'sellers', 'trending', 'popular', 'top', 'favorite', 'hot'],
  },
  {
    title: 'New Arrivals',
    href: '/collections/new-arrivals',
    keywords: ['new', 'arrivals', 'latest', 'fresh', 'newest', 'recent', 'drop'],
  },
  {
    title: 'Polaroid Collection',
    href: '/collections/polaroid',
    keywords: ['polaroid', 'photo', 'camera', 'retro', 'memories'],
  },
  {
    title: 'Impact Cases',
    href: '/collections/impact-cases',
    keywords: ['impact', 'tough', 'heavy duty', 'drop test', 'protection', 'rugged'],
  },
];

// Direct entity/brand aliases to link user search terms directly to product titles
const DIRECT_ALIASES: Record<string, string> = {
  'barca': 'barcelona',
  'messi': 'barcelona',
  'cr7': 'real madrid',
  'ronaldo': 'real madrid',
  'bellingham': 'real madrid',
  'vinicius': 'real madrid',
  'vini': 'real madrid',
  'manu': 'manchester united',
  'manutd': 'manchester united',
  'mufc': 'manchester united',
  'united': 'manchester united',
  'mancity': 'manchester city',
  'mcfc': 'manchester city',
  'city': 'manchester city',
  'haaland': 'manchester city',
  'madrid': 'real madrid',
  'juve': 'juventus',
  'bayern': 'bayern munich',
  'munich': 'bayern munich',
  'gunners': 'arsenal',
  'saka': 'arsenal',
  'weeknd': 'the weeknd',
  'weekend': 'the weeknd',
  'starboy': 'the weeknd',
  'xo': 'the weeknd',
  'abel': 'the weeknd',
  'chester': 'linkin park',
  'kurt': 'nirvana',
  'cobain': 'nirvana',
};

// Broader category keywords to map generic terms to collections/products
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'football': ['barcelona', 'chelsea', 'arsenal', 'manchester united', 'juventus', 'real madrid', 'manchester city', 'bayern munich'],
  'soccer': ['barcelona', 'chelsea', 'arsenal', 'manchester united', 'juventus', 'real madrid', 'manchester city', 'bayern munich'],
  'jersey': ['barcelona', 'chelsea', 'arsenal', 'manchester united', 'juventus', 'real madrid', 'manchester city', 'bayern munich'],
  'club': ['barcelona', 'chelsea', 'arsenal', 'manchester united', 'juventus', 'real madrid', 'manchester city', 'bayern munich'],
  'music': ['coldplay', 'metallica', 'linkin park', 'nirvana', 'the weeknd'],
  'rock': ['coldplay', 'metallica', 'linkin park', 'nirvana'],
  'band': ['coldplay', 'metallica', 'linkin park', 'nirvana', 'the weeknd'],
  'bands': ['coldplay', 'metallica', 'linkin park', 'nirvana', 'the weeknd'],
  'metal': ['metallica'],
  'clear': ['anti-yellow'],
  'transparent': ['anti-yellow'],
  'transperent': ['anti-yellow'],
  'yellow': ['anti-yellow'],
  'magsafe': ['magsafe'],
  'moto': ['motorola', 'moto'],
  'motorola': ['motorola', 'moto'],
  'redmi': ['redmi'],
  'realme': ['realme', 'narzo'],
  'oneplus': ['oneplus', 'nord'],
  'vivo': ['vivo'],
  'iphone': ['iphone', 'reverb', 'anti-yellow'],
};

// Filter out noise stop words that shouldn't penalize a search
const STOP_WORDS = new Set(['a', 'an', 'the', 'for', 'with', 'case', 'cases', 'cover', 'covers', 'phone', 'mobile']);

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'collections'>('products');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setActiveTab('products');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Robust multi-token scoring search
  const filteredProducts = useMemo(() => {
    const cleanQ = query.trim().toLowerCase();
    if (!cleanQ) return [];

    const rawTokens = cleanQ.split(/\s+/).filter(Boolean);
    const searchTokens = rawTokens.filter((t) => !STOP_WORDS.has(t));
    const tokensToUse = searchTokens.length > 0 ? searchTokens : rawTokens;

    const scored = productsData
      .map((p) => {
        let score = 0;
        const title = p.title.toLowerCase();
        const handle = p.handle.toLowerCase();
        const cat = (p.category_tag || '').toLowerCase();
        const sub = (p.sub_title || '').toLowerCase();
        const fullBlob = `${title} ${handle} ${cat} ${sub}`;

        // 1. Exact or contiguous phrase bonus
        if (title === cleanQ) score += 300;
        else if (title.startsWith(cleanQ)) score += 160;
        else if (title.includes(cleanQ)) score += 110;
        else if (fullBlob.includes(cleanQ)) score += 70;

        let matchedTokens = 0;

        for (const token of tokensToUse) {
          let tokenMatched = false;

          // Word-boundary check for exact word in title
          const wordRx = new RegExp(`\\b${token}\\b`, 'i');
          if (wordRx.test(title)) {
            score += 60;
            tokenMatched = true;
          } else if (title.includes(token)) {
            score += 35;
            tokenMatched = true;
          }

          // Direct alias match (e.g. 'barca' -> 'barcelona', 'starboy' -> 'the weeknd')
          const alias = DIRECT_ALIASES[token];
          if (alias && title.includes(alias)) {
            score += 130;
            tokenMatched = true;
          }

          // Subtitle / category / handle match
          if (sub.includes(token) || cat.includes(token)) {
            score += 30;
            tokenMatched = true;
          } else if (handle.includes(token)) {
            score += 20;
            tokenMatched = true;
          }

          // Category keyword expansion (e.g. 'football' -> list of clubs, 'clear' -> 'anti-yellow')
          const catList = CATEGORY_KEYWORDS[token] || [];
          for (const kw of catList) {
            if (fullBlob.includes(kw)) {
              score += 25;
              tokenMatched = true;
              break;
            }
          }

          if (tokenMatched) matchedTokens++;
        }

        // Multi-token completion bonus
        if (matchedTokens === tokensToUse.length && tokensToUse.length > 1) {
          score += 60;
        }

        return { product: p, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.product);

    return scored;
  }, [query]);

  // Smart collection filtering
  const filteredCollections = useMemo(() => {
    const cleanQ = query.trim().toLowerCase();
    if (!cleanQ) return availableCollections;

    const tokens = cleanQ.split(/\s+/).filter(Boolean);

    return availableCollections.filter((col) => {
      const titleLower = col.title.toLowerCase();
      // Title match
      if (titleLower.includes(cleanQ)) return true;

      // Token matches title
      if (tokens.some((t) => titleLower.includes(t))) return true;

      // Keyword matches
      if (col.keywords.some((kw) => kw.includes(cleanQ) || tokens.some((t) => kw.includes(t) || t.includes(kw)))) {
        return true;
      }

      // Check direct aliases
      for (const t of tokens) {
        const alias = DIRECT_ALIASES[t];
        if (alias && (titleLower.includes(alias) || col.keywords.some((kw) => kw.includes(alias)))) {
          return true;
        }
      }

      return false;
    });
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 99999,
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
        {/* Exact Header matching live Rezoni search bar */}
        <div
          style={{
            height: '62px',
            padding: '0 16px',
            borderBottom: '1px solid #ebebeb',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Thin Search Icon on Left */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="#222222"
            strokeWidth="1.8"
            style={{ flexShrink: 0 }}
          >
            <circle cx="8.5" cy="8.5" r="5.5" />
            <line x1="12.5" y1="12.5" x2="18" y2="18" />
          </svg>

          {/* Borderless Input with 16px font-size to prevent mobile auto-zoom */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases, football, artists, models..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '16px', // 16px prevents iOS Safari / Android auto-zoom
              fontWeight: 400,
              color: '#111111',
              fontFamily: 'inherit',
            }}
          />

          {/* Clear input button when query is present */}
          {query.trim().length > 0 && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search input"
              style={{
                background: '#eeeeee',
                border: 'none',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                cursor: 'pointer',
                color: '#555555',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                padding: 0,
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          )}

          {/* Close Search Drawer Button */}
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
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="2" y1="2" x2="16" y2="16" />
              <line x1="16" y1="2" x2="2" y2="16" />
            </svg>
          </button>
        </div>

        {/* When Query is Present: Show PRODUCTS (N) / COLLECTIONS (N) tabs */}
        {query.trim() !== '' ? (
          <>
            <div
              style={{
                display: 'flex',
                gap: '20px',
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
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  color: activeTab === 'products' ? '#000000' : '#888888',
                  borderBottom: activeTab === 'products' ? '2.5px solid #000000' : '2.5px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>PRODUCTS</span>
                <span
                  style={{
                    backgroundColor: activeTab === 'products' ? '#000000' : '#f0f0f0',
                    color: activeTab === 'products' ? '#ffffff' : '#666666',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontWeight: 700,
                  }}
                >
                  {filteredProducts.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('collections')}
                style={{
                  background: 'none',
                  border: 'none',
                  paddingBottom: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  color: activeTab === 'collections' ? '#000000' : '#888888',
                  borderBottom: activeTab === 'collections' ? '2.5px solid #000000' : '2.5px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>COLLECTIONS</span>
                <span
                  style={{
                    backgroundColor: activeTab === 'collections' ? '#000000' : '#f0f0f0',
                    color: activeTab === 'collections' ? '#ffffff' : '#666666',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontWeight: 700,
                  }}
                >
                  {filteredCollections.length}
                </span>
              </button>
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {activeTab === 'products' ? (
                filteredProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#777' }}>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#222', marginBottom: '8px' }}>
                      No products found for &quot;{query}&quot;
                    </p>
                    <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#666' }}>
                      Try searching for a football club (e.g., Barca, Madrid, United), an artist (e.g., Weeknd, Coldplay), or model (e.g., Redmi, Moto, Realme, OnePlus).
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {filteredProducts.map((item) => (
                      <Link
                        key={item.id}
                        href={`/products/${item.handle}`}
                        onClick={onClose}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          textDecoration: 'none',
                          padding: '8px',
                          borderRadius: '6px',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fbfbfb')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
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
                            border: '1px solid #f0f0f0',
                          }}
                        >
                          <img
                            src={item.primary_image}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#ff6700',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              marginBottom: '2px',
                            }}
                          >
                            {item.sub_title ? `${item.sub_title} • ` : ''}{item.category_tag}
                          </div>
                          <div
                            style={{
                              fontSize: '13px',
                              fontWeight: 600,
                              color: '#111111',
                              lineHeight: 1.35,
                              marginBottom: '4px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.title}
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 700 }}>
                            <span style={{ color: '#000000', marginRight: '8px' }}>
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
                  {filteredCollections.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px 0', color: '#777' }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>No collections matched &quot;{query}&quot;</p>
                    </div>
                  ) : (
                    filteredCollections.map((col, idx) => (
                      <Link
                        key={idx}
                        href={col.href}
                        onClick={onClose}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '6px',
                          backgroundColor: '#f8f8f8',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#111111',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          textDecoration: 'none',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eeeeee')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8f8f8')}
                      >
                        <span>{col.title}</span>
                        <span style={{ color: '#888888', fontSize: '15px' }}>&rarr;</span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Bottom View All Results Button */}
            {filteredProducts.length > 0 && (
              <div style={{ padding: '14px 20px', borderTop: '1px solid #ebebeb' }}>
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
                    height: '46px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 800,
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e65c00')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ff6700')}
                >
                  VIEW ALL {filteredProducts.length} RESULTS
                </Link>
              </div>
            )}
          </>
        ) : (
          /* Empty state: Popular Searches & Featured Collections */
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#888888',
                marginBottom: '12px',
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
                marginBottom: '12px',
              }}
            >
              Featured Collections
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {availableCollections.slice(0, 5).map((col, idx) => (
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
                    textDecoration: 'none',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fafafa')}
                >
                  <span>{col.title}</span>
                  <span style={{ color: '#888888', fontSize: '15px' }}>&rarr;</span>
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
