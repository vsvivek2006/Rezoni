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
  const [mobileExpanded, setMobileExpanded] = useState<{ [key: string]: boolean }>({});

  const toggleMobileCategory = (cat: string) => {
    setMobileExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

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
        }}
      >
        <div
          className="container"
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {/* Mobile Left: Hamburger (☰) & Search (🔍) matching 03_mobile_hero.png */}
          <div className="mobile-left" style={{ display: 'none', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              style={{ color: '#ffffff', display: 'flex', alignItems: 'center', padding: '4px' }}
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
              style={{ color: '#ffffff', display: 'flex', alignItems: 'center', padding: '4px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          {/* Logo - Centered on mobile via CSS class header-logo-container */}
          <div className="header-logo-container" style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ display: 'inline-block' }}>
              <img
                src="https://www.rezoni.com/cdn/shop/files/final_Horizontal_logo_copy-01_200x.png?v=1647520936"
                alt="Rezoni"
                style={{ height: '24px', width: 'auto', display: 'block' }}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
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
                padding: '4px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6700')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Desktop Account / Kwikpass Icon */}
            <Link
              href="/pages/account"
              aria-label="My Account"
              className="desktop-account-btn"
              style={{
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                transition: 'color 0.2s',
                padding: '4px',
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

            {/* Shopping Bag Icon with Counter Bubble (Visible on both Desktop and Mobile matching 03_mobile_hero.png) */}
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
                  fontWeight: 800,
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

      {/* Predictive Search Drawer from Left */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Drawer Navigation sliding from Left */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            zIndex: 150,
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '84%',
              maxWidth: '340px',
              height: '100%',
              backgroundColor: '#000000',
              color: '#ffffff',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              animation: 'slideFromLeft 0.25s ease-out',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <img
                  src="https://www.rezoni.com/cdn/shop/files/final_Horizontal_logo_copy-01_200x.png?v=1647520936"
                  alt="Rezoni"
                  style={{ height: '22px' }}
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  style={{ color: '#fff', fontSize: '20px', padding: '4px' }}
                >
                  ✕
                </button>
              </div>

              {/* Navigation List with Accordions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '15px', fontWeight: 600 }}>
                {/* Shop By Category Accordion */}
                <div style={{ borderBottom: '1px solid #1a1a1a', paddingBottom: '10px' }}>
                  <div
                    onClick={() => toggleMobileCategory('category')}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      cursor: 'pointer',
                    }}
                  >
                    <span>Shop By Category</span>
                    <span style={{ fontSize: '18px', color: '#ff6700' }}>
                      {mobileExpanded['category'] ? '−' : '+'}
                    </span>
                  </div>
                  {mobileExpanded['category'] && (
                    <div style={{ paddingLeft: '14px', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#ccc' }}>
                      <Link href="/collections/iphone-cases" onClick={() => setIsMobileMenuOpen(false)}>
                        iPhone Cases
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-clear-case-samsung" onClick={() => setIsMobileMenuOpen(false)}>
                        Samsung Cases
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-case-oneplus" onClick={() => setIsMobileMenuOpen(false)}>
                        OnePlus Cases
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-clear-case-google-pixel" onClick={() => setIsMobileMenuOpen(false)}>
                        Google Pixel Cases
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-clear-case-nothing" onClick={() => setIsMobileMenuOpen(false)}>
                        Nothing Cases
                      </Link>
                      <Link href="/collections/all" onClick={() => setIsMobileMenuOpen(false)}>
                        All Collections
                      </Link>
                    </div>
                  )}
                </div>

                {/* Shop By Device Accordion */}
                <div style={{ borderBottom: '1px solid #1a1a1a', paddingBottom: '10px' }}>
                  <div
                    onClick={() => toggleMobileCategory('device')}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      cursor: 'pointer',
                    }}
                  >
                    <span>Shop By Device</span>
                    <span style={{ fontSize: '18px', color: '#ff6700' }}>
                      {mobileExpanded['device'] ? '−' : '+'}
                    </span>
                  </div>
                  {mobileExpanded['device'] && (
                    <div style={{ paddingLeft: '14px', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#ccc' }}>
                      <Link href="/collections/iphone-cases" onClick={() => setIsMobileMenuOpen(false)}>
                        Apple iPhone
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-clear-case-samsung" onClick={() => setIsMobileMenuOpen(false)}>
                        Samsung Galaxy
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-case-oneplus" onClick={() => setIsMobileMenuOpen(false)}>
                        OnePlus
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-clear-case-google-pixel" onClick={() => setIsMobileMenuOpen(false)}>
                        Google Pixel
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-clear-case-nothing" onClick={() => setIsMobileMenuOpen(false)}>
                        Nothing Phone
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/products/anti-yellow-magsafe-clear-case"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}
                >
                  Anti-Yellow Case
                </Link>

                <Link
                  href="/collections/football"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}
                >
                  Football Collection
                </Link>

                <Link
                  href="/pages/our-story"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}
                >
                  Our Story
                </Link>

                <Link
                  href="/pages/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}
                >
                  Contact Us
                </Link>

                <Link
                  href="/pages/track-order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}
                >
                  Track Order
                </Link>
              </div>
            </div>

            {/* Mobile Drawer Bottom with Kwikpass Login & Info */}
            <div style={{ borderTop: '1px solid #222', paddingTop: '20px', marginTop: '24px' }}>
              <Link
                href="/pages/account"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: '14px',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="#ffb703"
                    style={{ position: 'absolute', top: '-3px', right: '-4px' }}
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <span>Login / My Account</span>
              </Link>
              <p style={{ fontSize: '11px', color: '#777', margin: '4px 0' }}>Support: hello@rezoni.com</p>
              <p style={{ fontSize: '11px', color: '#ff6700', fontWeight: 600, margin: 0 }}>Free Express Shipping Across India</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
