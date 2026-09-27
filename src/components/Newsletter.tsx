'use client';

import React, { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <section style={{ padding: '60px 0', backgroundColor: '#fcfcfc', borderTop: '1px solid #f0f0f0' }}>
      <div className="container" style={{ maxWidth: '650px', textAlign: 'center' }}>
        <h3 className="section-title" style={{ fontSize: '26px', marginBottom: '8px' }}>
          Subscribe to our newsletter
        </h3>
        <p style={{ fontSize: '13px', color: '#707070', marginBottom: '28px' }}>
          Get updates on new phone cases, exclusive drops, and secret offers.
        </p>

        {subscribed ? (
          <div
            style={{
              padding: '16px',
              backgroundColor: '#eaf8ed',
              color: '#1b4332',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            ✓ Thank you for subscribing! Check your email for special welcome perks.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: '1 1 260px',
                height: '48px',
                padding: '0 16px',
                borderRadius: '4px',
                border: '1px solid #dcdcdc',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              className="btn-rezoni"
              style={{ height: '48px', padding: '0 28px' }}
            >
              SUBSCRIBE
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
