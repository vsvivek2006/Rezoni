'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { CollectionCard } from '@/data/siteData';

interface CollectionCarouselProps {
  title?: string;
  items: CollectionCard[];
}

export default function CollectionCarousel({ title, items }: CollectionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ padding: '36px 0 48px', backgroundColor: '#ffffff', position: 'relative' }}>
      <div className="container">
        {title && (
          <div style={{ marginBottom: '28px', textAlign: 'center' }}>
            <h3
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '32px',
                fontWeight: 900,
                color: '#000000',
                letterSpacing: '-0.5px',
                margin: 0,
              }}
            >
              {title}
            </h3>
          </div>
        )}

        <div style={{ position: 'relative' }}>
          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="hide-scrollbar"
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              paddingBottom: '10px',
            }}
          >
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className="carousel-card-item"
                style={{
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  borderRadius: '0px',
                  overflow: 'hidden',
                  aspectRatio: '1',
                  backgroundColor: '#f5f5f5',
                  transition: 'opacity 0.2s ease',
                  display: 'block',
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                {item.title && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '16px 12px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 700,
                      textAlign: 'center',
                    }}
                  >
                    {item.title}
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Focal Theme Stacked Navigation Buttons on Right Edge (matches 04_best_sellers.png) */}
          <div
            className="hidden-pocket"
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10,
              backgroundColor: '#1c1c1c',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <button
              onClick={() => scroll('left')}
              aria-label="Previous"
              style={{
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1c1c1c',
                color: '#ffffff',
                border: 'none',
                borderBottom: '1px solid #333333',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#000000')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1c1c1c')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>

            <button
              onClick={() => scroll('right')}
              aria-label="Next"
              style={{
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1c1c1c',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#000000')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1c1c1c')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
