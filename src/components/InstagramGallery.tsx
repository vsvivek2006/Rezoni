'use client';

import React from 'react';
import { instagramPhotos } from '@/data/siteData';

export default function InstagramGallery() {
  return (
    <section style={{ padding: '48px 0 64px', backgroundColor: '#ffffff' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h3 className="section-title">Instagram</h3>
          <p style={{ fontSize: '13px', color: '#707070', marginTop: '4px' }}>
            Follow us on Instagram <a href="https://www.instagram.com/shoprezoni/" target="_blank" rel="noopener noreferrer" style={{ color: '#ff6700', fontWeight: 600 }}>@shoprezoni</a>
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {instagramPhotos.map((photo) => (
            <a
              key={photo.id}
              href={photo.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: '6px',
                overflow: 'hidden',
                display: 'block',
                backgroundColor: '#f5f5f5',
                transition: 'transform 0.3s ease, filter 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.filter = 'brightness(0.92)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.filter = 'brightness(1)';
              }}
            >
              <img
                src={photo.image}
                alt="Rezoni Instagram"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  color: '#ffffff',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
