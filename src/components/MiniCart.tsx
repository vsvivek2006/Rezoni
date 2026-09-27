'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function MiniCart() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [orderNote, setOrderNote] = useState('');
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 999;
  const progress = Math.min(100, (totalPrice / freeShippingThreshold) * 100);
  const remainingForFreeShipping = freeShippingThreshold - totalPrice;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'flex-end',
        transition: 'opacity 0.3s ease',
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          height: '100%',
          backgroundColor: '#ffffff',
          color: '#000000',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid #ebebeb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Cart</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            style={{ fontSize: '18px', padding: '4px 8px', color: '#555' }}
          >
            ✕
          </button>
        </div>

        {/* Trust Banner (from screenshot 06_cart_drawer.png) */}
        <div
          style={{
            backgroundColor: '#eaf8ed',
            padding: '10px 16px',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 600,
            color: '#1b4332',
            borderBottom: '1px solid #d8f3dc',
            lineHeight: 1.5,
          }}
        >
          <div>💖 Trusted by 10,00,000+ customers!</div>
          <div>💯 100% refund if you don&apos;t like it!</div>
        </div>

        {/* Free Shipping Progress Meter (shown when cart has items, matching live_04_cart.png) */}
        {cart.length > 0 && (
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
              {remainingForFreeShipping > 0 ? (
                <>
                  Add <span style={{ color: '#ff6700' }}>Rs. {remainingForFreeShipping.toFixed(2)}</span> more to unlock Free Nationwide Shipping!
                </>
              ) : (
                <span style={{ color: '#2d6a4f' }}>🎉 Congratulations! You have unlocked FREE Nationwide Shipping!</span>
              )}
            </div>
            <div style={{ height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: '#ff6700',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Cart Content: Empty or Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cart.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>Your cart is empty</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-rezoni"
                style={{ width: '220px' }}
              >
                START SHOPPING
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '74px',
                      height: '74px',
                      objectFit: 'contain',
                      borderRadius: '4px',
                      backgroundColor: '#f8f8f8',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{item.title}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ color: '#999', fontSize: '13px', padding: '2px 4px' }}
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                    {item.device && (
                      <p style={{ fontSize: '11px', color: '#777', marginTop: '2px' }}>{item.device}</p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{ padding: '3px 8px', fontSize: '14px', color: '#555' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '12px', fontWeight: 600, padding: '0 8px' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{ padding: '3px 8px', fontSize: '14px', color: '#555' }}
                        >
                          +
                        </button>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#ff6700' }}>
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order note toggle */}
              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={() => setIsNoteOpen(!isNoteOpen)}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#666',
                    textDecoration: 'underline',
                  }}
                >
                  {isNoteOpen ? 'Hide order note' : '+ Add order note / instructions'}
                </button>
                {isNoteOpen && (
                  <textarea
                    placeholder="Special instructions for your order..."
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    style={{
                      width: '100%',
                      marginTop: '8px',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      fontSize: '12px',
                      fontFamily: 'inherit',
                    }}
                    rows={3}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Area */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '20px',
              borderTop: '1px solid #ebebeb',
              backgroundColor: '#fafafa',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#555' }}>Subtotal</span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#000' }}>
                Rs. {totalPrice.toFixed(2)}
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#888', marginBottom: '16px' }}>
              Taxes included. Nationwide shipping calculated at checkout.
            </p>

            {/* GoKwik 1-Click Fast Checkout Button */}
            <button
              onClick={() => alert(`Proceeding to GoKwik Fast Checkout for Rs. ${totalPrice.toFixed(2)}`)}
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '5px',
                backgroundColor: '#ff6700',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '1px',
                marginBottom: '10px',
                boxShadow: '0 4px 12px rgba(255, 103, 0, 0.3)',
              }}
            >
              <span>1-CLICK QUICK CHECKOUT</span>
              <span style={{ fontSize: '9px', fontWeight: 400, opacity: 0.9 }}>
                UPI • GOOGLE PAY • PHONEPE • CARDS • COD
              </span>
            </button>

            {/* Standard Checkout Button */}
            <button
              onClick={() => alert(`Standard Checkout initialized for Rs. ${totalPrice.toFixed(2)}`)}
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '5px',
                backgroundColor: '#000000',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '1px',
              }}
            >
              PROCEED TO STANDARD CHECKOUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
