'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import TrackOrderPage from '@/app/track-order/page';

interface StaticPageClientProps {
  slug: string;
}

export default function StaticPageClient({ slug }: StaticPageClientProps) {
  if (slug === 'track-order') {
    return <TrackOrderPage />;
  }

  const [contactSubmitted, setContactSubmitted] = useState(false);

  const getPageTitle = (s: string) => {
    switch (s) {
      case 'our-story':
        return 'Our Story';
      case 'contact':
        return 'Contact Us';
      case 'shipping-policy':
        return 'Shipping Policy';
      case 'returns-refunds-exchanges':
        return 'Returns, Refunds & Exchanges';
      case 'cancellation-policy':
        return 'Cancellation Policy';
      case 'terms-and-conditions':
        return 'Terms & Conditions';
      case 'privacy-policy':
        return 'Privacy Policy';
      case 'track-order':
        return 'Track Your Order';
      default:
        return s.replace(/-/g, ' ').toUpperCase();
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '75vh', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '12px', color: '#888', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#555' }}>
            Home
          </Link>{' '}
          / <span style={{ color: '#000', fontWeight: 600 }}>{getPageTitle(slug)}</span>
        </div>

        <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '24px' }}>
          {getPageTitle(slug)}
        </h1>

        <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#444' }}>
          {slug === 'our-story' && (
            <div>
              <p style={{ marginBottom: '16px' }}>
                Welcome to <strong>Rezoni</strong>. We are a lifestyle tech-accessories brand dedicated to elevating the everyday experience of your smartphone.
              </p>
              <p style={{ marginBottom: '16px' }}>
                Tired of cheap transparent cases that yellow within two weeks, our founders embarked on a mission to engineer phone cases that balance uncompromising drop protection with runway-worthy aesthetics.
              </p>
              <p style={{ marginBottom: '16px' }}>
                Every Rezoni case is rigorously tested for shock resistance, crystal clarity retention, and seamless MagSafe integration. Today, we protect smartphones for over 1,000,000+ satisfied customers nationwide.
              </p>
            </div>
          )}

          {slug === 'contact' && (
            <div>
              {contactSubmitted ? (
                <div style={{ padding: '20px', backgroundColor: '#eaf8ed', color: '#1b4332', borderRadius: '4px', fontWeight: 600, textAlign: 'center', marginBottom: '24px' }}>
                  ✓ Message received! Our support team will get back to you within 24 business hours.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}
                >
                  <input
                    type="text"
                    required
                    placeholder="Name"
                    style={{
                      width: '100%',
                      height: '48px',
                      padding: '0 14px',
                      border: '1px solid #d5d5d5',
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                      fontSize: '16px',
                      color: '#222',
                      outline: 'none',
                    }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="E-mail"
                    style={{
                      width: '100%',
                      height: '48px',
                      padding: '0 14px',
                      border: '1px solid #d5d5d5',
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                      fontSize: '16px',
                      color: '#222',
                      outline: 'none',
                    }}
                  />
                  <textarea
                    rows={5}
                    required
                    placeholder="Message"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #d5d5d5',
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                      fontSize: '16px',
                      color: '#222',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      height: '48px',
                      backgroundColor: '#ff6700',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: 800,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e65c00')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ff6700')}
                  >
                    SUBMIT
                  </button>
                </form>
              )}

              {/* Exact Card matching live_07_contact.png */}
              <div
                style={{
                  border: '1px solid #e8e8e8',
                  borderRadius: '6px',
                  padding: '24px 20px',
                  backgroundColor: '#ffffff',
                  fontSize: '13px',
                  lineHeight: '1.7',
                  color: '#555555',
                }}
              >
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: 800,
                    color: '#222222',
                    marginBottom: '14px',
                  }}
                >
                  Need Help? We’re just an email away
                </h3>
                <p style={{ marginBottom: '14px' }}>
                  For any queries related to our products or services, please reach out to us at{' '}
                  <a href="mailto:hello@rezoni.com" style={{ color: '#ff6700', textDecoration: 'underline' }}>
                    hello@rezoni.com
                  </a>
                  . Our customer support team is available Monday to Saturday, from 11:00 AM to 7:00 PM.
                </p>
                <p style={{ margin: 0 }}>
                  Registered Office Address: A-18, Lajpat Nagar III, South Delhi, New Delhi – 110024
                </p>
              </div>
            </div>
          )}

          {slug === 'shipping-policy' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '20px 0 8px' }}>Nationwide Shipping</h3>
              <p>We provide Free Express Shipping on all prepaid orders across India.</p>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '20px 0 8px' }}>Delivery Timelines</h3>
              <p>• Metro Cities: 2 to 4 business days</p>
              <p>• Rest of India: 4 to 6 business days</p>
            </div>
          )}

          {slug === 'returns-refunds-exchanges' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '20px 0 8px' }}>7-Day Easy Exchange Policy</h3>
              <p>If you received an incorrect phone model case or defective unit, we provide a 100% free exchange or refund within 7 days of delivery.</p>
            </div>
          )}

          {slug === 'cancellation-policy' && (
            <div>
              <p>Orders can be cancelled before dispatch directly by emailing hello@rezoni.com or messaging our support line.</p>
            </div>
          )}

          {slug === 'terms-and-conditions' && (
            <div>
              <p>By accessing and shopping with Rezoni, you agree to comply with our terms of service, fair use policy, and warranty conditions.</p>
            </div>
          )}

          {slug === 'privacy-policy' && (
            <div>
              <p>We value your privacy. Personal data collected during checkout is securely encrypted and used strictly for shipping fulfillment and customer support.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
