'use client';

import React from 'react';

const perks = [
  {
    id: 'perk-1',
    title: 'Free shipping',
    description: 'Free nationwide shipping.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 21L21 17.1429V6.85714M12 21L3 17.1429V6.85714M12 21V10.7143M21 6.85714L12 3L3 6.85714M21 6.85714L12 10.7143M3 6.85714L12 10.7143" />
      </svg>
    ),
  },
  {
    id: 'perk-2',
    title: 'Customer service',
    description: 'We are available from monday to saturday to answer your questions.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    id: 'perk-3',
    title: 'Secure payment',
    description: 'Your payment information is processed securely.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    id: 'perk-4',
    title: 'Contact us',
    description: 'Need to contact us ? Just send us an e-mail at hello@rezoni.com',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

export default function TextWithIcons() {
  return (
    <section style={{ padding: '40px 0', borderTop: '1px solid #eeeeee', backgroundColor: '#ffffff' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px 20px',
            textAlign: 'center',
          }}
        >
          {perks.map((perk) => (
            <div key={perk.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  color: '#282828',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {perk.icon}
              </div>
              <h4
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '6px',
                  color: '#111',
                }}
              >
                {perk.title}
              </h4>
              <p
                style={{
                  fontSize: '12px',
                  color: '#707070',
                  lineHeight: '1.5',
                  maxWidth: '260px',
                }}
              >
                {perk.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
