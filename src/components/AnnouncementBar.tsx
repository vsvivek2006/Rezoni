'use client';

import React, { useState, useEffect } from 'react';
import { announcements } from '@/data/siteData';

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#ff6700',
        color: '#ffffff',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.4px',
        userSelect: 'none',
      }}
    >
      <button
        onClick={handlePrev}
        aria-label="Previous announcement"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px',
          color: '#ffffff',
          opacity: 0.85,
        }}
      >
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path
            d="M12 5L2.25 5M2.25 5L6.15 9.16M2.25 5L6.15 0.84"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      </button>

      <div
        style={{
          textAlign: 'center',
          flex: 1,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          padding: '0 8px',
        }}
      >
        <span>{announcements[currentIndex].text}</span>
      </div>

      <button
        onClick={handleNext}
        aria-label="Next announcement"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px',
          color: '#ffffff',
          opacity: 0.85,
        }}
      >
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path
            d="M0 5L9.75 5M9.75 5L5.85 9.16M9.75 5L5.85 0.84"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      </button>
    </div>
  );
}
