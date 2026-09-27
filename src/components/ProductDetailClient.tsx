'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

// Exact models from Rezoni live dropdown
const phoneModels = [
  'iPhone 16 Pro Max',
  'iPhone 16 Pro',
  'iPhone 16 Plus',
  'iPhone 16',
  'iPhone 15 Pro Max',
  'iPhone 15 Pro',
  'iPhone 15 Plus',
  'iPhone 15',
  'iPhone 14 Pro Max',
  'iPhone 14 Pro',
  'iPhone 14 Plus',
  'iPhone 14',
  'iPhone 13 Pro Max',
  'iPhone 13 Pro',
  'iPhone 13',
  'iPhone 13 Mini',
  'iPhone 12 Pro Max',
  'iPhone 12/12 Pro',
  'iPhone 12 Mini',
  'iPhone 11 Pro Max',
  'iPhone 11 Pro',
  'iPhone 11',
  'iPhone X/XS',
  'iPhone XR',
];

// As Seen On cards from live site
const asSeenOnCards = [
  'https://www.rezoni.com/cdn/shop/files/1_ba23e34f-dfaf-4723-b59f-bf10f1397ae1.jpg?v=1722677673',
  'https://www.rezoni.com/cdn/shop/files/2_2d7b4187-f3ab-4e0d-a4c5-2faf00bbb4e1.jpg?v=1722677673',
  'https://www.rezoni.com/cdn/shop/files/3_feb2b0f8-e6a9-46f8-a494-a24fef449432.jpg?v=1722677673',
  'https://www.rezoni.com/cdn/shop/files/4_d2f7bb5c-1804-44f2-869b-c3c05f87b6f4.jpg?v=1722677673',
  'https://www.rezoni.com/cdn/shop/files/5_ff4e3aee-0640-431d-aa8f-57aa557961ae.jpg?v=1722677673',
  'https://www.rezoni.com/cdn/shop/files/6_fa0b3a51-afde-46f5-a53c-a2107e0183a7.jpg?v=1722677673',
  'https://www.rezoni.com/cdn/shop/files/7_aaaee8e3-ceb8-4e9a-b54a-42328c81a17f.jpg?v=1722677673',
  'https://www.rezoni.com/cdn/shop/files/8_15b11f00-520c-4938-b3ae-26aeeb055c55.jpg?v=1722677672',
];

export interface ProductDetailProps {
  product: {
    id: number | string;
    title: string;
    handle: string;
    category_tag: string;
    price: number;
    compare_at_price: number;
    primary_image: string;
    images?: string[];
  };
}

// Dynamic Estimated Delivery Calculation: Today + 3 to 4 business days
function getEstimatedDeliveryDates(minOffsetDays = 3, maxOffsetDays = 4) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() + minOffsetDays);
  const end = new Date(now);
  end.setDate(now.getDate() + maxOffsetDays);

  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  return {
    range: `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`,
    startDate: start.toLocaleDateString('en-US', options),
  };
}

export default function ProductDetailClient({ product }: ProductDetailProps) {
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(
    product.primary_image || (product.images && product.images[0]) || ''
  );
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'desc' | 'shipping'>('desc');
  const [deliveryDateRange, setDeliveryDateRange] = useState('');

  useEffect(() => {
    const { range } = getEstimatedDeliveryDates(3, 4);
    setDeliveryDateRange(range);
  }, []);

  const handleAddToCart = () => {
    const device = selectedDevice || phoneModels[0];
    addToCart({
      id: `${product.id}-${device}-${selectedColor}`,
      title: `${product.title} - ${selectedColor}`,
      price: product.price,
      image: selectedImage || product.primary_image,
      device: device,
      quantity: 1,
    });
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode.trim())) {
      const dates = getEstimatedDeliveryDates(3, 4);
      const targetDate = deliveryDateRange ? deliveryDateRange.split(' - ')[0] : dates.startDate;
      setPincodeStatus(`Available! Free Express delivery by ${targetDate} • Cash on Delivery eligible.`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit postal code.');
    }
  };

  const allImages = product.images && product.images.length > 0 ? product.images : [product.primary_image];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh', padding: '16px 0 80px', fontFamily: 'Montserrat, sans-serif' }}>
      <div className="container">
        {/* Breadcrumb Navigation matching live: Home / {product.title} */}
        <div style={{ fontSize: '13px', color: '#888888', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#666666', textDecoration: 'none' }}>
            Home
          </Link>{' '}
          / <span style={{ color: '#222222', fontWeight: 500 }}>{product.title}</span>
        </div>

        {/* 2-Column Product Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '48px',
            alignItems: 'start',
          }}
        >
          {/* ================= LEFT COLUMN: IMAGES ================= */}
          <div>
            {/* Primary Media Box with Zoom Icon */}
            <div
              style={{
                position: 'relative',
                borderRadius: '4px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                aspectRatio: '0.85',
                marginBottom: '16px',
                border: '1px solid #f0f0f0',
              }}
            >
              <img
                src={selectedImage || product.primary_image}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />

              {/* Zoom overlay button on bottom right */}
              <div
                style={{
                  position: 'absolute',
                  right: '16px',
                  bottom: '16px',
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>

            {/* Thumbnail Row */}
            {allImages.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
                {allImages.slice(0, 7).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '4px',
                      border: selectedImage === img ? '2px solid #000000' : '1px solid #e0e0e0',
                      padding: '2px',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= RIGHT COLUMN: PRODUCT DETAILS ================= */}
          <div>
            {/* Title */}
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#000000',
                letterSpacing: '-0.5px',
                margin: '0 0 10px',
              }}
            >
              {product.title}
            </h1>

            {/* Price Line matching live_pdp.png */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#e53935' }}>
                Rs. {product.price.toFixed(2)}
              </span>
              <span style={{ fontSize: '15px', color: '#888888', textDecoration: 'line-through' }}>
                Rs. {product.compare_at_price.toFixed(2)}
              </span>
              <span
                style={{
                  backgroundColor: '#e53935',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '3px',
                  letterSpacing: '0.5px',
                }}
              >
                SAVE 30%
              </span>
            </div>

            {/* Model Dropdown Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#333333',
                  marginBottom: '6px',
                }}
              >
                Model:
              </label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '4px',
                  border: '1px solid #cccccc',
                  backgroundColor: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: selectedDevice ? '#111111' : '#666666',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">Please select model</option>
                {phoneModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Swatches */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#333333', marginBottom: '8px' }}>
                Color: <span style={{ fontWeight: 400, color: '#666' }}>{selectedColor}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span
                  onClick={() => setSelectedColor('Black')}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#000000',
                    outline: selectedColor === 'Black' ? '2px solid #000000' : 'none',
                    outlineOffset: '2px',
                    cursor: 'pointer',
                    display: 'inline-block',
                  }}
                  title="Black"
                />
                <span
                  onClick={() => setSelectedColor('Clear')}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cccccc',
                    outline: selectedColor === 'Clear' ? '2px solid #000000' : 'none',
                    outlineOffset: '2px',
                    cursor: 'pointer',
                    display: 'inline-block',
                  }}
                  title="Clear"
                />
              </div>
            </div>

            {/* Limited Time Sale Ribbon Bar above ADD TO CART */}
            <div
              style={{
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                padding: '8px 12px',
                borderRadius: '5px 5px 0 0',
              }}
            >
              🔥 BIG SUMMER SALE | LIMITED TIME ONLY
            </div>

            {/* Main ADD TO CART Button */}
            <button
              onClick={handleAddToCart}
              style={{
                width: '100%',
                backgroundColor: '#ff6700',
                color: '#ffffff',
                border: 'none',
                height: '52px',
                borderRadius: '0 0 5px 5px',
                fontSize: '14px',
                fontWeight: 800,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                marginBottom: '10px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e65c00')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ff6700')}
            >
              ADD TO CART
            </button>

            {/* Estimated Delivery Note */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: '#333333',
                marginBottom: '16px',
              }}
            >
              <span>📦</span>
              <span>
                Ships in 1 day, estimated delivery:{' '}
                <strong style={{ color: '#000000' }} suppressHydrationWarning>
                  {deliveryDateRange || getEstimatedDeliveryDates(3, 4).range}
                </strong>
              </span>
            </div>

            {/* Pincode Checker Component */}
            <div
              style={{
                border: '1px solid #eaeaea',
                borderRadius: '6px',
                padding: '12px 14px',
                backgroundColor: '#fafafa',
                marginBottom: '20px',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
                Check Delivery & COD Availability
              </div>
              <form onSubmit={handlePincodeCheck} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit Pincode"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    fontSize: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    outline: 'none',
                    backgroundColor: '#fff',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    padding: '8px 16px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.8px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  CHECK
                </button>
              </form>
              {pincodeStatus && (
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '11px',
                    color: pincodeStatus.startsWith('Available') ? '#2e7d32' : '#d32f2f',
                    fontWeight: 500,
                  }}
                >
                  {pincodeStatus}
                </div>
              )}
            </div>

            {/* 3 Benefit Badges Row matching live site */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                padding: '14px 0',
                borderTop: '1px solid #eeeeee',
                borderBottom: '1px solid #eeeeee',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              <div>
                <img
                  src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/truck.png?v=1711003297"
                  alt="Express Delivery"
                  style={{ width: '28px', height: '28px', margin: '0 auto 6px' }}
                />
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#111' }}>Express Delivery</div>
                <div style={{ fontSize: '9px', color: '#777' }}>Estimated 2-4 Days</div>
              </div>

              <div>
                <img
                  src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/exchange.png?v=1711003297"
                  alt="7 Day Risk Free"
                  style={{ width: '28px', height: '28px', margin: '0 auto 6px' }}
                />
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#111' }}>7 Day Risk Free</div>
                <div style={{ fontSize: '9px', color: '#777' }}>Returns and Exchanges</div>
              </div>

              <div>
                <img
                  src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/SECURE.png?v=1711010153"
                  alt="Secure Payments"
                  style={{ width: '28px', height: '28px', margin: '0 auto 6px' }}
                />
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#111' }}>Secure Payments</div>
                <div style={{ fontSize: '9px', color: '#777' }}>SSL Secured</div>
              </div>
            </div>

            {/* 100% Money Back Guarantee Seal Box */}
            <div
              style={{
                backgroundColor: '#fffcf0',
                border: '1px solid #f9e79f',
                borderRadius: '8px',
                padding: '16px 20px',
                position: 'relative',
                textAlign: 'center',
              }}
            >
              <img
                src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/Group_18584.png?v=1727107390"
                alt="100% Money Back Guarantee"
                style={{ width: '56px', height: 'auto', margin: '0 auto 8px', display: 'block' }}
              />
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#222', marginBottom: '6px' }}>
                Try for 7 days
              </div>
              <p style={{ fontSize: '11px', color: '#555', lineHeight: 1.6, margin: '0 0 6px' }}>
                We believe in the quality and craftsmanship of our phone cases. With thousands of satisfied customers, we're confident you'll love your purchase.
              </p>
              <p style={{ fontSize: '11px', color: '#555', lineHeight: 1.6, margin: 0 }}>
                You may use the case for 7 days, and if you're not happy, return it for a <strong>no-questions-asked free replacement or refund</strong>.
              </p>
              <div style={{ fontSize: '10px', color: '#ff6700', fontWeight: 600, marginTop: '6px' }}>
                T&C apply.
              </div>
            </div>
          </div>
        </div>

        {/* ================= AS SEEN ON SECTION ================= */}
        <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #eeeeee' }}>
          <h2
            style={{
              textAlign: 'center',
              fontSize: '32px',
              fontWeight: 900,
              color: '#000000',
              letterSpacing: '-0.5px',
              marginBottom: '28px',
            }}
          >
            As Seen On
          </h2>
          <div
            className="hide-scrollbar"
            style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              paddingBottom: '12px',
            }}
          >
            {asSeenOnCards.map((src, idx) => (
              <div
                key={idx}
                style={{
                  flex: '0 0 calc(25% - 12px)',
                  minWidth: '220px',
                  scrollSnapAlign: 'start',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  aspectRatio: '1',
                  backgroundColor: '#f5f5f5',
                }}
              >
                <img
                  src={src}
                  alt={`As seen on ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ================= TABS: DESCRIPTION & SHIPPING ================= */}
        <div style={{ marginTop: '50px' }}>
          <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #e0e0e0', marginBottom: '20px' }}>
            <button
              onClick={() => setActiveTab('desc')}
              style={{
                paddingBottom: '12px',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: activeTab === 'desc' ? '#000000' : '#888888',
                borderBottom: activeTab === 'desc' ? '2px solid #000000' : 'none',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              style={{
                paddingBottom: '12px',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: activeTab === 'shipping' ? '#000000' : '#888888',
                borderBottom: activeTab === 'shipping' ? '2px solid #000000' : 'none',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Shipping & Returns
            </button>
          </div>

          {activeTab === 'desc' ? (
            <div style={{ fontSize: '13px', lineHeight: 1.8, color: '#444444', maxWidth: '720px' }}>
              <p style={{ marginBottom: '14px' }}>
                Did you decide your phone’s OOTD today? From vibrant colorful prints to the classic sleek and minimal, there’s something for everyone out there. Guarded by a special shock-absorbing bumper to make sure your case-game is more than just good looks, the reverb cases are the new talk of the town and you need to get your hands on ‘em STAT!
              </p>
              <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                <li>&bull; 6.6ft drop-protection</li>
                <li>&bull; Ultra-sleek, slim, lightweight</li>
                <li>&bull; Wireless charging compatible</li>
                <li>&bull; Flexible case, easy to put on and off</li>
                <li>&bull; Anti-scratch and Anti-Microbial surface</li>
                <li>&bull; UV-resistant coating delays yellowing</li>
              </ul>
            </div>
          ) : (
            <div style={{ fontSize: '13px', lineHeight: 1.8, color: '#444444', maxWidth: '720px' }}>
              <p style={{ marginBottom: '12px' }}>
                <strong>Dispatch:</strong> Orders are dispatched within 24 hours of order placement via Delhivery or Bluedart.
              </p>
              <p style={{ marginBottom: '12px' }}>
                <strong>Delivery Timeline:</strong> Metro cities: 2-3 business days. Rest of India: 3-5 business days.
              </p>
              <p style={{ margin: 0 }}>
                <strong>Easy Returns:</strong> 7-day hassle-free returns or exchange policy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
