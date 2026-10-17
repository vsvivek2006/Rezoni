'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { OrderRecord } from '@/lib/orderStore';
import CheckoutTrustBadges from '@/components/CheckoutTrustBadges';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6700', '#059669', '#2563eb', '#f59e0b', '#ec4899'],
      });
    } catch {
      // ignore
    }

    if (!orderId) {
      setLoading(false);
      return;
    }

    // Fetch order details from API
    fetch(`/api/orders/${encodeURIComponent(orderId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError(data.message || 'Order could not be found.');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch order details:', err);
        setError('Network error loading order confirmation.');
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div
      style={{
        minHeight: '85vh',
        backgroundColor: '#f9fafb',
        padding: '30px 16px 80px',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        {/* Brand Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <Link
            href="/"
            style={{
              fontSize: '20px',
              fontWeight: 900,
              letterSpacing: '2px',
              color: '#000000',
              textDecoration: 'none',
            }}
          >
            REZONI
          </Link>
          <Link
            href="/collections/all"
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#ff6700',
              textDecoration: 'none',
            }}
          >
            &larr; Continue Shopping
          </Link>
        </div>

        {/* Confirmation Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              padding: '36px 24px',
              textAlign: 'center',
              backgroundColor: '#f0fdf4',
              borderBottom: '1px solid #bbf7d0',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#059669',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '16px',
                boxShadow: '0 8px 16px rgba(5, 150, 105, 0.25)',
              }}
            >
              ✓
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 8px', color: '#064e3b' }}>
              Payment Successful & Order Confirmed!
            </h1>
            <p style={{ fontSize: '13px', color: '#047857', margin: 0, lineHeight: 1.5 }}>
              Thank you for choosing REZONI! A confirmation email and tracking link have been dispatched.
            </p>
          </div>

          {/* Details Section */}
          <div style={{ padding: '24px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>Loading order receipt...</div>
              </div>
            ) : order ? (
              <>
                {/* Reference Numbers Banner */}
                <div
                  style={{
                    backgroundColor: '#fafafa',
                    border: '1px solid #ebebeb',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '24px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6b7280', fontWeight: 700, letterSpacing: '0.5px' }}>
                      Order Number
                    </span>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#111827', marginTop: '2px' }}>
                      {order.orderId}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6b7280', fontWeight: 700, letterSpacing: '0.5px' }}>
                      Payment Reference ID
                    </span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#059669', marginTop: '4px', wordBreak: 'break-all' }}>
                      {order.razorpayPaymentId || 'Verified'}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6b7280', fontWeight: 700, letterSpacing: '0.5px' }}>
                      Estimated Delivery
                    </span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginTop: '4px' }}>
                      2 - 4 Business Days (Express)
                    </div>
                  </div>
                </div>

                {/* Items Purchased */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#374151', marginBottom: '12px', borderBottom: '1px solid #f3f4f6', paddingBottom: '6px' }}>
                    Items Ordered ({order.items.reduce((s, i) => s + i.quantity, 0)})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          paddingBottom: '10px',
                          borderBottom: idx === order.items.length - 1 ? 'none' : '1px solid #f3f4f6',
                        }}
                      >
                        <div
                          style={{
                            width: '48px',
                            height: '56px',
                            borderRadius: '4px',
                            backgroundColor: '#f3f4f6',
                            overflow: 'hidden',
                            flexShrink: 0,
                            border: '1px solid #e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {item.image ? (
                            <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          ) : (
                            <span style={{ fontSize: '18px' }}>📱</span>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                            Qty: <strong>{item.quantity}</strong> {item.device ? `• Model: ${item.device}` : ''}
                          </div>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Information */}
                <div style={{ marginBottom: '24px', backgroundColor: '#fcfcfc', border: '1px solid #f0f0f0', borderRadius: '8px', padding: '16px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#374151', margin: '0 0 10px' }}>
                    Shipping Address
                  </h3>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>
                    {order.customer.fullName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>
                    {order.customer.addressLine1}
                    {order.customer.addressLine2 ? `, ${order.customer.addressLine2}` : ''}
                    <br />
                    {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span>📞 +91 {order.customer.phone}</span>
                    <span>✉️ {order.customer.email}</span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
                    <span>Subtotal</span>
                    <span>Rs. {order.items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                    <span>Express Shipping</span>
                    {order.amount > order.items.reduce((s, i) => s + i.price * i.quantity, 0) ? (
                      <span style={{ fontWeight: 700, color: '#111827' }}>
                        Rs. {(order.amount - order.items.reduce((s, i) => s + i.price * i.quantity, 0)).toFixed(2)}
                      </span>
                    ) : (
                      <span style={{ color: '#059669', fontWeight: 700 }}>FREE (Orders ₹999+)</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 900, color: '#111827', borderTop: '1px dashed #e5e7eb', paddingTop: '8px' }}>
                    <span>Total Paid</span>
                    <span style={{ color: '#ff6700' }}>Rs. {order.amount.toFixed(2)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#4b5563' }}>
                <p style={{ fontSize: '14px', marginBottom: '12px' }}>
                  {error || 'Thank you! Your payment has been received.'}
                </p>
                {orderId && (
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>
                    Order ID: <strong>{orderId}</strong>
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px' }}>
              <Link
                href="/track-order"
                style={{
                  height: '48px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '1px',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                }}
              >
                Track Your Order &rarr;
              </Link>
              <Link
                href="/collections/all"
                style={{
                  height: '48px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  color: '#111827',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '12px',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                }}
              >
                Continue Shopping
              </Link>
            </div>

            {/* 3 Core Trust Badges */}
            <CheckoutTrustBadges />
          </div>
        </div>

        {/* Support Note */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px', color: '#9ca3af', lineHeight: 1.6 }}>
          Need assistance with your order? Reach our customer concierge team at{' '}
          <strong style={{ color: '#4b5563' }}>hello@rezoni.com</strong>.
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif' }}>
          <div>Loading confirmation...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
