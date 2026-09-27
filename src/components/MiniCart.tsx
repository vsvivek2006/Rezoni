'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CheckoutAddressForm from './CheckoutAddressForm';

export default function MiniCart() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [orderNote, setOrderNote] = useState('');
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [drawerStep, setDrawerStep] = useState<'cart' | 'checkout'>('cart');

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setDrawerStep('cart');
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
        {drawerStep === 'checkout' ? (
          /* Checkout Step: Address & Contact Collection */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close checkout"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 20,
                background: '#f0f0f0',
                border: 'none',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                color: '#444',
              }}
            >
              ✕
            </button>
            <CheckoutAddressForm
              totalPrice={totalPrice}
              cart={cart}
              onBackToCart={() => setDrawerStep('cart')}
              isDrawer={true}
            />
          </div>
        ) : (
          /* Cart Step: View Items, Adjust Quantities, Notes & Summary */
          <>
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
                style={{ fontSize: '18px', padding: '4px 8px', color: '#555', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Trust Banner */}
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

            {/* Free Shipping Progress Meter */}
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
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#444', marginBottom: '8px' }}>Your cart is empty</p>
                  <p style={{ fontSize: '13px', marginBottom: '20px' }}>Looks like you haven&apos;t added any cases yet.</p>
                  <Link
                    href="/collections/all"
                    onClick={() => setIsCartOpen(false)}
                    className="btn-rezoni"
                    style={{ padding: '10px 24px', fontSize: '12px', display: 'inline-block' }}
                  >
                    CONTINUE SHOPPING
                  </Link>
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
                      <div
                        style={{
                          width: '74px',
                          height: '92px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          backgroundColor: '#f5f5f5',
                          flexShrink: 0,
                          border: '1px solid #eee',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 4px', lineHeight: 1.3 }}>
                              {item.title}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              aria-label="Remove item"
                              style={{ color: '#999', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}
                            >
                              ✕
                            </button>
                          </div>
                          {item.device && (
                            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                              Model: <span style={{ fontWeight: 600, color: '#333' }}>{item.device}</span>
                            </div>
                          )}
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#000000' }}>
                            Rs. {item.price.toFixed(2)}
                          </div>
                        </div>

                        {/* Quantity Selector */}
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              border: '1px solid #d5d5d5',
                              borderRadius: '4px',
                              overflow: 'hidden',
                            }}
                          >
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              aria-label="Decrease quantity"
                              style={{
                                width: '28px',
                                height: '28px',
                                border: 'none',
                                background: '#fff',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                              }}
                            >
                              -
                            </button>
                            <span style={{ width: '28px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              aria-label="Increase quantity"
                              style={{
                                width: '28px',
                                height: '28px',
                                border: 'none',
                                background: '#fff',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Order Note */}
                  <div style={{ marginTop: '10px' }}>
                    <button
                      onClick={() => setIsNoteOpen(!isNoteOpen)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '12px',
                        color: '#555',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {isNoteOpen ? 'Hide order instructions' : 'Add special order instructions'}
                    </button>
                    {isNoteOpen && (
                      <textarea
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        placeholder="Special instructions for seller or delivery..."
                        style={{
                          width: '100%',
                          marginTop: '8px',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          fontSize: '16px', // 16px strictly avoids auto-zoom on mobile
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
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
                  padding: '18px 20px',
                  borderTop: '1px solid #ebebeb',
                  backgroundColor: '#fafafa',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#555' }}>Subtotal</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#000' }}>
                    Rs. {totalPrice.toFixed(2)}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#888', marginBottom: '14px' }}>
                  Taxes included. Nationwide express shipping applied at checkout.
                </p>

                {/* 1-Click Fast Checkout Button -> Opens Address Step */}
                <button
                  onClick={() => setDrawerStep('checkout')}
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
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(255, 103, 0, 0.3)',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e65c00')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ff6700')}
                >
                  <span>1-CLICK QUICK CHECKOUT</span>
                  <span style={{ fontSize: '9px', fontWeight: 400, opacity: 0.9 }}>
                    UPI • GOOGLE PAY • PHONEPE • CARDS • COD
                  </span>
                </button>

                {/* Standard Checkout Button -> Opens Address Step */}
                <button
                  onClick={() => setDrawerStep('checkout')}
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
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  PROCEED TO STANDARD CHECKOUT
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
