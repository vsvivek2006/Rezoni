'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const infoLinks = [
    { label: 'Our Story', href: '/pages/our-story' },
    { label: 'Shipping Policy', href: '/pages/shipping-policy' },
    { label: 'Returns/Refunds/Exchanges', href: '/pages/returns-refunds-exchanges' },
    { label: 'Cancellation Policy', href: '/pages/cancellation-policy' },
    { label: 'Terms & Conditions', href: '/pages/terms-and-conditions' },
    { label: 'Privacy Policy', href: '/pages/privacy-policy' },
    { label: 'Contact Us', href: '/pages/contact' },
  ];

  const shopLinks = [
    { label: 'iPhone Cases', href: '/collections/iphone-cases' },
    { label: 'Samsung Cases', href: '/products/anti-yellow-magsafe-clear-case-samsung' },
    { label: 'OnePlus', href: '/products/anti-yellow-magsafe-case-oneplus' },
    { label: 'Google Pixel', href: '/products/anti-yellow-magsafe-clear-case-google-pixel' },
    { label: 'Nothing', href: '/products/anti-yellow-magsafe-clear-case-nothing' },
    { label: 'Vivo', href: '/products/anti-yellow-magsafe-clear-case-vivo' },
    { label: 'iQOO', href: '/products/anti-yellow-magsafe-clear-case-iqoo' },
    { label: 'Oppo', href: '/products/anti-yellow-magsafe-clear-case-oppo-x-series' },
    { label: 'Realme', href: '/products/anti-yellow-magsafe-clear-case-realme' },
    { label: 'Redmi', href: '/products/anti-yellow-magsafe-clear-case-redmi' },
    { label: 'Xiaomi', href: '/products/anti-yellow-magsafe-clear-case-xiaomi' },
    { label: 'Motorola', href: '/products/anti-yellow-magsafe-clear-case-motorola' },
  ];

  return (
    <footer
      style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        paddingTop: '64px',
        paddingBottom: '48px',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Logo Column */}
          <div>
            <Link href="/" style={{ display: 'inline-block', marginBottom: '20px' }}>
              <img
                src="https://www.rezoni.com/cdn/shop/files/final_Horizontal_logo_copy-01_200x.png?v=1647520936"
                alt="Rezoni"
                style={{ width: '100px', height: 'auto' }}
              />
            </Link>
            <p
              style={{
                fontSize: '12px',
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '240px',
                marginTop: '12px',
              }}
            >
              A case for every mood. Premium and ultra-protective tech accessories for your smartphone. #Rezoni
            </p>
          </div>

          {/* Information Column */}
          <div>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#ffffff',
                marginBottom: '18px',
              }}
            >
              Information
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {infoLinks.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '10px' }}>
                  <Link
                    href={item.href}
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.7)',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Column */}
          <div>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#ffffff',
                marginBottom: '18px',
              }}
            >
              Shop
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {shopLinks.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '10px' }}>
                  <Link
                    href={item.href}
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.7)',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us Column (matching boxed social media icons in 08_footer_full.png) */}
          <div>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#ffffff',
                marginBottom: '18px',
              }}
            >
              Follow us
            </p>
            <div style={{ display: 'flex' }}>
              <a
                href="https://www.facebook.com/shoprezoni"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                style={{
                  width: '46px',
                  height: '46px',
                  border: '1px solid #262626',
                  borderRight: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1c1c1c')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>

              <a
                href="https://www.instagram.com/shoprezoni/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                style={{
                  width: '46px',
                  height: '46px',
                  border: '1px solid #262626',
                  borderRight: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1c1c1c')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              <a
                href="https://pin.it/4PaBVuS"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Pinterest"
                style={{
                  width: '46px',
                  height: '46px',
                  border: '1px solid #262626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1c1c1c')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Support email line matching live site footer lines 80-84 */}
        <div
          style={{
            textAlign: 'center',
            lineHeight: 1.8,
            paddingTop: '24px',
            borderTop: '1px solid #1a1a1a',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          <p style={{ margin: '0 0 4px' }}>Reach out to our customer support team:</p>
          <p style={{ margin: 0 }}>
            <strong>Email:</strong>{' '}
            <a
              href="mailto:hello@rezoni.com"
              style={{ color: '#ff6700', textDecoration: 'underline' }}
            >
              hello@rezoni.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
