'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface StaticPageClientProps {
  slug: string;
}

export default function StaticPageClient({ slug }: StaticPageClientProps) {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [trackNumber, setTrackNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<string | null>(null);

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

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackNumber.trim()) {
      setTrackingResult(`Status for #${trackNumber}: In Transit with Bluedart Express. Estimated delivery in 2 business days.`);
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
              <p style={{ marginBottom: '24px' }}>
                Have a question regarding your order, phone model compatibility, or bulk gifting? We are here to help!
              </p>
              {contactSubmitted ? (
                <div style={{ padding: '20px', backgroundColor: '#eaf8ed', color: '#1b4332', borderRadius: '4px', fontWeight: 600 }}>
                  ✓ Message received! Our support team will get back to you within 24 business hours.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Your Name:</label>
                    <input type="text" required style={{ width: '100%', height: '44px', padding: '0 12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'inherit' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Email Address:</label>
                    <input type="email" required style={{ width: '100%', height: '44px', padding: '0 12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'inherit' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Order Number (optional):</label>
                    <input type="text" style={{ width: '100%', height: '44px', padding: '0 12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'inherit' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Your Message:</label>
                    <textarea rows={4} required style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'inherit' }} />
                  </div>
                  <button type="submit" className="btn-rezoni" style={{ width: '200px' }}>
                    Send Message
                  </button>
                </form>
              )}
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #eee' }}>
                <p><strong>Customer Care:</strong> hello@rezoni.com</p>
                <p><strong>Operating Hours:</strong> Monday – Saturday | 10:00 AM – 7:00 PM IST</p>
              </div>
            </div>
          )}

          {slug === 'track-order' && (
            <div>
              <p style={{ marginBottom: '20px' }}>Enter your order ID or tracking AWB number to check real-time courier status.</p>
              <form onSubmit={handleTrack} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                <input
                  type="text"
                  placeholder="e.g. RZ-94821 or AWB number"
                  value={trackNumber}
                  onChange={(e) => setTrackNumber(e.target.value)}
                  required
                  style={{ flex: 1, height: '48px', padding: '0 14px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'inherit' }}
                />
                <button type="submit" className="btn-rezoni" style={{ padding: '0 24px' }}>
                  Track
                </button>
              </form>
              {trackingResult && (
                <div style={{ padding: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', color: '#166534', fontWeight: 600 }}>
                  {trackingResult}
                </div>
              )}
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
