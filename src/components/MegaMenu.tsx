'use client';

import React from 'react';
import Link from 'next/link';
import { desktopDeviceColumns } from '@/data/deviceMenuData';

export type MegaMenuType = 'category' | 'device' | 'collections';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  type: MegaMenuType;
}

// Category Items 1:1 with Rezoni live store
const categoryProtection = [
  { name: 'iPhone Cases', link: '/collections/iphone-cases' },
  { name: 'Samsung Cases', link: '/products/anti-yellow-magsafe-clear-case-samsung' },
  { name: 'OnePlus Cases', link: '/products/anti-yellow-magsafe-case-oneplus' },
  { name: 'Google Pixel Cases', link: '/products/anti-yellow-magsafe-clear-case-google-pixel' },
  { name: 'Nothing Cases', link: '/products/anti-yellow-magsafe-clear-case-nothing' },
  { name: 'Vivo Cases', link: '/products/anti-yellow-magsafe-clear-case-vivo' },
  { name: 'iQOO Cases', link: '/products/anti-yellow-magsafe-clear-case-iqoo' },
  { name: 'Oppo Cases', link: '/products/anti-yellow-magsafe-clear-case-oppo-x-series' },
  { name: 'Realme Cases', link: '/products/anti-yellow-magsafe-clear-case-realme' },
  { name: 'Redmi Cases', link: '/products/anti-yellow-magsafe-clear-case-redmi' },
  { name: 'Xiaomi Cases', link: '/products/anti-yellow-magsafe-clear-case-xiaomi' },
  { name: 'Motorola Cases', link: '/products/anti-yellow-magsafe-clear-case-motorola' },
  { name: 'AirPods Cases', link: '/collections/airpods-gen-1-2' },
];

const categoryAccessories = [
  { name: 'Phone Grips', link: '/collections/phone-grips' },
];

const categoryPromos = [
  {
    title: 'iPhone Cases',
    link: '/collections/iphone-cases',
    img: 'https://www.rezoni.com/cdn/shop/files/menu_phone_case_720x.jpg?v=1656144671',
  },
  {
    title: 'AirPods Cases',
    link: '/collections/airpods-gen-1-2',
    img: 'https://www.rezoni.com/cdn/shop/files/Menu_airpod_720x.jpg?v=1656144670',
  },
  {
    title: 'Phone Grips',
    link: '/collections/phone-grips',
    img: 'https://www.rezoni.com/cdn/shop/files/menu_phone_grip_720x.jpg?v=1656144670',
  },
];

// Collections 3-Column List 1:1 with Rezoni live store (desktop-menu-4)
const collectionsCol1 = [
  { name: 'Anti-Yellow Case', link: '/products/anti-yellow-magsafe-clear-case' },
  { name: 'Reverb 2.0 Clear Case', link: '/products/reverb-2-0-impact-magsafe-clear-case' },
  { name: 'Reverb Clear Case', link: '/products/clearvue' },
  { name: 'Custom Photo Case', link: '/collections/custom-photo-case' },
  { name: 'Mixtape', link: '/collections/mixtape' },
  { name: 'Wild Cats', link: '/collections/wild-cats' },
  { name: 'Y2K', link: '/collections/y2k' },
  { name: 'Prints Seen On Social', link: '/collections/prints-seen-on-social' },
  { name: 'Personalized', link: '/collections/personalised' },
  { name: 'Tie Dye', link: '/collections/tie-dye' },
  { name: 'Matching Sets', link: '/collections/matching-sets' },
];

const collectionsCol2 = [
  { name: 'New Arrivals', link: '/collections/new-arrivals', isNew: true },
  { name: 'Polaroid Photo Case', link: '/collections/polaroid-photo-case' },
  { name: 'Hearts', link: '/collections/heart' },
  { name: 'Floral', link: '/collections/floral' },
  { name: 'Stickers', link: '/collections/stickers' },
  { name: 'Butterfly', link: '/collections/butterfly' },
  { name: 'Unisex', link: '/collections/unisex' },
];

const collectionsCol3 = [
  { name: 'Football', link: '/collections/football' },
  { name: 'Zodiac', link: '/collections/zodiac' },
  { name: 'Featured Prints', link: '/collections/featured-prints' },
];

export default function MegaMenu({ isOpen, onClose, type }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      onMouseLeave={onClose}
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        width: '100%',
        backgroundColor: '#ffffff',
        color: '#111111',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
        borderTop: '1px solid #1a1a1a',
        zIndex: 50,
        padding: type === 'device' ? '28px 0 36px' : '44px 0 48px',
        animation: 'fadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="container">
        {/* ================= TYPE: CATEGORY ================= */}
        {type === 'category' && (
          <div style={{ display: 'grid', gridTemplateColumns: '240px 180px 1fr', gap: '48px', alignItems: 'start' }}>
            {/* Column 1: Cases & Protection */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  color: '#111111',
                  marginBottom: '16px',
                }}
              >
                Cases &amp; Protection
              </span>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0 }}>
                {categoryProtection.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.link}
                      onClick={onClose}
                      className="link--faded"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Accessories */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  color: '#111111',
                  marginBottom: '16px',
                }}
              >
                Accessories
              </span>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0 }}>
                {categoryAccessories.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.link}
                      onClick={onClose}
                      className="link--faded"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: 3 Promotional Image Cards matching Rezoni */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '640px', justifySelf: 'end' }}>
              {categoryPromos.map((p) => (
                <Link
                  key={p.title}
                  href={p.link}
                  onClick={onClose}
                  className="mega-menu-image-card"
                >
                  <div className="image-wrapper">
                    <img
                      src={p.img}
                      alt={p.title}
                      loading="lazy"
                    />
                  </div>
                  <span className="card-title">
                    {p.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ================= TYPE: DEVICE (1:1 with Rezoni live store desktop-menu-2) ================= */}
        {type === 'device' && (
          <div
            style={{
              maxHeight: 'calc(100vh - 140px)',
              overflowY: 'auto',
              paddingRight: '12px',
            }}
            className="custom-scroll"
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '32px 48px',
                justifyContent: 'flex-start',
              }}
            >
              {desktopDeviceColumns.map((col) => (
                <div
                  key={col.id}
                  style={{
                    minWidth: '170px',
                    maxWidth: '220px',
                    flex: '1 0 170px',
                  }}
                >
                  {col.titleHref ? (
                    <Link
                      href={col.titleHref}
                      onClick={onClose}
                      style={{
                        display: 'block',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: '#111111',
                        marginBottom: '14px',
                        textDecoration: 'none',
                      }}
                    >
                      {col.title}
                    </Link>
                  ) : (
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: '#111111',
                        marginBottom: '14px',
                      }}
                    >
                      {col.title}
                    </span>
                  )}
                  <ul
                    style={{
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '7px',
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {col.items.map((item, itIdx) => {
                      const itemUrl = item.href.includes('model=')
                        ? item.href
                        : `${item.href}${item.href.includes('?') ? '&' : '?'}model=${encodeURIComponent(item.name)}`;
                      return (
                        <li key={`${item.name}-${itIdx}`}>
                          <Link
                            href={itemUrl}
                            onClick={onClose}
                            className={`link--faded ${item.isOrange ? 'link-orange' : ''}`}
                            style={{
                              fontSize: '13px',
                              lineHeight: 1.5,
                            }}
                          >
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TYPE: COLLECTIONS (Exact 3-Column List matching Rezoni desktop-menu-4) ================= */}
        {type === 'collections' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px', maxWidth: '850px', margin: '0 auto', alignItems: 'start' }}>
            {/* Column 1 */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  color: '#111111',
                  marginBottom: '16px',
                }}
              >
                Collection
              </span>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0 }}>
                {collectionsCol1.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.link}
                      onClick={onClose}
                      className="link--faded"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  color: '#111111',
                  marginBottom: '16px',
                }}
              >
                Collection
              </span>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0 }}>
                {collectionsCol2.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.link}
                      onClick={onClose}
                      className={`link--faded ${item.isNew ? 'link-orange' : ''}`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  color: '#111111',
                  marginBottom: '16px',
                }}
              >
                Collection
              </span>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0 }}>
                {collectionsCol3.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.link}
                      onClick={onClose}
                      className="link--faded"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
