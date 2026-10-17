'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const { user, isLoggedIn, openAuthModal, logout } = useAuth();

  if (!isLoggedIn || !user) {
    return (
      <div style={{ backgroundColor: '#fcfcfc', minHeight: '75vh', padding: '60px 20px', fontFamily: 'Montserrat, sans-serif' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '12px', padding: '36px 30px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#fff4eb', color: '#ff6700', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: '26px' }}>
            👤
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#111111', margin: '0 0 10px' }}>
            My Rezoni Account
          </h1>
          <p style={{ fontSize: '14px', color: '#666666', lineHeight: 1.5, marginBottom: '26px' }}>
            Sign in or create an account to view your saved orders, live tracking progress, and reviews.
          </p>

          <button
            type="button"
            onClick={() => openAuthModal('register')}
            style={{
              width: '100%',
              backgroundColor: '#ff6700',
              color: '#ffffff',
              border: 'none',
              height: '48px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              marginBottom: '12px',
            }}
          >
            Register / Create Account
          </button>

          <button
            type="button"
            onClick={() => openAuthModal('login')}
            style={{
              width: '100%',
              backgroundColor: '#ffffff',
              color: '#111111',
              border: '1.5px solid #222222',
              height: '48px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Sign In with Existing Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page-wrapper">
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '12px', color: '#888888', marginBottom: '14px' }}>
          <Link href="/" style={{ color: '#888888', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#111111' }}>My Account</span>
        </div>

        {/* Profile Card Header */}
        <div className="account-profile-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: '#111111',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#111111', margin: 0, lineHeight: 1.2 }}>
                {user.name}
              </h1>
              <div style={{ fontSize: '13px', color: '#666666', marginTop: '2px' }}>
                {user.email}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Link
              href="/track-order"
              style={{
                padding: '7px 14px',
                backgroundColor: '#fff4eb',
                color: '#ff6700',
                border: '1px solid #fed7aa',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🚚</span> Track Order
            </Link>
            <button
              onClick={logout}
              style={{
                padding: '7px 14px',
                backgroundColor: '#ffffff',
                color: '#555555',
                border: '1px solid #dddddd',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Orders Section */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#111111', margin: 0 }}>
              Order History ({user.orders ? user.orders.length : 0})
            </h2>
            <Link href="/products/anti-yellow-magsafe-clear-case" style={{ fontSize: '12.5px', color: '#ff6700', fontWeight: 700, textDecoration: 'none' }}>
              + Shop More Cases
            </Link>
          </div>

          {(!user.orders || user.orders.length === 0) ? (
            <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#888' }}>
              <p style={{ margin: '0 0 14px', fontSize: '15px' }}>No orders placed yet.</p>
              <Link
                href="/products/anti-yellow-magsafe-clear-case"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#111111',
                  color: '#ffffff',
                  padding: '10px 22px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Browse Cases
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {user.orders.map((order) => {
                const statusColor =
                  order.status === 'delivered'
                    ? '#16a34a'
                    : order.status === 'in_transit' || order.status === 'out_for_delivery'
                    ? '#f59e0b'
                    : '#2563eb';

                const statusBg =
                  order.status === 'delivered'
                    ? '#f0fdf4'
                    : order.status === 'in_transit' || order.status === 'out_for_delivery'
                    ? '#fffbeb'
                    : '#eff6ff';

                return (
                  <div
                    key={order.id}
                    className="account-order-card"
                  >
                    {/* Order Header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #f3f3f3',
                        paddingBottom: '14px',
                        marginBottom: '16px',
                        flexWrap: 'wrap',
                        gap: '10px',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#111111' }}>
                          Order {order.id}
                        </div>
                        <div style={{ fontSize: '12px', color: '#888888', marginTop: '2px' }}>
                          Placed on {order.date} • Total: Rs. {Number(order.total).toFixed(2)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          style={{
                            backgroundColor: statusBg,
                            color: statusColor,
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: '20px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          ● {order.statusLabel || order.status}
                        </span>

                        <Link
                          href={`/track-order?id=${order.id}`}
                          style={{
                            backgroundColor: '#ff6700',
                            color: '#ffffff',
                            padding: '6px 14px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          Track Order →
                        </Link>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {order.items.map((item, iIdx) => (
                        <div key={iIdx} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div
                            style={{
                              width: '52px',
                              height: '52px',
                              borderRadius: '6px',
                              backgroundColor: '#f8f8f8',
                              border: '1px solid #eeeeee',
                              overflow: 'hidden',
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111111' }}>
                              {item.title}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666666', marginTop: '2px' }}>
                              {item.model ? `Model: ${item.model}` : ''} {item.variant ? `• Variant: ${item.variant}` : ''} • Qty: {item.quantity}
                            </div>
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#111111' }}>
                            Rs. {Number(item.price).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address Footer */}
                    {order.shippingAddress && (
                      <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed #eeeeee', fontSize: '11.5px', color: '#777' }}>
                        📍 <strong>Delivery Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111111', marginBottom: '14px' }}>
            My Reviews & Feedback ({user.reviews ? user.reviews.length : 0})
          </h2>
          {(!user.reviews || user.reviews.length === 0) ? (
            <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', textAlign: 'center', color: '#888' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>
                You haven’t submitted any product reviews yet. Reviews submitted on any product detail page will automatically be linked to your account.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {user.reviews.map((rev) => (
                <div key={rev.id} style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '8px', border: '1px solid #eeeeee' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '14px', color: '#111' }}>{rev.productTitle} {rev.model ? `(${rev.model})` : ''}</strong>
                    <span style={{ color: '#FBBE01', fontSize: '14px' }}>{'★'.repeat(rev.rating)}</span>
                  </div>
                  <p style={{ margin: '4px 0 6px', fontSize: '13px', color: '#444' }}>{rev.body}</p>
                  <span style={{ fontSize: '11px', color: '#888' }}>Submitted on {rev.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
