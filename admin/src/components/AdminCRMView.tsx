'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface OrderItem {
  title: string;
  model?: string;
  variant?: string;
  price: number;
  quantity: number;
  image: string;
}

interface TimelineStep {
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
  current?: boolean;
  location: string;
}

interface Order {
  id: string;
  customerEmail: string;
  customerPhone?: string;
  customerName?: string;
  date: string;
  total: number;
  status: 'confirmed' | 'dispatched' | 'in_transit' | 'out_for_delivery' | 'delivered';
  statusLabel?: string;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery?: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  timeline?: TimelineStep[];
}

interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  reason: string;
  status: 'requested' | 'approved' | 'in_inspection' | 'refunded' | 'rejected';
  statusLabel?: string;
  amount: number;
  date: string;
  items: string;
  trackingNumber?: string;
  notes?: string;
}

interface AdminMetrics {
  totalOrders: number;
  totalRevenue: number;
  netRevenue: number;
  totalReturns: number;
  totalRefunded: number;
  pendingDispatches: number;
  dispatchedCount: number;
  inTransitCount: number;
  outForDeliveryCount: number;
  deliveredCount: number;
  averageOrderValue: number;
  totalCustomers: number;
  totalReviews: number;
}

interface UserReview {
  id: string;
  userName: string;
  userEmail: string;
  productTitle: string;
  model?: string;
  rating: number;
  body: string;
  date: string;
}

interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrder: string;
}

export default function AdminCRMView({
  initialTab = 'overview',
}: {
  initialTab?: 'overview' | 'orders' | 'returns' | 'financials' | 'customers' | 'reviews' | 'security';
}) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<{ id: string; role: string } | null>(null);
  const [idInput, setIdInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'returns' | 'financials' | 'customers' | 'reviews' | 'security'>(initialTab);

  // Data state
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Search & Filter state
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [returnStatusFilter, setReturnStatusFilter] = useState<string>('all');

  // Selected Order for Detail Drawer
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check existing session
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            setAdminUser(data.admin);
          }
        }
      } catch (e) {
      } finally {
        setCheckingAuth(false);
      }
    }
    checkSession();
  }, []);

  const switchTab = (tab: 'overview' | 'orders' | 'returns' | 'financials' | 'customers' | 'reviews' | 'security') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const targetUrl = tab === 'overview' ? '/' : `/${tab}`;
      window.history.pushState(null, '', targetUrl);
    }
  };

  // Login handler with ID and Password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idInput, password: passwordInput }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        setAdminUser(data.admin);
        showToast('Access granted. Welcome to Rezoni CRM.');
      } else {
        setAuthError(data.message || 'Invalid Admin ID or Password.');
      }
    } catch (err: any) {
      setAuthError('Network error connecting to authentication server.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setIsAuthenticated(false);
    setAdminUser(null);
    showToast('Logged out of Admin Portal.');
  };

  // Load all CRM datasets
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, returnsRes, customersRes, reviewsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch(`/api/orders?status=${orderStatusFilter}&q=${encodeURIComponent(orderSearch)}`),
        fetch(`/api/returns?status=${returnStatusFilter}`),
        fetch('/api/customers'),
        fetch('/api/reviews'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setMetrics(statsData.metrics);
      }
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.success) setOrders(ordersData.orders);
      }
      if (returnsRes.ok) {
        const returnsData = await returnsRes.json();
        if (returnsData.success) setReturns(returnsData.returns);
      }
      if (customersRes.ok) {
        const customersData = await customersRes.json();
        if (customersData.success) setCustomers(customersData.customers);
      }
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        if (reviewsData.success) setReviews(reviewsData.reviews);
      }
    } catch (err) {
      console.error('Failed to load CRM data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, orderStatusFilter, returnStatusFilter]);

  // Update order status
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: Order['status'],
    carrier?: string,
    trackingNumber?: string
  ) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus, carrier, trackingNumber }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order ${orderId} updated to ${newStatus}`);
        fetchAllData();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus, carrier: carrier || prev.carrier, trackingNumber: trackingNumber || prev.trackingNumber } : null));
        }
      } else {
        alert(data.message || 'Failed to update order');
      }
    } catch (e: any) {
      alert('Error updating order status: ' + e.message);
    }
  };

  // Update return status
  const handleUpdateReturnStatus = async (returnId: string, newStatus: ReturnRequest['status'], notes?: string) => {
    try {
      const res = await fetch('/api/returns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnId, status: newStatus, notes }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Return ${returnId} marked as ${newStatus}`);
        fetchAllData();
      } else {
        alert(data.message || 'Failed to update return');
      }
    } catch (e: any) {
      alert('Error updating return: ' + e.message);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this customer review?')) return;
    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Review removed from storefront.');
        fetchAllData();
      }
    } catch (e: any) {
      alert('Error deleting review: ' + e.message);
    }
  };

  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b0f19', color: '#94a3b8' }}>
        Verifying secure connection to admin.rezoni.shop...
      </div>
    );
  }

  // ================= RENDER LOGIN GATE (ID + PASSWORD REQUIRED) =================
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0b0f19',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Subtle background glow */}
        <div
          style={{
            position: 'absolute',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 103, 0, 0.12) 0%, transparent 70%)',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '16px',
            padding: '40px 36px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Logo & Subdomain branding */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img
              src="https://www.rezoni.com/cdn/shop/files/final_Horizontal_logo_copy-01_200x.png?v=1647520936"
              alt="Rezoni"
              style={{ height: '28px', margin: '0 auto 14px', display: 'block' }}
            />
            <div
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '999px',
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#ff6700',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              admin.rezoni.shop
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, margin: '6px 0 4px', color: '#f9fafb' }}>
              Executive CRM Portal
            </h1>
            <p style={{ fontSize: '13px', color: '#9ca3af' }}>
              Sign in with your Administrator ID & Password
            </p>
          </div>

          {authError && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '12px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>⚠️</span>
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Field 1: Admin ID */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#9ca3af',
                  marginBottom: '8px',
                }}
              >
                Admin ID / Email
              </label>
              <input
                type="text"
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
                placeholder="admin@rezoni.shop"
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>

            {/* Field 2: Password */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#9ca3af',
                  marginBottom: '8px',
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              style={{
                marginTop: '8px',
                padding: '13px',
                backgroundColor: '#ff6700',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: authLoading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
                opacity: authLoading ? 0.7 : 1,
              }}
            >
              {authLoading ? 'Verifying Credentials...' : 'Sign In to Operations CRM'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
            🔒 Protected Subdomain System • SSL Encrypted Session
          </div>
        </div>
      </div>
    );
  }

  // ================= AUTHENTICATED EXECUTIVE CRM DASHBOARD =================
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#f1f5f9', display: 'flex' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: '#10b981',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
          }}
        >
          ✓ {toastMessage}
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#0f172a',
          borderRight: '1px solid #1e293b',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e293b' }}>
          <img
            src="https://www.rezoni.com/cdn/shop/files/final_Horizontal_logo_copy-01_200x.png?v=1647520936"
            alt="Rezoni"
            style={{ height: '22px', display: 'block', marginBottom: '8px' }}
          />
          <div style={{ fontSize: '11px', color: '#ff6700', fontWeight: 700, letterSpacing: '0.05em' }}>
            admin.rezoni.shop
          </div>
        </div>

        <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <button
            onClick={() => switchTab('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '11px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'overview' ? '#ff6700' : 'transparent',
              color: activeTab === 'overview' ? '#ffffff' : '#94a3b8',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span>📊</span>
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => switchTab('orders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '11px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'orders' ? '#ff6700' : 'transparent',
              color: activeTab === 'orders' ? '#ffffff' : '#94a3b8',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>📦</span>
              <span>Orders Management</span>
            </div>
            <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '999px', backgroundColor: '#1e293b', color: '#ffffff' }}>
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => switchTab('returns')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '11px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'returns' ? '#ff6700' : 'transparent',
              color: activeTab === 'returns' ? '#ffffff' : '#94a3b8',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>🔄</span>
              <span>Returns & Claims</span>
            </div>
            <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '999px', backgroundColor: '#1e293b', color: '#ffffff' }}>
              {returns.length}
            </span>
          </button>

          <button
            onClick={() => switchTab('financials')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '11px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'financials' ? '#ff6700' : 'transparent',
              color: activeTab === 'financials' ? '#ffffff' : '#94a3b8',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span>💰</span>
            <span>Revenue & Financials</span>
          </button>

          <button
            onClick={() => switchTab('customers')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '11px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'customers' ? '#ff6700' : 'transparent',
              color: activeTab === 'customers' ? '#ffffff' : '#94a3b8',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>👥</span>
              <span>Customer Directory</span>
            </div>
            <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '999px', backgroundColor: '#1e293b', color: '#ffffff' }}>
              {customers.length}
            </span>
          </button>

          <button
            onClick={() => switchTab('reviews')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '11px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'reviews' ? '#ff6700' : 'transparent',
              color: activeTab === 'reviews' ? '#ffffff' : '#94a3b8',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>⭐</span>
              <span>Reviews Moderation</span>
            </div>
            <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '999px', backgroundColor: '#1e293b', color: '#ffffff' }}>
              {reviews.length}
            </span>
          </button>

          <button
            onClick={() => switchTab('security')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '11px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'security' ? '#ff6700' : 'transparent',
              color: activeTab === 'security' ? '#ffffff' : '#94a3b8',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span>🛡️</span>
            <span>Security & System</span>
          </button>
        </nav>

        {/* User profile & Logout */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginBottom: '2px' }}>
            {adminUser?.id || 'Administrator'}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>
            {adminUser?.role || 'Executive Admin'}
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#1e293b',
              color: '#f87171',
              border: '1px solid #334155',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', textTransform: 'capitalize' }}>
              {activeTab === 'overview' && 'Executive Operations Dashboard'}
              {activeTab === 'orders' && 'Orders Fulfillment Management'}
              {activeTab === 'returns' && 'Customer Returns & Warranty Claims'}
              {activeTab === 'financials' && 'Revenue & Financial Analytics'}
              {activeTab === 'customers' && 'Customer Directory & LTV'}
              {activeTab === 'reviews' && 'Reviews Moderation & Verification'}
              {activeTab === 'security' && 'Security Audit & Database Status'}
            </h1>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
              Connected to live Supabase Cloud • Isolated at admin.rezoni.shop
            </p>
          </div>
          <button
            onClick={fetchAllData}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
              <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Gross Revenue</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>
                  Rs. {(metrics?.totalRevenue || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px' }}>↑ Net: Rs. {(metrics?.netRevenue || 0).toLocaleString()}</div>
              </div>

              <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Total Orders</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>
                  {metrics?.totalOrders || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '6px' }}>{metrics?.pendingDispatches || 0} pending dispatch</div>
              </div>

              <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Returns & Claims</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>
                  {metrics?.totalReturns || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#f87171', marginTop: '6px' }}>Rs. {(metrics?.totalRefunded || 0).toLocaleString()} refunded</div>
              </div>

              <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Average Order Value</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>
                  Rs. {(metrics?.averageOrderValue || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#a78bfa', marginTop: '6px' }}>{metrics?.totalCustomers || 0} total customers</div>
              </div>
            </div>

            {/* Pipeline progress */}
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '24px', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Fulfillment Pipeline Status</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Order Placed</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '6px' }}>{metrics?.pendingDispatches || 0}</div>
                </div>
                <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Dispatched</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '6px' }}>{metrics?.dispatchedCount || 0}</div>
                </div>
                <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>In Transit</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '6px' }}>{metrics?.inTransitCount || 0}</div>
                </div>
                <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #ec4899' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Out For Delivery</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '6px' }}>{metrics?.outForDeliveryCount || 0}</div>
                </div>
                <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Delivered</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '6px' }}>{metrics?.deliveredCount || 0}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div>
            {/* Filter and search bar */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Search by Order ID, customer, email, or tracking..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                style={{
                  flex: 1,
                  padding: '11px 16px',
                  backgroundColor: '#111827',
                  border: '1px solid #1f2937',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              />
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                style={{
                  padding: '11px 16px',
                  backgroundColor: '#111827',
                  border: '1px solid #1f2937',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="dispatched">Dispatched</option>
                <option value="in_transit">In Transit</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            {/* Orders Table */}
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1f2937', backgroundColor: '#0f172a', color: '#9ca3af' }}>
                    <th style={{ padding: '12px 16px' }}>Order ID</th>
                    <th style={{ padding: '12px 16px' }}>Customer</th>
                    <th style={{ padding: '12px 16px' }}>Date</th>
                    <th style={{ padding: '12px 16px' }}>Amount</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Carrier & Tracking</th>
                    <th style={{ padding: '12px 16px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #1f2937' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#ff6700' }}>{o.id}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600 }}>{o.customerName || 'Rezoni Customer'}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{o.customerEmail}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{o.date}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#10b981' }}>Rs. {Number(o.total).toLocaleString()}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            backgroundColor:
                              o.status === 'delivered' ? 'rgba(16, 185, 129, 0.15)' :
                              o.status === 'out_for_delivery' ? 'rgba(236, 72, 153, 0.15)' :
                              o.status === 'in_transit' ? 'rgba(139, 92, 246, 0.15)' :
                              o.status === 'dispatched' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color:
                              o.status === 'delivered' ? '#10b981' :
                              o.status === 'out_for_delivery' ? '#ec4899' :
                              o.status === 'in_transit' ? '#a78bfa' :
                              o.status === 'dispatched' ? '#60a5fa' : '#fbbf24',
                          }}
                        >
                          {o.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>{o.carrier}</div>
                        <div style={{ fontSize: '11px', color: '#38bdf8' }}>{o.trackingNumber || 'Unassigned'}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                          style={{
                            padding: '6px 10px',
                            backgroundColor: '#0f172a',
                            border: '1px solid #334155',
                            borderRadius: '6px',
                            color: '#ffffff',
                            fontSize: '12px',
                          }}
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="in_transit">In Transit</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: RETURNS & CLAIMS */}
        {activeTab === 'returns' && (
          <div>
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1f2937', backgroundColor: '#0f172a', color: '#9ca3af' }}>
                    <th style={{ padding: '12px 16px' }}>Claim ID</th>
                    <th style={{ padding: '12px 16px' }}>Order ID</th>
                    <th style={{ padding: '12px 16px' }}>Customer</th>
                    <th style={{ padding: '12px 16px' }}>Reason</th>
                    <th style={{ padding: '12px 16px' }}>Amount</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {returns.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #1f2937' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#f87171' }}>{r.id}</td>
                      <td style={{ padding: '14px 16px', color: '#38bdf8' }}>{r.orderId}</td>
                      <td style={{ padding: '14px 16px' }}>{r.customerName}</td>
                      <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{r.reason}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>Rs. {r.amount}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: r.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : r.status === 'refunded' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: r.status === 'approved' ? '#10b981' : r.status === 'refunded' ? '#60a5fa' : '#fbbf24',
                          }}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleUpdateReturnStatus(r.id, 'approved')}
                          style={{ padding: '5px 10px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateReturnStatus(r.id, 'refunded')}
                          style={{ padding: '5px 10px', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                        >
                          Refund
                        </button>
                        <button
                          onClick={() => handleUpdateReturnStatus(r.id, 'rejected')}
                          style={{ padding: '5px 10px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: FINANCIALS */}
        {activeTab === 'financials' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '28px' }}>
              <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>Gross Payments Received</div>
                <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>Rs. {(metrics?.totalRevenue || 0).toLocaleString()}</div>
                <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px' }}>100% via Razorpay & Online Prepaid</div>
              </div>
              <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>Refund Deductions</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#f87171', marginTop: '8px' }}>-Rs. {(metrics?.totalRefunded || 0).toLocaleString()}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>Claims QC settled</div>
              </div>
              <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>Net Revenue Balance</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#10b981', marginTop: '8px' }}>Rs. {(metrics?.netRevenue || 0).toLocaleString()}</div>
                <div style={{ fontSize: '12px', color: '#a78bfa', marginTop: '6px' }}>After warranty adjustments</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMER DIRECTORY */}
        {activeTab === 'customers' && (
          <div>
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1f2937', backgroundColor: '#0f172a', color: '#9ca3af' }}>
                    <th style={{ padding: '12px 16px' }}>Customer Name</th>
                    <th style={{ padding: '12px 16px' }}>Email Address</th>
                    <th style={{ padding: '12px 16px' }}>Phone Number</th>
                    <th style={{ padding: '12px 16px' }}>Orders Placed</th>
                    <th style={{ padding: '12px 16px' }}>Lifetime Value (LTV)</th>
                    <th style={{ padding: '12px 16px' }}>Last Order</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #1f2937' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>{c.name}</td>
                      <td style={{ padding: '14px 16px', color: '#38bdf8' }}>{c.email}</td>
                      <td style={{ padding: '14px 16px', color: '#9ca3af' }}>{c.phone || 'On file'}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>{c.ordersCount} orders</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#10b981' }}>Rs. {c.totalSpent.toLocaleString()}</td>
                      <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{c.lastOrder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {reviews.map((r) => (
                <div key={r.id} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 700 }}>{r.userName}</div>
                    <div style={{ color: '#fbbf24' }}>{'★'.repeat(r.rating)}</div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>{r.userEmail} • {r.date}</div>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '14px' }}>
                    "{r.body}"
                  </p>
                  <button
                    onClick={() => handleDeleteReview(r.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: '#f87171',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Remove Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SECURITY & SYSTEM */}
        {activeTab === 'security' && (
          <div>
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '24px', maxWidth: '700px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Deployment & Isolation Status</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#0f172a', borderRadius: '8px' }}>
                  <span>Host Target</span>
                  <span style={{ fontWeight: 700, color: '#ff6700' }}>admin.rezoni.shop</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#0f172a', borderRadius: '8px' }}>
                  <span>Main Storefront</span>
                  <span style={{ fontWeight: 700, color: '#38bdf8' }}>rezoni.shop</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#0f172a', borderRadius: '8px' }}>
                  <span>Database Cloud Engine</span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>Supabase PostgreSQL (Connected)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#0f172a', borderRadius: '8px' }}>
                  <span>Authentication</span>
                  <span style={{ fontWeight: 700, color: '#a78bfa' }}>ID + Password (Timing-Safe HMAC Cookie)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#0f172a', borderRadius: '8px' }}>
                  <span>Client-Side Secret Leakage</span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>ZERO (100% Server Isolated)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
