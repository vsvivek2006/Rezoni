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

  // Accordion state: Activity History open by default, others collapsed for clean curated view
  const [expandedSections, setExpandedSections] = useState<{
    activity: boolean;
    items: boolean;
    address: boolean;
  }>({
    activity: true,
    items: false,
    address: false,
  });

  const toggleSection = (section: 'activity' | 'items' | 'address') => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const fetchTracking = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setError('Please enter your Order ID, Phone Number, or Tracking Number.');
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
        setError(data.message || 'No tracking information found for this query.');
        setOrder(null);
      }
    } catch {
      setError('Unable to fetch live tracking status. Please check your connection.');
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
      {/* 1:1 Rezoni Shipway Search Card */}
      <div
        style={{
          maxWidth: '520px',
          margin: '2rem auto 2.5rem',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '2.5rem 2rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          textAlign: 'center',
          color: '#000000',
          border: '1px solid #f0f0f0',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: '#111111',
            margin: '0 0 10px',
            letterSpacing: '-0.02em',
          }}
        >
          Track Your Order
        </h1>
        <p style={{ fontSize: '13px', color: '#666666', margin: '0 0 22px' }}>
          Real-time tracking directly synced from our logistics database.
        </p>

        <form onSubmit={handleSearch}>
          <label
            htmlFor="order_tracking_data"
            style={{
              display: 'block',
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: 700,
              color: '#222222',
              marginBottom: '8px',
            }}
          >
            Order ID / Phone / Tracking Number
          </label>

          <input
            type="text"
            id="order_tracking_data"
            name="order_tracking"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. RZ-206177 or 9876543210"
            style={{
              width: '100%',
              height: '44px',
              padding: '10px 14px',
              borderRadius: '6px',
              border: error ? '1.5px solid #ef4444' : '1px solid #d5d5d5',
              backgroundColor: '#fbfbfb',
              color: '#000000',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: '14px',
            }}
          />

          <button
            type="submit"
            id="scan_order"
            disabled={loading}
            style={{
              display: 'block',
              width: '100%',
              height: '46px',
              textAlign: 'center',
              fontWeight: 800,
              fontSize: '13px',
              borderRadius: '6px',
              color: '#ffffff',
              backgroundImage: 'linear-gradient(to right, #ff6700 0%, #ff9932 50%, #ff6700 100%)',
              border: 0,
              cursor: loading ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 4px 14px rgba(255, 103, 0, 0.3)',
              transition: 'opacity 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Fetching from DB...' : 'Track Order'}
          </button>

          {error && (
            <span style={{ display: 'block', fontSize: '13px', color: '#dc2626', marginTop: '12px', fontWeight: 500 }}>
              {error}
            </span>
          )}
        </form>
      </div>

      {/* Tracking Results Card */}
      {order && (
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '28px',
            boxShadow: '0 10px 35px rgba(0,0,0,0.06)',
            border: '1px solid #e8e8e8',
          }}
        >
          {/* Order Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '14px',
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: '20px',
              marginBottom: '24px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  Order #{order.id}
                </span>
                <span
                  style={{
                    backgroundColor: '#e6f4ea',
                    color: '#137333',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                  }}
                >
                  Live DB Synced
                </span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#111111', lineHeight: 1.3 }}>
                {order.statusLabel}
              </div>
              <div style={{ fontSize: '13px', color: '#555555', marginTop: '4px' }}>
                Carrier: <strong style={{ color: '#222' }}>{order.carrier}</strong> • Tracking ID: <strong style={{ color: '#ff6700' }}>{order.trackingNumber}</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Estimated Delivery</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#16a34a', marginTop: '3px' }}>
                {order.estimatedDelivery}
              </div>
              <div style={{ fontSize: '11px', color: '#888888', marginTop: '2px' }}>
                Placed: {order.date}
              </div>
            </div>
          </div>

          {/* 5-Step Visual Status Progression Bar */}
          <div style={{ padding: '6px 0 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '14px' }}>
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
                        : order.status === 'dispatched'
                        ? '25%'
                        : '8%',
                    transition: 'width 0.4s ease',
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
                      fontWeight: 800,
                      boxShadow: stage.active ? '0 2px 8px rgba(22, 163, 74, 0.4)' : 'none',
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
          </div>

          {/* Curated Collapsible Details Accordions ("curted taki tap kar ke under ki dets de sake") */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            
            {/* 1. Accordion: Activity History & Hub Scans */}
            <div
              style={{
                border: '1px solid #ebebeb',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
              }}
            >
              <button
                type="button"
                onClick={() => toggleSection('activity')}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  backgroundColor: '#fbfbfb',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px' }}>🚚</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Activity History & Hub Scans
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>
                    {expandedSections.activity ? 'Hide details' : 'Tap to expand'}
                  </span>
                  <span
                    style={{
                      display: 'inline-block',
                      transition: 'transform 0.2s',
                      transform: expandedSections.activity ? 'rotate(180deg)' : 'rotate(0deg)',
                      fontSize: '11px',
                      color: '#444',
                    }}
                  >
                    ▼
                  </span>
                </div>
              </button>

              {expandedSections.activity && (
                <div style={{ padding: '16px 18px', borderTop: '1px solid #f0f0f0', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {order.timeline && order.timeline.length > 0 ? (
                      order.timeline.map((item, tIdx) => (
                        <div
                          key={tIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            fontSize: '13px',
                          }}
                        >
                          <span
                            style={{
                              color: item.completed ? '#16a34a' : '#cccccc',
                              fontSize: '14px',
                              lineHeight: 1,
                              marginTop: '2px',
                            }}
                          >
                            {item.completed ? '●' : '○'}
                          </span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: item.current ? 700 : 500, color: item.completed ? '#111111' : '#777777' }}>
                              {item.title} {item.location ? `— ${item.location}` : ''}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666666', marginTop: '2px' }}>
                              {item.description}
                            </div>
                            <div style={{ fontSize: '11px', color: '#999999', marginTop: '3px' }}>
                              {item.date} {item.time ? `• ${item.time}` : ''}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: '12px', color: '#777' }}>Order received and registered in warehouse.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Accordion: Shipment Items & Free Gifts */}
            <div
              style={{
                border: '1px solid #ebebeb',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
              }}
            >
              <button
                type="button"
                onClick={() => toggleSection('items')}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  backgroundColor: '#fbfbfb',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px' }}>📦</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Shipment Items & Free Gifts ({order.items?.length || 0})
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>
                    {expandedSections.items ? 'Hide items' : 'Tap to expand'}
                  </span>
                  <span
                    style={{
                      display: 'inline-block',
                      transition: 'transform 0.2s',
                      transform: expandedSections.items ? 'rotate(180deg)' : 'rotate(0deg)',
                      fontSize: '11px',
                      color: '#444',
                    }}
                  >
                    ▼
                  </span>
                </div>
              </button>

              {expandedSections.items && (
                <div style={{ padding: '16px 18px', borderTop: '1px solid #f0f0f0', backgroundColor: '#ffffff' }}>
                  {order.items && order.items.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {order.items.map((prod, pIdx) => (
                        <div
                          key={pIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            paddingBottom: pIdx !== order.items.length - 1 ? '12px' : 0,
                            borderBottom: pIdx !== order.items.length - 1 ? '1px solid #f5f5f5' : 'none',
                          }}
                        >
                          <div
                            style={{
                              width: '52px',
                              height: '58px',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              backgroundColor: '#f9f9f9',
                              border: '1px solid #eee',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={prod.image}
                              alt={prod.title}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111111', lineHeight: 1.3 }}>
                              {prod.title}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666666', marginTop: '2px' }}>
                              {prod.model || prod.variant ? `${prod.model || ''} • ` : ''}Qty: {prod.quantity}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            {Number(prod.price) === 0 ? (
                              <span style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a' }}>
                                FREE GIFT
                              </span>
                            ) : (
                              <span style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>
                                Rs. {Number(prod.price).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}

                      <div
                        style={{
                          marginTop: '8px',
                          paddingTop: '12px',
                          borderTop: '1px solid #eee',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#444' }}>Total Order Value</span>
                        <span style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>
                          Rs. {Number(order.total || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '12px', color: '#777' }}>No items listed for this order.</div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Accordion: Delivery Address & Contact */}
            <div
              style={{
                border: '1px solid #ebebeb',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
              }}
            >
              <button
                type="button"
                onClick={() => toggleSection('address')}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  backgroundColor: '#fbfbfb',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px' }}>📍</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Delivery Address & Customer
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>
                    {expandedSections.address ? 'Hide address' : 'Tap to expand'}
                  </span>
                  <span
                    style={{
                      display: 'inline-block',
                      transition: 'transform 0.2s',
                      transform: expandedSections.address ? 'rotate(180deg)' : 'rotate(0deg)',
                      fontSize: '11px',
                      color: '#444',
                    }}
                  >
                    ▼
                  </span>
                </div>
              </button>

              {expandedSections.address && (
                <div style={{ padding: '16px 18px', borderTop: '1px solid #f0f0f0', backgroundColor: '#ffffff', fontSize: '13px', color: '#444' }}>
                  <div style={{ fontWeight: 700, color: '#111', marginBottom: '4px' }}>
                    {order.customerName || 'Valued Customer'}
                  </div>
                  <div style={{ lineHeight: 1.5, color: '#555' }}>
                    {order.shippingAddress?.address}
                  </div>
                  <div style={{ color: '#555' }}>
                    {[order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.pincode]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                  {order.customerPhone && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#777' }}>
                      Contact: <strong>{order.customerPhone.replace(/(\d{2})(\d{4})(\d{4})/, '$1-XXXX-$3')}</strong>
                    </div>
                  )}
                </div>
              )}
            </div>

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
