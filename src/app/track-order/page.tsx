'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Order } from '@/lib/db';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const urlId = searchParams.get('order_tracking') || searchParams.get('id') || '';

  const [query, setQuery] = useState(urlId || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchTracking = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setError('Please enter the required field(s)');
      return;
    }
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/orders?query=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      if (res.ok && data.success && data.order) {
        setOrder(data.order);
      } else {
        setError(data.message || 'No tracking information found for this ID.');
        setOrder(null);
      }
    } catch {
      setError('Unable to fetch tracking status. Please check your connection.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlId) {
      setQuery(urlId);
      fetchTracking(urlId);
    }
  }, [urlId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(query);
  };

  return (
    <div style={{ backgroundColor: '#fdfdfd', minHeight: '80vh', padding: '40px 20px 80px', fontFamily: 'Montserrat, sans-serif' }}>
      {/* 1:1 Rezoni Shipway Tracking Card */}
      <div
        style={{
          maxWidth: '480px',
          margin: '2rem auto 3rem',
          backgroundColor: '#ffffff',
          borderRadius: '6px',
          padding: '2.5rem 2rem',
          boxShadow: '0px 10px 25px -10px #000000',
          textAlign: 'center',
          color: '#000000',
        }}
      >
        <h3
          style={{
            fontSize: '26px',
            fontWeight: 800,
            color: '#000000',
            margin: '0 0 20px',
          }}
        >
          Track Your Order
        </h3>

        <form onSubmit={handleSearch}>
          <label
            htmlFor="order_tracking_data"
            style={{
              display: 'block',
              textAlign: 'left',
              fontSize: '14px',
              fontWeight: 700,
              color: '#000000',
              marginBottom: '8px',
            }}
          >
            Order ID / Tracking Number
          </label>

          <input
            type="text"
            id="order_tracking_data"
            name="order_tracking"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Order ID or Tracking Number"
            style={{
              width: '100%',
              height: '42px',
              padding: '8px 14px',
              borderRadius: '5px',
              border: error ? '1px solid red' : '1px solid #e0e0e0',
              backgroundColor: '#f8f8f8',
              color: '#000000',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: '16px',
            }}
          />

          <input
            type="submit"
            id="scan_order"
            value={loading ? 'Tracking...' : 'Track Order'}
            style={{
              display: 'block',
              width: '100%',
              height: '46px',
              textAlign: 'center',
              fontWeight: 800,
              fontSize: '14px',
              borderRadius: '6px',
              color: '#ffffff',
              backgroundImage: 'linear-gradient(to right, #ff6700 0%, #ff9932 50%, #ff6700 70%)',
              border: 0,
              cursor: loading ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          />

          {error && (
            <span style={{ display: 'block', fontSize: '13px', color: 'red', marginTop: '12px' }}>
              {error}
            </span>
          )}
        </form>
      </div>

      {/* Tracking Results */}
      {order && (
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '6px',
            padding: '28px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '1px solid #ebebeb',
          }}
        >
          {/* Order Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Order #{order.id}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#111111', marginTop: '2px' }}>
                Status: {order.statusLabel}
              </div>
              <div style={{ fontSize: '13px', color: '#666666', marginTop: '4px' }}>
                Carrier: {order.carrier} • Tracking: {order.trackingNumber}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#888888' }}>Estimated Delivery</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#111111', marginTop: '2px' }}>
                {order.estimatedDelivery}
              </div>
            </div>
          </div>

          {/* 5-Step Status Progression */}
          <div style={{ padding: '10px 0 30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '20px' }}>
              {/* Connecting line */}
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '20px',
                  right: '20px',
                  height: '3px',
                  backgroundColor: '#e5e7eb',
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    backgroundColor: '#16a34a',
                    width:
                      order.status === 'delivered'
                        ? '100%'
                        : order.status === 'out_for_delivery'
                        ? '75%'
                        : order.status === 'in_transit'
                        ? '50%'
                        : '25%',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              {[
                { label: 'Confirmed', active: true },
                { label: 'Dispatched', active: ['dispatched', 'in_transit', 'out_for_delivery', 'delivered'].includes(order.status) },
                { label: 'In Transit', active: ['in_transit', 'out_for_delivery', 'delivered'].includes(order.status) },
                { label: 'Out for Delivery', active: ['out_for_delivery', 'delivered'].includes(order.status) },
                { label: 'Delivered', active: order.status === 'delivered' },
              ].map((stage, idx) => (
                <div key={idx} style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: stage.active ? '#16a34a' : '#ffffff',
                      border: stage.active ? 'none' : '2px solid #d1d5db',
                      color: stage.active ? '#ffffff' : '#9ca3af',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {stage.active ? '✓' : idx + 1}
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: stage.active ? 700 : 500,
                      color: stage.active ? '#111111' : '#888888',
                      marginTop: '8px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {stage.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Hub scan timeline */}
            <div style={{ marginTop: '24px', borderTop: '1px solid #f0f0f0', paddingTop: '18px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Activity History
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {order.timeline.map((item, tIdx) => (
                  <div
                    key={tIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      fontSize: '13px',
                      color: item.completed ? '#111111' : '#888888',
                    }}
                  >
                    <span style={{ color: item.completed ? '#16a34a' : '#cccccc', fontWeight: 800 }}>
                      {item.completed ? '●' : '○'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: item.current ? 700 : 500 }}>
                        {item.title} {item.location ? `— ${item.location}` : ''}
                      </div>
                      <div style={{ fontSize: '11px', color: '#888888' }}>
                        {item.date} {item.time ? `• ${item.time}` : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            {order.items && order.items.length > 0 && (
              <div style={{ marginTop: '20px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Items in this shipment
                </div>
                {order.items.map((prod, pIdx) => (
                  <div key={pIdx} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '8px 0' }}>
                    <img
                      src={prod.image}
                      alt={prod.title}
                      style={{ width: '48px', height: '56px', objectFit: 'contain', backgroundColor: '#f9f9f9', borderRadius: '4px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#111111' }}>{prod.title}</div>
                      <div style={{ fontSize: '12px', color: '#666666' }}>Model: {prod.model} • Qty: {prod.quantity}</div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>
                      Rs. {prod.price}.00
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading tracking...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
