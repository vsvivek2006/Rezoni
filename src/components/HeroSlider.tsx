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

          {/* Desktop Nav Chevrons (matching live site 01_desktop_hero.png: transparent bg, crisp white stroke) */}
          <button
            onClick={() => setActiveDesktopIndex((prev) => (prev - 1 + desktopHeroSlides.length) % desktopHeroSlides.length)}
            aria-label="Previous slide"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              backgroundColor: 'transparent',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              cursor: 'pointer',
              opacity: 0.85,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            onClick={() => setActiveDesktopIndex((prev) => (prev + 1) % desktopHeroSlides.length)}
            aria-label="Next slide"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              backgroundColor: 'transparent',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              cursor: 'pointer',
              opacity: 0.85,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        {/* Slide Content Below (Matching live markup from exact_hero.html) */}
        <div
          style={{
            textAlign: 'center',
            padding: '24px 20px 20px',
            backgroundColor: '#ffffff',
          }}
        >
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: '#000000',
              marginBottom: '6px',
            }}
          >
            {dSlide.title}
          </h2>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#111111',
              marginBottom: '16px',
            }}
          >
            {dSlide.subtitle}
          </p>
          <div>
            <Link
              href={dSlide.link}
              style={{
                display: 'inline-block',
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '12px 34px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                borderRadius: '0px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ff6700')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#000000')}
            >
              Shop Now
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

          {/* Mobile Arrows */}
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
              backgroundColor: 'transparent',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              cursor: 'pointer',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              backgroundColor: 'transparent',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              cursor: 'pointer',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              letterSpacing: '-0.5px',
              color: '#000000',
              marginBottom: '4px',
            }}
          >
            {mSlide.title}
          </h2>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: '#111111',
              marginBottom: '14px',
            }}
          >
            {mSlide.subtitle}
          </p>
          <div>
            <Link
              href={mSlide.link}
              style={{
                display: 'inline-block',
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '10px 28px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                borderRadius: '0px',
              }}
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
