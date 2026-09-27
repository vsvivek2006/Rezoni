'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CheckoutAddressForm from '@/components/CheckoutAddressForm';

export default function CheckoutPage() {
  const { cart, totalPrice } = useCart();

  return (
    <div
      style={{
        minHeight: '80vh',
        backgroundColor: '#fbfbfb',
        padding: '30px 16px 60px',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        {/* Breadcrumb / Top Bar */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Link
              href="/"
              style={{
                fontSize: '18px',
                fontWeight: 900,
                letterSpacing: '2px',
                color: '#000000',
                textDecoration: 'none',
              }}
            >
              REZONI
            </Link>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
              Express Secure Checkout
            </div>
          </div>

          <Link
            href="/collections/all"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#ff6700',
              textDecoration: 'none',
            }}
          >
            &larr; Back to Shop
          </Link>
        </div>

        {cart.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '48px 24px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              border: '1px solid #ebebeb',
            }}
          >
            <div style={{ fontSize: '42px', marginBottom: '16px' }}>🛒</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', color: '#111' }}>
              Your cart is empty
            </h2>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '24px' }}>
              Add a stylish case or accessory before proceeding to checkout.
            </p>
            <Link
              href="/collections/all"
              className="btn-rezoni"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                fontSize: '12px',
                textDecoration: 'none',
              }}
            >
              BROWSE BEST SELLERS
            </Link>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
            }}
          >
            <CheckoutAddressForm
              totalPrice={totalPrice}
              cart={cart}
              isDrawer={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
