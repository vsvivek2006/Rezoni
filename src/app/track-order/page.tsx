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
  const [orderNotFound, setOrderNotFound] = useState(false);
  const [lastSearchedQuery, setLastSearchedQuery] = useState('');

  // Only Activity History & Hub Scans is a dropdown (collapsed by default)
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  const fetchTracking = async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 4) {
      setError('Please enter a valid Order ID (e.g. #RZ-206177) or 10-digit mobile number.');
      setOrder(null);
      setOrderNotFound(false);
      return;
    }
    setLoading(true);
    setError(null);
    setOrderNotFound(false);
    setLastSearchedQuery(trimmed);

    try {
      const res = await fetch(`/api/orders?query=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (res.ok && data.success && data.order) {
        setOrder(data.order);
        setOrderNotFound(false);
        setError(null);
      } else {
        setOrder(null);
        setOrderNotFound(true);
        setError(data.message || 'Order not found');
      }
    } catch {
      setError('Unable to fetch live tracking status. Please check your connection.');
      setOrder(null);
      setOrderNotFound(false);
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

  const getActiveStageIndex = (status: string) => {
    switch (status) {
      case 'delivered':
        return 4;
      case 'out_for_delivery':
        return 3;
      case 'in_transit':
        return 2;
      case 'dispatched':
        return 1;
      case 'confirmed':
      default:
        return 0;
    }
  };

  const currentStageIndex = order ? getActiveStageIndex(order.status) : 0;

  const stagesFlow = [
    {
      key: 'confirmed',
      title: 'Order Confirmed',
      subtitle: 'Order received & prepaid payment verified',
      location: 'Rezoni Central Logistics Hub, Gurugram',
    },
    {
      key: 'dispatched',
      title: 'Dispatched & Packed',
      subtitle: `Undergoing quality check & handoff to ${order?.carrier || 'BlueDart'}`,
      location: `${order?.carrier || 'BlueDart'} Dispatch Center, Delhi NCR`,
    },
    {
      key: 'in_transit',
      title: 'In Transit',
      subtitle: `Shipment en route via ${order?.carrier || 'BlueDart'} express network`,
      location: `${order?.carrier || 'BlueDart'} National Air Sorting Facility`,
    },
    {
      key: 'out_for_delivery',
      title: 'Out for Delivery',
      subtitle: 'Courier executive assigned for doorstep delivery',
      location: order?.shippingAddress?.city ? `${order.shippingAddress.city} Delivery Hub` : 'Local Delivery Center',
    },
    {
      key: 'delivered',
      title: 'Delivered',
      subtitle: 'Direct doorstep delivery with 6-month product warranty',
      location: order?.shippingAddress?.city
        ? `${order.shippingAddress.address ? `${order.shippingAddress.address}, ` : ''}${order.shippingAddress.city}${order.shippingAddress.pincode ? ` (${order.shippingAddress.pincode})` : ''}`
        : 'Customer Doorstep (Verified Delivery)',
    },
  ];

  return (
    <div className="track-order-page-wrapper">
      {/* Search Card */}
      <div className="track-order-search-card">
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
          Enter your Order ID or registered mobile number to check real-time courier status.
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
            Order ID / Mobile Number / AWB
          </label>

          <input
            type="text"
            id="order_tracking_data"
            name="order_tracking"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. #RZ-206177 or 9876543210"
            style={{
              width: '100%',
              height: '44px',
              padding: '10px 14px',
              borderRadius: '6px',
              border: error && !orderNotFound ? '1.5px solid #ef4444' : '1px solid #d5d5d5',
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
            {loading ? 'Locating Order...' : 'Track Order'}
          </button>

          {error && !orderNotFound && (
            <span style={{ display: 'block', fontSize: '13px', color: '#dc2626', marginTop: '12px', fontWeight: 500 }}>
              {error}
            </span>
          )}
        </form>
      </div>

      {/* Reassuring Not Found Card */}
      {orderNotFound && !loading && (
        <div
          style={{
            maxWidth: '520px',
            margin: '1.2rem auto',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '26px 20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '1px solid #fed7aa',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#fff7ed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              fontSize: '22px',
            }}
          >
            🔍
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
            Order Details Not Found Yet
          </h3>
          <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 16px' }}>
            We couldn&apos;t find an active order matching <strong style={{ color: '#111' }}>&ldquo;{lastSearchedQuery}&rdquo;</strong>.
            Newly placed orders typically take <strong>15–30 minutes</strong> to sync with our courier partner.
          </p>

          <div
            style={{
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              padding: '12px 14px',
              textAlign: 'left',
              fontSize: '12px',
              color: '#4b5563',
              marginBottom: '16px',
              border: '1px solid #f3f4f6',
              lineHeight: 1.8,
            }}
          >
            <div style={{ fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Quick Checklist:</div>
            <div>• Verify your Order ID format (e.g. <strong>RZ-206177</strong>).</div>
            <div>• Or search using the <strong>10-digit mobile number</strong> provided during checkout.</div>
            <div>• Check your order confirmation SMS or Email for direct status updates.</div>
          </div>

          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Need help? Please write to our support team at{' '}
            <a href="mailto:hello@rezoni.com" style={{ color: '#ff6700', fontWeight: 600, textDecoration: 'underline' }}>
              hello@rezoni.com
            </a>
          </div>
        </div>
      )}

      {/* Tracking Results Card */}
      {order && (
        <div className="track-order-results-card">
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
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: '#e6f4ea',
                    color: '#137333',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '999px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                  Verified Order
                </span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#111111', lineHeight: 1.3 }}>
                {order.statusLabel}
              </div>
              <div style={{ fontSize: '13px', color: '#555555', marginTop: '4px' }}>
                Carrier: <strong style={{ color: '#222' }}>{order.carrier}</strong> • Tracking AWB: <strong style={{ color: '#ff6700' }}>{order.trackingNumber}</strong>
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

          {/* 5-Step Horizontal Status Progression Bar with Live Radar Ping */}
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
                      currentStageIndex === 4
                        ? '100%'
                        : currentStageIndex === 3
                        ? '75%'
                        : currentStageIndex === 2
                        ? '50%'
                        : currentStageIndex === 1
                        ? '25%'
                        : '6%',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>

              {stagesFlow.map((stage, idx) => {
                const isCompleted = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                const matchingTimeline = order?.timeline?.find((t) =>
                  t.key === stage.key ||
                  t.title.toLowerCase().includes(stage.key.replace('_', ' ')) ||
                  (stage.key === 'confirmed' && t.title.toLowerCase().includes('confirmed')) ||
                  (stage.key === 'dispatched' && (t.title.toLowerCase().includes('dispatched') || t.title.toLowerCase().includes('packed'))) ||
                  (stage.key === 'in_transit' && t.title.toLowerCase().includes('transit')) ||
                  (stage.key === 'out_for_delivery' && t.title.toLowerCase().includes('delivery')) ||
                  (stage.key === 'delivered' && t.title.toLowerCase().includes('delivered'))
                );

                const stageDateText = matchingTimeline?.shortDate || matchingTimeline?.date || '';
                const stageTimeText = matchingTimeline?.shortTime || matchingTimeline?.time || '';

                return (
                  <div key={idx} style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0, padding: '0 2px' }}>
                    <div className="track-node-wrapper">
                      {isCurrent && (
                        <>
                          <span className="track-radar-ping-ring" />
                          <span className="track-radar-ping-ring-delayed" />
                        </>
                      )}
                      <div
                        className={isCurrent ? 'track-node-active' : ''}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: isCompleted ? '#16a34a' : '#ffffff',
                          border: isCompleted ? '2px solid #16a34a' : '2px solid #d1d5db',
                          color: isCompleted ? '#ffffff' : '#9ca3af',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 800,
                          position: 'relative',
                          zIndex: 3,
                          boxShadow: isCompleted ? '0 2px 6px rgba(22, 163, 74, 0.25)' : 'none',
                        }}
                      >
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                    </div>
                    <span
                      className="track-stage-label"
                      style={{
                        fontSize: '11px',
                        fontWeight: isCurrent ? 800 : isCompleted ? 700 : 500,
                        color: isCurrent ? '#16a34a' : isCompleted ? '#111111' : '#888888',
                        marginTop: '8px',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {stage.title.split(' & ')[0]}
                    </span>
                    <span
                      className="track-stage-date"
                      style={{
                        fontSize: '9.5px',
                        fontWeight: isCurrent ? 700 : 500,
                        color: isCurrent ? '#15803d' : isCompleted ? '#4b5563' : '#9ca3af',
                        marginTop: '2px',
                        textAlign: 'center',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isCompleted || isCurrent
                        ? stageDateText
                        : (stageDateText ? `Est. ${stageDateText}` : 'Upcoming')}
                    </span>
                    {stageTimeText && (
                      <span
                        className="track-stage-time"
                        style={{
                          fontSize: '8.5px',
                          fontWeight: isCurrent ? 700 : 400,
                          color: isCurrent ? '#16a34a' : isCompleted ? '#6b7280' : '#9ca3af',
                          textAlign: 'center',
                          lineHeight: 1.2,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {stageTimeText}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sections Stack: ONLY Activity History is a Dropdown Accordion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
            
            {/* 1. ONLY DROPDOWN: Activity History & Hub Scans */}
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
                onClick={() => setIsActivityOpen(!isActivityOpen)}
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
                    {isActivityOpen ? 'Hide details' : 'Tap to expand'}
                  </span>
                  <span
                    style={{
                      display: 'inline-block',
                      transition: 'transform 0.2s',
                      transform: isActivityOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      fontSize: '11px',
                      color: '#444',
                    }}
                  >
                    ▼
                  </span>
                </div>
              </button>

              {isActivityOpen && (
                <div style={{ padding: '20px 18px', borderTop: '1px solid #f0f0f0', backgroundColor: '#ffffff' }}>
                  {/* Vertical 5-Stage Stepper Flow with Connecting Line & Ping */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {stagesFlow.map((stage, sIdx) => {
                      const isCompleted = sIdx <= currentStageIndex;
                      const isCurrent = sIdx === currentStageIndex;
                      const isLast = sIdx === stagesFlow.length - 1;

                      // Check for matching recorded timeline info if available
                      const matchingTimeline = order.timeline?.find((t) =>
                        t.key === stage.key ||
                        t.title.toLowerCase().includes(stage.key.replace('_', ' ')) ||
                        (stage.key === 'confirmed' && t.title.toLowerCase().includes('confirmed')) ||
                        (stage.key === 'dispatched' && (t.title.toLowerCase().includes('dispatched') || t.title.toLowerCase().includes('packed'))) ||
                        (stage.key === 'in_transit' && t.title.toLowerCase().includes('transit')) ||
                        (stage.key === 'out_for_delivery' && t.title.toLowerCase().includes('delivery')) ||
                        (stage.key === 'delivered' && t.title.toLowerCase().includes('delivered'))
                      );

                      const timestamp = matchingTimeline
                        ? `${matchingTimeline.date} • ${matchingTimeline.time}`
                        : isCompleted
                        ? `${order.date} • Verified`
                        : isCurrent
                        ? 'In Progress'
                        : 'Upcoming Expected';

                      return (
                        <div key={stage.key} style={{ display: 'flex', position: 'relative' }}>
                          {/* Continuous Vertical Connecting Line */}
                          {!isLast && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '28px',
                                left: '14px',
                                transform: 'translateX(-50%)',
                                bottom: '-6px',
                                width: '2px',
                                backgroundColor: sIdx < currentStageIndex ? '#16a34a' : '#e5e7eb',
                                zIndex: 1,
                              }}
                            />
                          )}

                          {/* Node with Live Radar Ping on Current Stage */}
                          <div className="track-node-wrapper" style={{ marginRight: '16px', zIndex: 2 }}>
                            {isCurrent && (
                              <>
                                <span className="track-radar-ping-ring" />
                                <span className="track-radar-ping-ring-delayed" />
                              </>
                            )}
                            <div
                              className={isCurrent ? 'track-node-active' : ''}
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: isCompleted ? '#16a34a' : '#ffffff',
                                border: isCompleted ? '2px solid #16a34a' : '2px solid #d1d5db',
                                color: isCompleted ? '#ffffff' : '#9ca3af',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 800,
                                position: 'relative',
                                zIndex: 3,
                                boxShadow: isCompleted ? '0 2px 6px rgba(22, 163, 74, 0.25)' : 'none',
                              }}
                            >
                              {isCompleted ? '✓' : sIdx + 1}
                            </div>
                          </div>

                          {/* Stage Details */}
                          <div style={{ flex: 1, paddingBottom: isLast ? 0 : '26px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '14px', fontWeight: isCurrent ? 800 : isCompleted ? 700 : 500, color: isCurrent ? '#16a34a' : isCompleted ? '#111111' : '#888888' }}>
                                {stage.title}
                              </span>
                              {isCurrent && (
                                <span
                                  style={{
                                    fontSize: '10px',
                                    fontWeight: 800,
                                    color: '#15803d',
                                    backgroundColor: '#dcfce7',
                                    padding: '2px 7px',
                                    borderRadius: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                  }}
                                >
                                  Active Stage
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '12.5px', color: '#374151', lineHeight: 1.5, marginBottom: '4px' }}>
                              {matchingTimeline?.description || stage.subtitle}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                              <span>📍</span>
                              <span>{matchingTimeline?.location || stage.location}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: isCurrent ? '#15803d' : '#6b7280', fontWeight: isCurrent ? 700 : 500, display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <span>🕒</span>
                              <span>{timestamp}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. STATIC CARD: Shipment Items & Free Gifts (No Dropdown) */}
            <div
              style={{
                border: '1px solid #ebebeb',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '16px' }}>📦</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Shipment Items & Free Gifts ({order.items?.length || 0})
                </span>
              </div>

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
                      marginTop: '6px',
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

            {/* 3. STATIC CARD: Delivery Address & Customer (No Dropdown) */}
            <div
              style={{
                border: '1px solid #ebebeb',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                padding: '18px 20px',
                fontSize: '13px',
                color: '#444',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px' }}>📍</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Delivery Address & Recipient
                </span>
              </div>

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
