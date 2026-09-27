'use client';

import React from 'react';
import Link from 'next/link';

export default function VideoBanner() {
  return (
    <section style={{ width: '100%', margin: '48px 0', padding: '0 20px' }}>
      <div
        className="container"
        style={{
          position: 'relative',
          width: '100%',
          height: '75vh',
          minHeight: '420px',
          maxHeight: '750px',
          borderRadius: '8px',
          overflow: 'hidden',
          padding: 0,
        }}
      >
        {/* Desktop Video */}
        <video
          className="desktop-video"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <source src="https://cdn.shopify.com/videos/c/o/v/869764748b154f0d9400d07a3d3f493d.mp4" type="video/mp4" />
        </video>

        {/* Mobile Video */}
        <video
          className="mobile-video"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)',
            display: 'none',
          }}
        >
          <source src="https://cdn.shopify.com/videos/c/o/v/6c95e6cb53b84341a741052bbf89b7f0.mp4" type="video/mp4" />
        </video>

        {/* Overlay Content */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '20px',
            zIndex: 2,
          }}
        >
          <h2
            style={{
              color: '#ffffff',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              marginBottom: '16px',
            }}
          >
            iPhone Cases
          </h2>
          <Link
            href="/collections/iphone-cases"
            style={{
              padding: '12px 36px',
              backgroundColor: '#000000',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ff6700')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#000000')}
          >
            Shop Now
          </Link>
        </div>
      </div>

    </section>
  );
}
