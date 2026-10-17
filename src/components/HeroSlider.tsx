'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { desktopHeroSlides, mobileHeroSlides } from '@/data/siteData';

export default function HeroSlider() {
  const [activeDesktopIndex, setActiveDesktopIndex] = useState(0);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDesktopIndex((prev) => (prev + 1) % desktopHeroSlides.length);
      setActiveMobileIndex((prev) => (prev + 1) % mobileHeroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const dSlide = desktopHeroSlides[activeDesktopIndex];
  const mSlide = mobileHeroSlides[activeMobileIndex];

  return (
    <section style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* ================= DESKTOP SLIDER ================= */}
      <div className="desktop-hero-container">
        <div style={{ position: 'relative', width: '100%', aspectRatio: '3600/1600', maxHeight: '720px' }}>
          {desktopHeroSlides.map((slide, idx) => (
            <Link
              key={slide.id}
              href={slide.link}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: idx === activeDesktopIndex ? 1 : 0,
                visibility: idx === activeDesktopIndex ? 'visible' : 'hidden',
                transition: 'opacity 0.6s ease-in-out',
                display: 'block',
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Link>
          ))}

          {/* Desktop Nav Chevrons (matching live site: circular glass bg, crisp white stroke) */}
          <button
            onClick={() => setActiveDesktopIndex((prev) => (prev - 1 + desktopHeroSlides.length) % desktopHeroSlides.length)}
            aria-label="Previous slide"
            style={{
              position: 'absolute',
              left: '16px',
              top: '55%',
              transform: 'translateY(-50%)',
              width: '42px',
              height: '42px',
              backgroundColor: 'rgba(255, 255, 255, 0.38)',
              backdropFilter: 'blur(4px)',
              color: '#ffffff',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              cursor: 'pointer',
              transition: 'background-color 0.2s, transform 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.6)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.38)')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            onClick={() => setActiveDesktopIndex((prev) => (prev + 1) % desktopHeroSlides.length)}
            aria-label="Next slide"
            style={{
              position: 'absolute',
              right: '16px',
              top: '55%',
              transform: 'translateY(-50%)',
              width: '42px',
              height: '42px',
              backgroundColor: 'rgba(255, 255, 255, 0.38)',
              backdropFilter: 'blur(4px)',
              color: '#ffffff',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              cursor: 'pointer',
              transition: 'background-color 0.2s, transform 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.6)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.38)')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        {/* Slide Content Below (Matching live markup from exact rezoni.com) */}
        <div
          style={{
            textAlign: 'center',
            padding: '24px 20px 20px',
            backgroundColor: '#ffffff',
          }}
        >
          <h2
            style={{
              fontSize: '29px',
              fontWeight: 800,
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '0.2px',
              color: '#000000',
              paddingTop: '8px',
              marginBottom: '4px',
            }}
          >
            {dSlide?.title}
          </h2>
          <p
            style={{
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '0.2px',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '16px',
            }}
          >
            {dSlide?.subtitle}
          </p>
          <div>
            <Link
              href={dSlide?.link || '/collections/all'}
              style={{
                display: 'inline-block',
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '14px 24px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e65c00')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#000000')}
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>

      {/* ================= MOBILE SLIDER ================= */}
      <div className="mobile-hero-container">
        <div style={{ position: 'relative', width: '100%', aspectRatio: '800/1000' }}>
          {mobileHeroSlides.map((slide, idx) => (
            <Link
              key={slide.id}
              href={slide.link}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: idx === activeMobileIndex ? 1 : 0,
                visibility: idx === activeMobileIndex ? 'visible' : 'hidden',
                transition: 'opacity 0.6s ease-in-out',
                display: 'block',
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Link>
          ))}

          {/* Mobile Chevrons */}
          <button
            onClick={() => setActiveMobileIndex((prev) => (prev - 1 + mobileHeroSlides.length) % mobileHeroSlides.length)}
            aria-label="Previous mobile slide"
            style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '36px',
              height: '36px',
              backgroundColor: 'rgba(255, 255, 255, 0.38)',
              backdropFilter: 'blur(4px)',
              color: '#ffffff',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              cursor: 'pointer',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            onClick={() => setActiveMobileIndex((prev) => (prev + 1) % mobileHeroSlides.length)}
            aria-label="Next mobile slide"
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '36px',
              height: '36px',
              backgroundColor: 'rgba(255, 255, 255, 0.38)',
              backdropFilter: 'blur(4px)',
              color: '#ffffff',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              cursor: 'pointer',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        {/* Mobile Slide Content */}
        <div
          style={{
            textAlign: 'center',
            padding: '20px 16px',
            backgroundColor: '#ffffff',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 800,
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '0.2px',
              color: '#000000',
              marginBottom: '4px',
            }}
          >
            {mSlide?.title}
          </h2>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '0.2px',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '14px',
            }}
          >
            {mSlide?.subtitle}
          </p>
          <div>
            <Link
              href={mSlide?.link || '/collections/all'}
              style={{
                display: 'inline-block',
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '12px 24px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                borderRadius: '4px',
              }}
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
