import React from 'react';

export default function CheckoutTrustBadges({ compact = false }: { compact?: boolean }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: compact ? '8px' : '12px',
        padding: compact ? '12px 0 4px' : '16px 0',
        borderTop: '1px solid #eeeeee',
        marginTop: '16px',
        textAlign: 'center',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      <div>
        <img
          src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/truck.png?v=1711003297"
          alt="Express Delivery"
          style={{
            width: compact ? '24px' : '28px',
            height: compact ? '24px' : '28px',
            margin: '0 auto 4px',
            display: 'block',
          }}
        />
        <div style={{ fontSize: compact ? '10px' : '11px', fontWeight: 700, color: '#111' }}>
          Express Delivery
        </div>
        <div style={{ fontSize: '9px', color: '#777', marginTop: '2px' }}>
          Estimated 2-4 Days
        </div>
      </div>

      <div>
        <img
          src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/exchange.png?v=1711003297"
          alt="7 Day Risk Free"
          style={{
            width: compact ? '24px' : '28px',
            height: compact ? '24px' : '28px',
            margin: '0 auto 4px',
            display: 'block',
          }}
        />
        <div style={{ fontSize: compact ? '10px' : '11px', fontWeight: 700, color: '#111' }}>
          7 Day Risk Free
        </div>
        <div style={{ fontSize: '9px', color: '#777', marginTop: '2px' }}>
          Returns and Exchanges
        </div>
      </div>

      <div>
        <img
          src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/SECURE.png?v=1711010153"
          alt="Secure Payments"
          style={{
            width: compact ? '24px' : '28px',
            height: compact ? '24px' : '28px',
            margin: '0 auto 4px',
            display: 'block',
          }}
        />
        <div style={{ fontSize: compact ? '10px' : '11px', fontWeight: 700, color: '#111' }}>
          Secure Payments
        </div>
        <div style={{ fontSize: '9px', color: '#777', marginTop: '2px' }}>
          SSL Secured
        </div>
      </div>
    </div>
  );
}
