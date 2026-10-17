'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import MegaMenu from './MegaMenu';
import SearchModal from './SearchModal';
import { mobileDeviceBrands } from '@/data/deviceMenuData';

export default function Header() {
  const router = useRouter();
  const { totalCount, setIsCartOpen } = useCart();
  const { user, openAuthModal } = useAuth();
  const [megaMenuType, setMegaMenuType] = useState<'category' | 'device' | 'collections' | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (id: string) => {
    setMobileExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        onMouseLeave={() => setMegaMenuType(null)}
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
          {/* Mobile Left: Hamburger (☰) & Search (🔍) matching Rezoni live store */}
          <div className="mobile-left" style={{ display: 'none', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="header-icon-btn"
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
              className="header-icon-btn"
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
                className={`link--animated ${megaMenuType === 'category' ? 'is-active' : ''}`}
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
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
                className={`link--animated ${megaMenuType === 'device' ? 'is-active' : ''}`}
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                }}
              >
                Shop By Device
              </span>
            </div>

            <Link
              href="/products/anti-yellow-magsafe-clear-case"
              className="link--animated"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}
            >
              Anti-Yellow Case
            </Link>

            <div
              onMouseEnter={() => setMegaMenuType('collections')}
              style={{ position: 'relative', cursor: 'pointer', padding: '16px 0' }}
            >
              <span
                className={`link--animated ${megaMenuType === 'collections' ? 'is-active' : ''}`}
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                }}
              >
                Collections
              </span>
            </div>

            <Link
              href="/pages/our-story"
              className="link--animated"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}
            >
              Our Story
            </Link>

            <Link
              href="/pages/contact"
              className="link--animated"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}
            >
              Contact Us
            </Link>

            <Link
              href="/track-order"
              className="link--animated"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}
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
              className="desktop-search-btn header-icon-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Desktop Account / Kwikpass Icon */}
            <button
              onClick={() => {
                if (user) {
                  router.push('/pages/account');
                } else {
                  openAuthModal('register');
                }
              }}
              aria-label="My Account"
              className="desktop-account-btn header-icon-btn"
              style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
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
            </button>

            {/* Shopping Bag Icon with Counter Bubble */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View shopping cart"
              className="header-icon-btn"
              style={{ position: 'relative' }}
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
                  backgroundColor: '#ff6700',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 800,
                  borderRadius: '50%',
                  minWidth: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #000000',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.4)',
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

      {/* Mega Menu Backdrop Dimmer Overlay */}
      <div
        className={`mega-menu-backdrop ${megaMenuType ? 'is-open' : ''}`}
        onClick={() => setMegaMenuType(null)}
      />

      {/* Predictive Search Drawer from Left */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Drawer Navigation (Deeply 1:1 with Rezoni.com) */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 150,
          }}
          onClick={closeMobileMenu}
        >
          <div
            style={{
              width: '89vw',
              maxWidth: '400px',
              height: '100%',
              backgroundColor: '#ffffff',
              color: '#111111',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              animation: 'slideFromLeft 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
              overflowY: 'auto',
              boxShadow: '16px 0 40px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header with Close Button on Top Right (1:1 Rezoni) */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '20px 24px 6px',
                flexShrink: 0,
              }}
            >
              <button
                onClick={closeMobileMenu}
                aria-label="Close menu"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#111111',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <path d="M13 13L1 1M13 1L1 13" stroke="currentColor" strokeWidth="1.9" fill="none"></path>
                </svg>
              </button>
            </div>

            {/* Drawer Body Navigation List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* 1. Shop By Category Accordion */}
                <div className="mobile-nav-item">
                  <button
                    onClick={() => toggleSection('category')}
                    className="mobile-nav-trigger"
                  >
                    <span>Shop By Category</span>
                    <span className={`animated-plus ${mobileExpanded['category'] ? 'is-open' : ''}`} />
                  </button>
                  {mobileExpanded['category'] && (
                    <div style={{ paddingLeft: '8px', paddingBottom: '16px' }}>
                      <Link href="/collections/iphone-cases" onClick={closeMobileMenu} className="mobile-sub-link">
                        iPhone Cases
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-clear-case-samsung" onClick={closeMobileMenu} className="mobile-sub-link">
                        Samsung Cases
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-case-oneplus" onClick={closeMobileMenu} className="mobile-sub-link">
                        OnePlus Cases
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-clear-case-google-pixel" onClick={closeMobileMenu} className="mobile-sub-link">
                        Google Pixel Cases
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-clear-case-nothing" onClick={closeMobileMenu} className="mobile-sub-link">
                        Nothing Cases
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-clear-case-vivo" onClick={closeMobileMenu} className="mobile-sub-link">
                        Vivo Cases
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-clear-case-iqoo" onClick={closeMobileMenu} className="mobile-sub-link">
                        iQOO Cases
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-clear-case-oppo-x-series" onClick={closeMobileMenu} className="mobile-sub-link">
                        Oppo Cases
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-clear-case-realme" onClick={closeMobileMenu} className="mobile-sub-link">
                        Realme Cases
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-clear-case-redmi" onClick={closeMobileMenu} className="mobile-sub-link">
                        Redmi Cases
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-clear-case-xiaomi" onClick={closeMobileMenu} className="mobile-sub-link">
                        Xiaomi Cases
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-clear-case-motorola" onClick={closeMobileMenu} className="mobile-sub-link">
                        Motorola Cases
                      </Link>
                      <Link href="/collections/airpods-gen-1-2" onClick={closeMobileMenu} className="mobile-sub-link">
                        AirPods Cases
                      </Link>
                      <Link href="/collections/phone-grips" onClick={closeMobileMenu} className="mobile-sub-link">
                        Phone Grips
                      </Link>

                      {/* 1:1 Horizontal Image Scroller below categories */}
                      <div className="mobile-images-scroller">
                        <Link href="/collections/iphone-cases" onClick={closeMobileMenu} className="mobile-image-card">
                          <img
                            src="https://www.rezoni.com/cdn/shop/files/menu_phone_case_480x.jpg?v=1656144671"
                            alt="iPhone Cases"
                            loading="lazy"
                          />
                          <span>iPhone Cases</span>
                        </Link>
                        <Link href="/collections/airpods-gen-1-2" onClick={closeMobileMenu} className="mobile-image-card">
                          <img
                            src="https://www.rezoni.com/cdn/shop/files/Menu_airpod_480x.jpg?v=1656144670"
                            alt="AirPods Cases"
                            loading="lazy"
                          />
                          <span>AirPods Cases</span>
                        </Link>
                        <Link href="/collections/phone-grips" onClick={closeMobileMenu} className="mobile-image-card">
                          <img
                            src="https://www.rezoni.com/cdn/shop/files/menu_phone_grip_480x.jpg?v=1656144670"
                            alt="Phone Grips"
                            loading="lazy"
                          />
                          <span>Phone Grips</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Shop By Device Accordion with Nested Brand Accordions (1:1 Rezoni) */}
                <div className="mobile-nav-item">
                  <button
                    onClick={() => toggleSection('device')}
                    className="mobile-nav-trigger"
                  >
                    <span>Shop By Device</span>
                    <span className={`animated-plus ${mobileExpanded['device'] ? 'is-open' : ''}`} />
                  </button>
                  {mobileExpanded['device'] && (
                    <div style={{ paddingLeft: '8px', paddingBottom: '16px' }}>
                      {mobileDeviceBrands.map((brand) => (
                        <div key={brand.id} style={{ marginBottom: '10px' }}>
                          <button
                            onClick={() => toggleSection(brand.id)}
                            className="mobile-sub-trigger"
                          >
                            <span>{brand.brand}</span>
                            <span className={`animated-plus ${mobileExpanded[brand.id] ? 'is-open' : ''}`} />
                          </button>
                          {mobileExpanded[brand.id] && (
                            <div
                              style={{
                                borderLeft: '1px solid #e0e0e0',
                                paddingLeft: '14px',
                                marginTop: '6px',
                                marginBottom: '8px',
                                maxHeight: '340px',
                                overflowY: 'auto',
                              }}
                            >
                              {brand.items.map((item, itIdx) => {
                                const itemUrl = item.href.includes('model=')
                                  ? item.href
                                  : `${item.href}${item.href.includes('?') ? '&' : '?'}model=${encodeURIComponent(item.name)}`;
                                return (
                                  <Link
                                    key={`${item.name}-${itIdx}`}
                                    href={itemUrl}
                                    onClick={closeMobileMenu}
                                    className={`mobile-sub-link ${item.isOrange ? 'link-orange' : ''}`}
                                  >
                                    {item.name}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Anti-Yellow Clear Case (Direct Link 1:1 Rezoni) */}
                <div className="mobile-nav-item">
                  <Link
                    href="/products/anti-yellow-magsafe-clear-case"
                    onClick={closeMobileMenu}
                    className="mobile-nav-trigger"
                  >
                    <span>Anti-Yellow Clear Case</span>
                  </Link>
                </div>

                {/* 4. Reverb 2.0 Clear Case (Direct Link 1:1 Rezoni) */}
                <div className="mobile-nav-item">
                  <Link
                    href="/products/reverb-2-0-impact-magsafe-clear-case"
                    onClick={closeMobileMenu}
                    className="mobile-nav-trigger"
                  >
                    <span>Reverb 2.0 Clear Case</span>
                  </Link>
                </div>

                {/* 5. Collections Accordion (1:1 Rezoni) */}
                <div className="mobile-nav-item">
                  <button
                    onClick={() => toggleSection('collections')}
                    className="mobile-nav-trigger"
                  >
                    <span>Collections</span>
                    <span className={`animated-plus ${mobileExpanded['collections'] ? 'is-open' : ''}`} />
                  </button>
                  {mobileExpanded['collections'] && (
                    <div style={{ paddingLeft: '8px', paddingBottom: '16px' }}>
                      <Link href="/collections/new-arrivals" onClick={closeMobileMenu} className="mobile-sub-link link-orange">
                        New Arrivals
                      </Link>
                      <Link href="/products/anti-yellow-magsafe-clear-case" onClick={closeMobileMenu} className="mobile-sub-link">
                        Anti-Yellow Case
                      </Link>
                      <Link href="/products/reverb-2-0-impact-magsafe-clear-case" onClick={closeMobileMenu} className="mobile-sub-link">
                        Reverb 2.0 Clear Case
                      </Link>
                      <Link href="/products/clearvue" onClick={closeMobileMenu} className="mobile-sub-link">
                        Reverb Clear Case
                      </Link>
                      <Link href="/collections/football" onClick={closeMobileMenu} className="mobile-sub-link">
                        Football
                      </Link>
                      <Link href="/collections/mixtape" onClick={closeMobileMenu} className="mobile-sub-link">
                        Mixtape
                      </Link>
                      <Link href="/collections/unisex" onClick={closeMobileMenu} className="mobile-sub-link">
                        Unisex
                      </Link>
                      <Link href="/collections/custom-photo-case" onClick={closeMobileMenu} className="mobile-sub-link">
                        Custom Photo Case
                      </Link>
                      <Link href="/collections/wild-cats" onClick={closeMobileMenu} className="mobile-sub-link">
                        Wild Cats
                      </Link>
                      <Link href="/collections/y2k" onClick={closeMobileMenu} className="mobile-sub-link">
                        Y2K
                      </Link>
                      <Link href="/collections/prints-seen-on-social" onClick={closeMobileMenu} className="mobile-sub-link">
                        Prints Seen On Social
                      </Link>
                      <Link href="/collections/personalised" onClick={closeMobileMenu} className="mobile-sub-link">
                        Personalized
                      </Link>
                      <Link href="/collections/zodiac" onClick={closeMobileMenu} className="mobile-sub-link">
                        Zodiac
                      </Link>
                      <Link href="/collections/featured-prints" onClick={closeMobileMenu} className="mobile-sub-link">
                        Featured Prints
                      </Link>
                      <Link href="/collections/polaroid-photo-case" onClick={closeMobileMenu} className="mobile-sub-link">
                        Polaroid Photo Case
                      </Link>
                      <Link href="/collections/heart" onClick={closeMobileMenu} className="mobile-sub-link">
                        Hearts
                      </Link>
                      <Link href="/collections/butterfly" onClick={closeMobileMenu} className="mobile-sub-link">
                        Butterfly
                      </Link>
                      <Link href="/collections/floral" onClick={closeMobileMenu} className="mobile-sub-link">
                        Floral
                      </Link>
                      <Link href="/collections/tie-dye" onClick={closeMobileMenu} className="mobile-sub-link">
                        Tie Dye
                      </Link>
                      <Link href="/collections/stickers" onClick={closeMobileMenu} className="mobile-sub-link">
                        Stickers
                      </Link>
                      <Link href="/collections/matching-sets" onClick={closeMobileMenu} className="mobile-sub-link">
                        Matching Sets
                      </Link>
                    </div>
                  )}
                </div>

                {/* 6. Our Story (Direct Link) */}
                <div className="mobile-nav-item">
                  <Link
                    href="/pages/our-story"
                    onClick={closeMobileMenu}
                    className="mobile-nav-trigger"
                  >
                    <span>Our Story</span>
                  </Link>
                </div>

                {/* 7. Contact Us (Direct Link) */}
                <div className="mobile-nav-item">
                  <Link
                    href="/pages/contact"
                    onClick={closeMobileMenu}
                    className="mobile-nav-trigger"
                  >
                    <span>Contact Us</span>
                  </Link>
                </div>

                {/* 8. Track Order (Direct Link) */}
                <div className="mobile-nav-item" style={{ borderBottom: 'none' }}>
                  <Link
                    href="/track-order"
                    onClick={closeMobileMenu}
                    className="mobile-nav-trigger"
                  >
                    <span>Track Order</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Drawer Footer (1:1 with Rezoni live store) */}
            <div
              style={{
                borderTop: '1px solid rgba(0,0,0,0.08)',
                padding: '20px 24px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              {/* Account / Kwikpass Log In */}
              <button
                onClick={() => {
                  closeMobileMenu();
                  if (user) {
                    router.push('/pages/account');
                  } else {
                    openAuthModal('register');
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#111111',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 27 27" fill="none">
                  <path d="M22.9129 12.935L13.7571 23.0474C13.5348 23.2929 13.1284 23.1084 13.1669 22.7794L14.0816 14.9731H10.6991C10.4034 14.9731 10.2484 14.6219 10.4478 14.4035L20.3133 3.59739C20.5589 3.32834 20.9984 3.58134 20.8891 3.92887L18.2354 12.3664H22.6607C22.9557 12.3664 23.1109 12.7163 22.9129 12.935Z" fill="#FEA203"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M16.6079 5.35819C16.4805 5.1933 16.3421 5.03582 16.1932 4.8869C15.2702 3.96387 14.0183 3.44531 12.7129 3.44531C11.4075 3.44531 10.1556 3.96387 9.2326 4.8869C8.30957 5.80993 7.79102 7.06183 7.79102 8.36719C7.79102 9.67255 8.30957 10.9244 9.2326 11.8475C9.48368 12.0986 9.75909 12.3197 10.0533 12.5086L11.0235 11.4503C10.7335 11.2914 10.4649 11.0911 10.227 10.8531C9.56766 10.1938 9.19727 9.29959 9.19727 8.36719C9.19727 7.43479 9.56766 6.54057 10.227 5.88127C10.8863 5.22196 11.7805 4.85156 12.7129 4.85156C13.6453 4.85156 14.5395 5.22196 15.1988 5.88127C15.3636 6.04604 15.5103 6.22549 15.6377 6.41654L16.6079 5.35819ZM20.6413 18.6497L19.6746 19.7132C20.1676 20.4122 20.4473 21.2264 20.4473 22.0781V23.8359C20.4473 24.2243 20.7621 24.5391 21.1504 24.5391C21.5387 24.5391 21.8535 24.2243 21.8535 23.8359V22.0781C21.8535 20.7863 21.4016 19.6103 20.6413 18.6497ZM12.3111 17.5078H10.3026C7.27113 17.5078 4.97852 19.6394 4.97852 22.0781V23.8359C4.97852 24.2243 4.66372 24.5391 4.27539 24.5391C3.88707 24.5391 3.57227 24.2243 3.57227 23.8359V22.0781C3.57227 18.6922 6.67684 16.1016 10.3026 16.1016H12.4885L12.3111 17.5078Z" fill="currentColor"/>
                </svg>
                <span>{user ? 'Account' : 'Log in'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
