'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import productsData from '@/data/products.json';
import { deviceMediaMap } from '@/data/deviceMediaMap';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Map device to appropriate brand PDP handle
function getBrandHandleForDevice(modelKey: string, modelName: string): string {
  const k = (modelKey + ' ' + modelName).toLowerCase();
  if (k.includes('iphone') || k.includes('airpods') || k.includes('apple')) return 'anti-yellow-magsafe-clear-case';
  if (k.includes('galaxy') || k.includes('samsung') || k.includes('z flip') || k.includes('z fold')) return 'anti-yellow-magsafe-clear-case-samsung';
  if (k.includes('oneplus') || k.includes('nord')) return 'anti-yellow-magsafe-case-oneplus';
  if (k.includes('pixel') || k.includes('google')) return 'anti-yellow-magsafe-clear-case-google-pixel';
  if (k.includes('nothing') || k.includes('cmf')) return 'anti-yellow-magsafe-clear-case-nothing';
  if (k.includes('xiaomi') || k.includes('redmi') || k.includes('mi ')) return 'anti-yellow-magsafe-clear-case-xiaomi';
  if (k.includes('iqoo')) return 'anti-yellow-magsafe-clear-case-iqoo';
  if (k.includes('vivo')) return 'anti-yellow-magsafe-clear-case-vivo';
  if (k.includes('realme') || k.includes('narzo')) return 'anti-yellow-magsafe-clear-case-realme';
  if (k.includes('motorola') || k.includes('moto')) return 'anti-yellow-magsafe-clear-case-motorola';
  if (k.includes('oppo') || k.includes('find n')) return 'anti-yellow-magsafe-clear-case-oppo-x-series';
  if (k.includes('poco')) return 'anti-yellow-magsafe-clear-case-poco';
  return 'anti-yellow-magsafe-clear-case';
}

const DIRECT_ALIASES: Record<string, string> = {
  'barca': 'barcelona',
  'messi': 'barcelona',
  'cr7': 'real madrid',
  'ronaldo': 'real madrid',
  'manu': 'manchester united',
  'mancity': 'manchester city',
  'weeknd': 'the weeknd',
  'antiyellow': 'anti-yellow',
};

const STOP_WORDS = new Set(['a', 'an', 'the', 'for', 'with', 'cover', 'covers', 'case', 'cases']);

export interface SearchResultItem {
  id: string;
  title: string;
  image: string;
  price: number;
  compare_at_price: number;
  href: string;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Search logic matching rezoni: searches products and device models with authentic photos
  const filteredProducts = useMemo(() => {
    const cleanQ = query.trim().toLowerCase();
    if (!cleanQ) return [];

    const rawTokens = cleanQ.split(/[\s\-_\/()]+/).filter(Boolean);
    const searchTokens = rawTokens.filter((t) => !STOP_WORDS.has(t));
    const tokensToUse = searchTokens.length > 0 ? searchTokens : rawTokens;
    const compactQ = cleanQ.replace(/[\s\-_()]+/g, '');

    const results: Array<{ item: SearchResultItem; score: number }> = [];
    const seenHrefs = new Set<string>();

    // 1. Match phone models in deviceMediaMap
    for (const [modelKey, device] of Object.entries(deviceMediaMap)) {
      const devName = device.name || modelKey;
      const devNameLower = devName.toLowerCase();
      const combined = `${modelKey} ${devNameLower}`;
      const compactCombined = combined.replace(/[\s\-_()]+/g, '');

      let modelScore = 0;

      if (devNameLower === cleanQ || modelKey === cleanQ) {
        modelScore += 700;
      } else if (compactCombined.includes(compactQ) && compactQ.length >= 3) {
        modelScore += 550;
      } else if (devNameLower.includes(cleanQ) || modelKey.includes(cleanQ)) {
        modelScore += 450;
      } else {
        const allTokensMatch = tokensToUse.every((t) => {
          const alias = DIRECT_ALIASES[t] || t;
          return combined.includes(alias) || compactCombined.includes(alias);
        });

        if (allTokensMatch && tokensToUse.length > 0) {
          modelScore += 350 + tokensToUse.length * 40;
        }
      }

      if (modelScore > 0) {
        const brandHandle = getBrandHandleForDevice(modelKey, devName);
        const href = `/products/${brandHandle}?model=${encodeURIComponent(devName)}`;

        if (!seenHrefs.has(href)) {
          seenHrefs.add(href);
          results.push({
            item: {
              id: `device-${modelKey}`,
              title: `Anti-Yellow Magsafe Clear Case ${devName}`,
              image: device.magsafe || device.clear || 'https://cdn.shopify.com/s/files/1/0621/7829/6040/files/DSC00062.jpg?v=1729097458',
              price: 699,
              compare_at_price: 999,
              href,
            },
            score: modelScore,
          });
        }
      }
    }

    // 2. Match products in productsData
    for (const p of productsData as any[]) {
      let score = 0;
      let matchedModel: string | undefined = undefined;

      const title = (p.title || '').toLowerCase();
      const handle = (p.handle || '').toLowerCase();
      const models: string[] = p.models || [];
      const modelsStr = models.join(' ').toLowerCase();

      if (title === cleanQ) {
        score += 500;
      } else if (title.startsWith(cleanQ)) {
        score += 300;
      } else if (title.includes(cleanQ)) {
        score += 200;
      }

      if (modelsStr.includes(cleanQ)) {
        score += 220;
        const found = models.find((m) => m.toLowerCase().includes(cleanQ));
        if (found) matchedModel = found;
      }

      let matchedTokens = 0;
      for (const token of tokensToUse) {
        const alias = DIRECT_ALIASES[token] || token;
        if (title.includes(alias)) {
          score += 70;
          matchedTokens++;
        } else if (handle.includes(alias)) {
          score += 40;
          matchedTokens++;
        } else if (modelsStr.includes(alias)) {
          score += 35;
          matchedTokens++;
          if (!matchedModel) {
            const found = models.find((m) => m.toLowerCase().includes(alias));
            if (found) matchedModel = found;
          }
        }
      }

      if (matchedTokens === tokensToUse.length && tokensToUse.length > 1) {
        score += 100;
      }

      if (score > 0) {
        const href = matchedModel
          ? `/products/${p.handle}?model=${encodeURIComponent(matchedModel)}`
          : `/products/${p.handle}`;

        if (!seenHrefs.has(href)) {
          seenHrefs.add(href);
          results.push({
            item: {
              id: p.id || p.handle,
              title: p.title,
              image: p.primary_image,
              price: Number(p.price || 699),
              compare_at_price: Number(p.compare_at_price || 999),
              href,
            },
            score,
          });
        }
      }
    }

    return results.sort((a, b) => b.score - a.score).map((r) => r.item);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/collections/all?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'flex-end', // Slide in from right (1:1 with Rezoni)
        fontFamily: 'Montserrat, sans-serif',
      }}
      onClick={onClose}
    >
      {/* 1:1 Rezoni Predictive Search Drawer */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          backgroundColor: '#ffffff',
          color: '#000000',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 35px rgba(0,0,0,0.25)',
          animation: 'slideInRight 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header matching Rezoni 1:1 */}
        <header
          style={{
            height: '64px',
            padding: '0 20px',
            borderBottom: '1px solid #ebebeb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flex: 1,
            }}
          >
            {/* 1:1 Rezoni Search Icon */}
            <svg
              focusable="false"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              style={{ flexShrink: 0, stroke: 'currentColor', fill: 'none' }}
            >
              <path
                d="M12.336 12.336c2.634-2.635 2.682-6.859.106-9.435-2.576-2.576-6.8-2.528-9.435.106C.373 5.642.325 9.866 2.901 12.442c2.576 2.576 6.8 2.528 9.435-.106zm0 0L17 17"
                strokeWidth="1.9"
              />
            </svg>

            {/* 1:1 Rezoni Input Placeholder */}
            <input
              ref={inputRef}
              type="text"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              aria-label="Search"
              placeholder="What are you looking for?"
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '15px',
                fontWeight: 500,
                color: '#111111',
                fontFamily: 'inherit',
                background: 'transparent',
              }}
            />
          </form>

          {/* 1:1 Rezoni Close Button */}
          <button
            type="button"
            onClick={onClose}
            title="Close"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#222222',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg focusable="false" width="14" height="14" viewBox="0 0 14 14" style={{ stroke: 'currentColor', fill: 'none' }}>
              <path d="M13 13L1 1M13 1L1 13" strokeWidth="1.9" />
            </svg>
          </button>
        </header>

        {/* Drawer Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {query.trim() !== '' && (
            <div>
              {/* Rezoni Tab Header */}
              <div
                style={{
                  padding: '16px 20px 10px',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#111111',
                    borderBottom: '2px solid #000000',
                    paddingBottom: '10px',
                    display: 'inline-block',
                  }}
                >
                  Products ({filteredProducts.length})
                </span>
              </div>

              {/* 1:1 Rezoni Product List */}
              <div style={{ padding: '8px 20px' }}>
                {filteredProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#777777', fontSize: '14px' }}>
                    No results could be found.
                  </div>
                ) : (
                  filteredProducts.slice(0, 25).map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 0',
                        borderBottom: '1px solid #f5f5f5',
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            width: '52px',
                            height: '62px',
                            backgroundColor: '#fafafa',
                            borderRadius: '3px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </span>

                        <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                          <span
                            style={{
                              display: 'block',
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
                          </span>

                          <div style={{ fontSize: '13px' }}>
                            <span style={{ color: '#ff6700', fontWeight: 700, marginRight: '8px' }}>
                              Rs. {Number(item.price).toFixed(2)}
                            </span>
                            {item.compare_at_price > item.price && (
                              <span style={{ color: '#999999', textDecoration: 'line-through', fontSize: '12px' }}>
                                Rs. {Number(item.compare_at_price).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 1:1 Rezoni Right Arrow */}
                      <svg
                        focusable="false"
                        width="17"
                        height="14"
                        viewBox="0 0 17 14"
                        style={{ stroke: 'currentColor', fill: 'none', flexShrink: 0, color: '#888888' }}
                      >
                        <path d="M0 7h15M9 1l6 6-6 6" strokeWidth="1.9" />
                      </svg>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer matching Rezoni 1:1 */}
        {query.trim() !== '' && filteredProducts.length > 0 && (
          <footer
            style={{
              padding: '16px 20px',
              borderTop: '1px solid #ebebeb',
            }}
          >
            <Link
              href={`/collections/all?q=${encodeURIComponent(query.trim())}`}
              onClick={onClose}
              style={{
                display: 'block',
                width: '100%',
                backgroundColor: '#000000',
                color: '#ffffff',
                textAlign: 'center',
                padding: '14px 0',
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderRadius: '3px',
                textDecoration: 'none',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ff6700')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#000000')}
            >
              View all results
            </Link>
          </footer>
        )}
      </div>
    </div>
  );
}
