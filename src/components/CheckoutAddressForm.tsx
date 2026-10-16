'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { openRazorpayCheckout } from '@/lib/razorpayClient';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '@/lib/priceCalculator';
import CheckoutTrustBadges from './CheckoutTrustBadges';

export interface AddressData {
  email: string;
  phone: string;
  fullName: string;
  pincode: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  saveInfo: boolean;
}

interface CartItemPreview {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  device?: string;
}

interface CheckoutAddressFormProps {
  totalPrice: number;
  cart: CartItemPreview[];
  onBackToCart?: () => void;
  isDrawer?: boolean;
}

const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const PINCODE_PREFIX_MAP: Record<string, { city: string; state: string }> = {
  '11': { city: 'New Delhi', state: 'Delhi' },
  '12': { city: 'Gurugram', state: 'Haryana' },
  '13': { city: 'Karnal', state: 'Haryana' },
  '14': { city: 'Amritsar', state: 'Punjab' },
  '16': { city: 'Chandigarh', state: 'Chandigarh' },
  '20': { city: 'Noida', state: 'Uttar Pradesh' },
  '22': { city: 'Lucknow', state: 'Uttar Pradesh' },
  '24': { city: 'Dehradun', state: 'Uttarakhand' },
  '28': { city: 'Agra', state: 'Uttar Pradesh' },
  '30': { city: 'Jaipur', state: 'Rajasthan' },
  '34': { city: 'Jodhpur', state: 'Rajasthan' },
  '38': { city: 'Ahmedabad', state: 'Gujarat' },
  '39': { city: 'Surat', state: 'Gujarat' },
  '40': { city: 'Mumbai', state: 'Maharashtra' },
  '41': { city: 'Pune', state: 'Maharashtra' },
  '44': { city: 'Nagpur', state: 'Maharashtra' },
  '45': { city: 'Indore', state: 'Madhya Pradesh' },
  '46': { city: 'Bhopal', state: 'Madhya Pradesh' },
  '50': { city: 'Hyderabad', state: 'Telangana' },
  '52': { city: 'Vijayawada', state: 'Andhra Pradesh' },
  '53': { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  '56': { city: 'Bengaluru', state: 'Karnataka' },
  '57': { city: 'Mangalore', state: 'Karnataka' },
  '60': { city: 'Chennai', state: 'Tamil Nadu' },
  '64': { city: 'Coimbatore', state: 'Tamil Nadu' },
  '68': { city: 'Kochi', state: 'Kerala' },
  '69': { city: 'Thiruvananthapuram', state: 'Kerala' },
  '70': { city: 'Kolkata', state: 'West Bengal' },
  '75': { city: 'Bhubaneswar', state: 'Odisha' },
  '78': { city: 'Guwahati', state: 'Assam' },
  '80': { city: 'Patna', state: 'Bihar' },
  '83': { city: 'Ranchi', state: 'Jharkhand' },
};

const STORAGE_KEY = 'rezoni_checkout_address';

export default function CheckoutAddressForm({
  totalPrice,
  cart,
  onBackToCart,
  isDrawer = true,
}: CheckoutAddressFormProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [pincode, setPincode] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Delhi');
  const [saveInfo, setSaveInfo] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const { clearCart, setIsCartOpen } = useCart();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  // Delivery fee tracking logic
  const safeCart = Array.isArray(cart) ? cart.filter(Boolean) : [];
  const safeTotalPrice = typeof totalPrice === 'number' && !isNaN(totalPrice) ? totalPrice : 0;
  const isFreeShipping = safeTotalPrice >= FREE_SHIPPING_THRESHOLD;
  const deliveryFee = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const finalPayable = safeTotalPrice + deliveryFee;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - safeTotalPrice);

  // Load saved address from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: AddressData = JSON.parse(saved);
        if (data.email) setEmail(data.email);
        if (data.phone) setPhone(data.phone);
        if (data.fullName) setFullName(data.fullName);
        if (data.pincode) setPincode(data.pincode);
        if (data.addressLine1) setAddressLine1(data.addressLine1);
        if (data.addressLine2) setAddressLine2(data.addressLine2);
        if (data.city) setCity(data.city);
        if (data.state) setState(data.state);
      }
    } catch {
      // ignore JSON errors
    }
  }, []);

  // Handle PIN code auto-fill
  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);

    if (errors.pincode) {
      setErrors((prev) => ({ ...prev, pincode: '' }));
    }

    if (val.length >= 2) {
      const prefix = val.slice(0, 2);
      const match = PINCODE_PREFIX_MAP[prefix];
      if (match) {
        if (!city) setCity(match.city);
        setState(match.state);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (phone.trim().length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!pincode.trim()) {
      newErrors.pincode = 'PIN code is required';
    } else if (pincode.trim().length !== 6) {
      newErrors.pincode = 'Please enter a 6-digit PIN code';
    }

    if (!addressLine1.trim()) {
      newErrors.addressLine1 = 'House/Flat number and building are required';
    }

    if (!city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!state.trim()) {
      newErrors.state = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const addressPayload: AddressData = {
      email: email.trim(),
      phone: phone.trim(),
      fullName: fullName.trim(),
      pincode: pincode.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      city: city.trim(),
      state: state.trim(),
      saveInfo,
    };

    if (saveInfo) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(addressPayload));
      } catch {
        // storage quota exceeded or disabled
      }
    }

    setIsConfirmed(true);
  };

  const handlePayWithRazorpay = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);
    setPaymentNotice(null);

    const addressPayload: AddressData = {
      email: email.trim(),
      phone: phone.trim(),
      fullName: fullName.trim(),
      pincode: pincode.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      city: city.trim(),
      state: state.trim(),
      saveInfo,
    };

    try {
      // 1. Initiate order creation on server with price verification
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          customer: addressPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.isConfigError) {
          setPaymentError(
            'Razorpay Setup Notice: Please configure NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local to activate payments.'
          );
        } else {
          setPaymentError(data.message || 'Failed to initiate checkout order. Please try again.');
        }
        setIsProcessingPayment(false);
        return;
      }

      // 2. Open official Razorpay Checkout Modal
      await openRazorpayCheckout({
        keyId: data.keyId,
        orderId: data.razorpayOrderId,
        amount: data.amount,
        currency: data.currency || 'INR',
        customerName: addressPayload.fullName,
        customerEmail: addressPayload.email,
        customerPhone: addressPayload.phone,
        onSuccess: async (rzpRes) => {
          try {
            // 3. Cryptographically verify signature on server (HMAC-SHA256)
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: data.orderId,
                razorpayOrderId: rzpRes.razorpay_order_id,
                razorpayPaymentId: rzpRes.razorpay_payment_id,
                razorpaySignature: rzpRes.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              // Clear cart upon confirmed payment
              clearCart();
              if (isDrawer) {
                setIsCartOpen(false);
              }
              // Redirect to order confirmation & receipt page
              window.location.href = `/checkout/success?order_id=${encodeURIComponent(data.orderId)}`;
            } else {
              setPaymentError(
                verifyData.message ||
                  `Payment received by bank (ID: ${rzpRes.razorpay_payment_id}), but verification check encountered an issue. Our team is auto-confirming it.`
              );
              setIsProcessingPayment(false);
            }
          } catch (vErr) {
            console.error('Payment verification error:', vErr);
            setPaymentError(
              'Payment succeeded, but server verification connection timed out. If money was debited, your order will automatically be confirmed.'
            );
            setIsProcessingPayment(false);
          }
        },
        onDismiss: () => {
          setIsProcessingPayment(false);
          setPaymentNotice(
            'Payment window was closed. Your items are safe in cart. Click "Pay Now" whenever you wish to proceed.'
          );
        },
        onFailure: (failRes) => {
          setIsProcessingPayment(false);
          setPaymentError(
            failRes.error?.description ||
              'Payment failed or was declined by issuing bank. Please select an alternate payment method or retry.'
          );
        },
      });
    } catch (err: any) {
      console.error('Payment initiation error:', err);
      setPaymentError(err?.message || 'Unable to connect to payment gateway. Please check your connection.');
      setIsProcessingPayment(false);
    }
  };

  // Compact, high-converting input style
  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '40px',
    padding: '0 10px',
    border: '1px solid #d5d5d5',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    color: '#111111',
    backgroundColor: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#444444',
    marginBottom: '3px',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      {/* Checkout Header */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid #ebebeb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fafafa',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onBackToCart && (
            <button
              onClick={onBackToCart}
              type="button"
              aria-label="Back to Cart"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 700,
                color: '#ff6700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 6px',
              }}
            >
              &larr; Back
            </button>
          )}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: '#111' }}>
              {isConfirmed ? 'Order Ready for Payment' : 'Checkout Details'}
            </h3>
            <span style={{ fontSize: '11px', color: '#666', fontWeight: 500 }}>
              {isConfirmed ? 'Address Confirmed' : 'Step 1 of 2: Contact & Address'}
            </span>
          </div>
        </div>

        <div style={{ fontSize: '12px', fontWeight: 700, color: '#2d6a4f', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>🔒 256-bit Secure</span>
        </div>
      </div>

      {/* Main Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isDrawer ? '16px' : '24px' }}>
        {/* Order Summary Dropdown / Pill */}
        <div
          style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '6px',
            marginBottom: '20px',
            overflow: 'hidden',
          }}
        >
          <button
            type="button"
            onClick={() => setShowOrderSummary(!showOrderSummary)}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              color: '#222',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🛍️ Order Summary ({safeCart.length} {safeCart.length === 1 ? 'item' : 'items'})</span>
              <span style={{ color: '#ff6700' }}>{showOrderSummary ? 'Hide ▲' : 'Show ▼'}</span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#111' }}>
              Rs. {finalPayable.toFixed(2)}
            </div>
          </button>

          {showOrderSummary && (
            <div style={{ padding: '12px 16px', borderTop: '1px solid #e9ecef', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                {safeCart.map((item, idx) => (
                  <div key={item?.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '50px',
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
                      {item?.image ? (
                        <img src={item.image} alt={item.title || 'Item'} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <span style={{ fontSize: '10px', color: '#999' }}>📦</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item?.title || 'Rezoni Item'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        Qty: {item?.quantity || 1} {item?.device ? `• ${item.device}` : ''} {item?.color ? `• ${item.color}` : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#111' }}>
                      Rs. {((Number(item?.price) || 0) * (Number(item?.quantity) || 1)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: '10px', fontSize: '12px', display: 'flex', justifyContent: 'space-between', color: '#666', marginBottom: '4px' }}>
                <span>Delivery:</span>
                {isFreeShipping ? (
                  <span style={{ color: '#059669', fontWeight: 700 }}>FREE (Express)</span>
                ) : (
                  <span style={{ color: '#111', fontWeight: 700 }}>Rs. {deliveryFee.toFixed(2)}</span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, color: '#000', paddingTop: '4px' }}>
                <span>Total Amount:</span>
                <span style={{ color: '#ff6700' }}>Rs. {finalPayable.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* State 1: Fill Address Form */}
        {!isConfirmed ? (
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Quick Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#222' }}>
                Delivery & Contact Details
              </span>
              <span style={{ fontSize: '10px', color: '#059669', fontWeight: 700 }}>
                ⚡ Fast Express Delivery
              </span>
            </div>

            {/* Row 1: Full Name & Mobile Number (2 Columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={labelStyle}>
                  Full Name <span style={{ color: '#e53935' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
                  style={{
                    ...inputStyle,
                    borderColor: errors.fullName ? '#e53935' : '#d5d5d5',
                  }}
                />
                {errors.fullName && (
                  <div style={{ fontSize: '10px', color: '#e53935', marginTop: '2px' }}>
                    {errors.fullName}
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>
                  Mobile <span style={{ color: '#e53935' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div
                    style={{
                      height: '40px',
                      padding: '0 8px',
                      backgroundColor: '#f5f5f5',
                      border: '1px solid #d5d5d5',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#444',
                      flexShrink: 0,
                    }}
                  >
                    +91
                  </div>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    maxLength={10}
                    value={phone}
                    onChange={handlePhoneChange}
                    style={{
                      ...inputStyle,
                      flex: 1,
                      borderColor: errors.phone ? '#e53935' : '#d5d5d5',
                    }}
                  />
                </div>
                {errors.phone && (
                  <div style={{ fontSize: '10px', color: '#e53935', marginTop: '2px' }}>
                    {errors.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Email Address */}
            <div>
              <label style={labelStyle}>
                Email Address <span style={{ color: '#e53935' }}>*</span>
              </label>
              <input
                type="email"
                placeholder="name@example.com (for order tracking & receipt)"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                style={{
                  ...inputStyle,
                  borderColor: errors.email ? '#e53935' : '#d5d5d5',
                }}
              />
              {errors.email && (
                <div style={{ fontSize: '10px', color: '#e53935', marginTop: '2px' }}>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Row 3: Complete Delivery Address */}
            <div>
              <label style={labelStyle}>
                Complete Delivery Address <span style={{ color: '#e53935' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="House/Flat No, Building, Street, Area, Landmark"
                value={addressLine1}
                onChange={(e) => {
                  setAddressLine1(e.target.value);
                  if (errors.addressLine1) setErrors((prev) => ({ ...prev, addressLine1: '' }));
                }}
                style={{
                  ...inputStyle,
                  borderColor: errors.addressLine1 ? '#e53935' : '#d5d5d5',
                }}
              />
              {errors.addressLine1 && (
                <div style={{ fontSize: '10px', color: '#e53935', marginTop: '2px' }}>
                  {errors.addressLine1}
                </div>
              )}
            </div>

            {/* Row 4: PIN Code & City/State (2 Columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '8px' }}>
              <div>
                <label style={labelStyle}>
                  PIN Code <span style={{ color: '#e53935' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="6-digit PIN"
                  maxLength={6}
                  value={pincode}
                  onChange={handlePincodeChange}
                  style={{
                    ...inputStyle,
                    borderColor: errors.pincode ? '#e53935' : '#d5d5d5',
                  }}
                />
                {errors.pincode && (
                  <div style={{ fontSize: '10px', color: '#e53935', marginTop: '2px' }}>
                    {errors.pincode}
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>
                  City <span style={{ color: '#e53935' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
                  }}
                  style={{
                    ...inputStyle,
                    borderColor: errors.city ? '#e53935' : '#d5d5d5',
                  }}
                />
                {errors.city && (
                  <div style={{ fontSize: '10px', color: '#e53935', marginTop: '2px' }}>
                    {errors.city}
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>
                  State <span style={{ color: '#e53935' }}>*</span>
                </label>
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    if (errors.state) setErrors((prev) => ({ ...prev, state: '' }));
                  }}
                  style={{
                    ...inputStyle,
                    borderColor: errors.state ? '#e53935' : '#d5d5d5',
                    appearance: 'auto',
                    fontSize: '12px',
                    padding: '0 6px',
                  }}
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Save Address Toggle */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                color: '#555',
                cursor: 'pointer',
                marginTop: '4px',
              }}
            >
              <input
                type="checkbox"
                checked={saveInfo}
                onChange={(e) => setSaveInfo(e.target.checked)}
                style={{ width: '14px', height: '14px', cursor: 'pointer' }}
              />
              <span>Remember details for next time</span>
            </label>

            {/* Submit Button */}
            <div style={{ marginTop: '8px' }}>
              <button
                type="submit"
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '5px',
                  backgroundColor: '#ff6700',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '12px',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(255, 103, 0, 0.3)',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e65c00')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ff6700')}
              >
                <span>CONTINUE TO PAYMENT (Rs. {finalPayable.toFixed(2)})</span>
                <span>&rarr;</span>
              </button>
            </div>

            {/* 3 Core Trust Badges matching Product Page */}
            <CheckoutTrustBadges compact={isDrawer} />
          </form>
        ) : (
          /* State 2: Address Confirmed - Ready for Payment */
          <div style={{ animation: 'fadeIn 0.25s ease' }}>
            {/* Success Banner */}
            <div
              style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#059669',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#065f46' }}>
                  Contact & Shipping Address Saved!
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#047857', lineHeight: 1.4 }}>
                  All delivery details have been recorded.
                </p>
              </div>
            </div>

            {/* Details Summary Card */}
            <div
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#ffffff',
                marginBottom: '20px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#374151' }}>
                  Delivering To:
                </span>
                <button
                  type="button"
                  onClick={() => setIsConfirmed(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ff6700',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Edit Address
                </button>
              </div>

              <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
                {fullName}
              </div>
              <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: 1.5, marginBottom: '8px' }}>
                {addressLine1}
                {addressLine2 ? `, ${addressLine2}` : ''}
                <br />
                {city}, {state} - <strong style={{ color: '#111' }}>{pincode}</strong>
              </div>

              <div style={{ fontSize: '12px', color: '#374151', borderTop: '1px dashed #e5e7eb', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div>
                  <span style={{ color: '#6b7280' }}>Phone: </span>
                  <strong>+91 {phone}</strong>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Email: </span>
                  <strong>{email}</strong>
                </div>
              </div>
            </div>

            {/* Payment Notifications / Error Alerts */}
            {paymentError && (
              <div
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '14px',
                  marginBottom: '18px',
                  color: '#991b1b',
                  fontSize: '12px',
                  lineHeight: 1.5,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '16px', lineHeight: 1 }}>⚠️</span>
                <div>
                  <strong style={{ display: 'block', marginBottom: '2px', color: '#7f1d1d' }}>
                    Payment Issue Encountered
                  </strong>
                  <span>{paymentError}</span>
                </div>
              </div>
            )}

            {paymentNotice && !paymentError && (
              <div
                style={{
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  marginBottom: '18px',
                  color: '#92400e',
                  fontSize: '12px',
                  lineHeight: 1.4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>ℹ️</span>
                <span>{paymentNotice}</span>
              </div>
            )}


            {/* Payment Summary Box */}
            <div
              style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
                <span>Cart Subtotal</span>
                <span>Rs. {totalPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginBottom: '10px' }}>
                <span>Nationwide Express Shipping</span>
                {isFreeShipping ? (
                  <span style={{ color: '#059669', fontWeight: 700 }}>FREE (Orders ₹999+)</span>
                ) : (
                  <span style={{ color: '#111827', fontWeight: 700 }}>Rs. {deliveryFee.toFixed(2)}</span>
                )}
              </div>

              {!isFreeShipping && remainingForFreeShipping > 0 && (
                <div
                  style={{
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: '5px',
                    padding: '8px 10px',
                    fontSize: '11px',
                    color: '#92400e',
                    marginBottom: '10px',
                    lineHeight: 1.4,
                  }}
                >
                  ⚡ Add <strong style={{ color: '#b45309' }}>Rs. {remainingForFreeShipping.toFixed(2)}</strong> more to unlock <strong>FREE Shipping</strong>!
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px dashed #e5e7eb',
                  paddingTop: '10px',
                }}
              >
                <div>
                  <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                    Final Payable Amount
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#111827' }}>
                    Rs. {finalPayable.toFixed(2)}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                    padding: '4px 10px',
                    borderRadius: '20px',
                  }}
                >
                  🔒 Safe & Encrypted
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* PRIMARY PAY NOW WITH RAZORPAY BUTTON */}
              <button
                type="button"
                onClick={handlePayWithRazorpay}
                disabled={isProcessingPayment}
                style={{
                  width: '100%',
                  height: '54px',
                  borderRadius: '6px',
                  backgroundColor: isProcessingPayment ? '#9ca3af' : '#ff6700',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '13px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: isProcessingPayment ? 'none' : '0 4px 16px rgba(255, 103, 0, 0.4)',
                  transition: 'background-color 0.2s, transform 0.1s',
                }}
                onMouseEnter={(e) => {
                  if (!isProcessingPayment) e.currentTarget.style.backgroundColor = '#e65c00';
                }}
                onMouseLeave={(e) => {
                  if (!isProcessingPayment) e.currentTarget.style.backgroundColor = '#ff6700';
                }}
              >
                {isProcessingPayment ? (
                  <>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        border: '2px solid #ffffff',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        display: 'inline-block',
                      }}
                    />
                    <span>CONNECTING TO RAZORPAY...</span>
                  </>
                ) : (
                  <>
                    <span>🔒 PAY NOW WITH RAZORPAY</span>
                    <span>(Rs. {finalPayable.toFixed(2)})</span>
                    <span>&rarr;</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsConfirmed(false)}
                disabled={isProcessingPayment}
                style={{
                  width: '100%',
                  height: '44px',
                  border: '1px solid #d1d5db',
                  borderRadius: '5px',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                  opacity: isProcessingPayment ? 0.6 : 1,
                }}
              >
                EDIT SHIPPING DETAILS
              </button>

              {onBackToCart && (
                <button
                  type="button"
                  onClick={onBackToCart}
                  disabled={isProcessingPayment}
                  style={{
                    width: '100%',
                    height: '44px',
                    border: 'none',
                    borderRadius: '5px',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.8px',
                    cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                    opacity: isProcessingPayment ? 0.6 : 1,
                  }}
                >
                  RETURN TO CART
                </button>
              )}
            </div>

            {/* 3 Core Trust Badges matching Product Page */}
            <CheckoutTrustBadges compact={isDrawer} />
          </div>
        )}
      </div>
    </div>
  );
}
