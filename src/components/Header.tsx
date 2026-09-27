'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import MegaMenu from './MegaMenu';
import SearchModal from './SearchModal';

export default function Header() {
  const { totalCount, setIsCartOpen } = useCart();
  const [megaMenuType, setMegaMenuType] = useState<'category' | 'device' | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: '36px',
          zIndex: 45,
          backgroundColor: '#000000',
          color: '#ffffff',
          borderBottom: '1px solid #1a1a1a',
          transition: 'background 0.2s',
        }}
      >
        <div
          className="container"
          style={{
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Mobile Left: Hamburger & Search */}
          <div className="mobile-left" style={{ display: 'none', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              style={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              style={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ display: 'inline-block' }}>
              <img
                src="https://www.rezoni.com/cdn/shop/files/final_Horizontal_logo_copy-01_200x.png?v=1647520936"
                alt="Rezoni"
                style={{ height: '28px', width: 'auto', display: 'block' }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div
              onMouseEnter={() => setMegaMenuType('category')}
              style={{ position: 'relative', cursor: 'pointer', padding: '16px 0' }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.4px',
                  color: megaMenuType === 'category' ? '#ff6700' : '#ffffff',
                  transition: 'color 0.2s',
                }}
              >
                Shop By Category
              </span>
            </div>

            <div
              onMouseEnter={() => setMegaMenuType('device')}
              style={{ position: 'relative', cursor: 'pointer', padding: '16px 0' }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.4px',
                  color: megaMenuType === 'device' ? '#ff6700' : '#ffffff',
                  transition: 'color 0.2s',
                }}
              >
                Shop By Device
              </span>
            </div>

            <Link
              href="/products/anti-yellow-magsafe-clear-case"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.4px',
                color: '#ffffff',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6700')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
            >
              Anti-Yellow Case
            </Link>

            <Link
              href="/collections/football"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.4px',
                color: '#ffffff',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6700')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
            >
              Collections
            </Link>

            <Link
              href="/pages/our-story"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.4px',
                color: '#ffffff',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6700')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
            >
              Our Story
            </Link>

            <Link
              href="/pages/contact"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.4px',
                color: '#ffffff',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6700')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
            >
              Contact Us
            </Link>

            <Link
              href="/pages/track-order"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.4px',
                color: '#ffffff',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6700')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
            >
              Track Order
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Desktop Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search products"
              className="desktop-search-btn"
              style={{
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6700')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Quick Account / Gokwik Login Icon */}
            <Link
              href="/pages/account"
              aria-label="My Account"
              style={{
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6700')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {/* Kwikpass Lightning Badge on shoulder */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="#ffb703"
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-6px',
                  filter: 'drop-shadow(0 0 2px rgba(255, 183, 3, 0.8))',
                }}
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </Link>

            {/* Cart Icon with Counter Bubble */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View shopping cart"
              style={{
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                padding: '4px',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-6px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: '50%',
                  minWidth: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #000000',
                }}
              >
                {totalCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mega Menu container */}
        {megaMenuType && (
          <MegaMenu
            isOpen={Boolean(megaMenuType)}
            type={megaMenuType}
            onClose={() => setMegaMenuType(null)}
          />
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 99,
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '82%',
              maxWidth: '320px',
              height: '100%',
              backgroundColor: '#000000',
              color: '#ffffff',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <img
                  src="https://www.rezoni.com/cdn/shop/files/final_Horizontal_logo_copy-01_200x.png?v=1647520936"
                  alt="Rezoni"
                  style={{ height: '24px' }}
                />
                <button onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#fff', fontSize: '20px' }}>
                  ✕
                </button>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '15px', fontWeight: 600 }}>
                <li>
                  <Link href="/collections/iphone-cases" onClick={() => setIsMobileMenuOpen(false)}>
                    iPhone Cases
                  </Link>
                </li>
                <li>
                  <Link href="/products/anti-yellow-magsafe-clear-case" onClick={() => setIsMobileMenuOpen(false)}>
                    Anti-Yellow Case
                  </Link>
                </li>
                <li>
                  <Link href="/collections/football" onClick={() => setIsMobileMenuOpen(false)}>
                    Football Collection
                  </Link>
                </li>
                <li>
                  <Link href="/collections/custom-photo-case" onClick={() => setIsMobileMenuOpen(false)}>
                    Polaroid Custom Cases
                  </Link>
                </li>
                <li>
                  <Link href="/pages/our-story" onClick={() => setIsMobileMenuOpen(false)}>
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/pages/contact" onClick={() => setIsMobileMenuOpen(false)}>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/pages/track-order" onClick={() => setIsMobileMenuOpen(false)}>
                    Track Order
                  </Link>
                </li>
              </ul>
            </div>

            <div style={{ borderTop: '1px solid #222', paddingTop: '20px', fontSize: '13px', color: '#888' }}>
              <p>Email: hello@rezoni.com</p>
              <p style={{ marginTop: '4px' }}>Free Shipping Across India</p>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
