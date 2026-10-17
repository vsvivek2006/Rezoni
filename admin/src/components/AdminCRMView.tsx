'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  RotateCcw,
  DollarSign,
  Users,
  Star,
  ShieldCheck,
  RefreshCw,
  Search,
  LogOut,
  CheckCircle2,
  Truck,
  AlertTriangle,
  Trash2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Mail,
  Phone,
  Lock,
  Layers,
  X,
  Eye,
  Check,
  Save,
  FileText,
} from 'lucide-react';

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

interface NavTabItem {
  id: 'overview' | 'orders' | 'returns' | 'financials' | 'customers' | 'reviews' | 'security';
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string; style?: React.CSSProperties }>;
  badge?: number;
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
  const [customerSearch, setCustomerSearch] = useState<string>('');

  // Selected Order for Detail Drawer / Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalStatus, setModalStatus] = useState<Order['status']>('confirmed');
  const [modalCarrier, setModalCarrier] = useState<string>('BlueDart Express');
  const [modalTracking, setModalTracking] = useState<string>('');
  const [savingLogistics, setSavingLogistics] = useState<boolean>(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open order detail modal with fresh inputs
  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setModalStatus(order.status);
    setModalCarrier(order.carrier || 'BlueDart Express');
    setModalTracking(order.trackingNumber || '');
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

  // Login handler
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

  // Update order status with instant Optimistic UI update
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: Order['status'],
    carrier?: string,
    trackingNumber?: string
  ) => {
    const prevOrders = [...orders];
    const prevMetrics = metrics ? { ...metrics } : null;

    // 1. Optimistic Update in UI state
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              carrier: carrier !== undefined ? carrier : o.carrier,
              trackingNumber: trackingNumber !== undefined ? trackingNumber : o.trackingNumber,
            }
          : o
      )
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              carrier: carrier !== undefined ? carrier : prev.carrier,
              trackingNumber: trackingNumber !== undefined ? trackingNumber : prev.trackingNumber,
            }
          : null
      );
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus, carrier, trackingNumber }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✓ Order ${orderId} status updated to ${newStatus.replace('_', ' ')}`);
        // Refresh metrics in background to stay 100% in sync
        fetch('/api/stats')
          .then((r) => r.json())
          .then((st) => st.success && setMetrics(st.metrics))
          .catch(() => {});
      } else {
        // Revert on failure
        setOrders(prevOrders);
        if (prevMetrics) setMetrics(prevMetrics);
        alert(data.message || 'Failed to update order status');
      }
    } catch (e: any) {
      setOrders(prevOrders);
      if (prevMetrics) setMetrics(prevMetrics);
      alert('Error updating order status: ' + e.message);
    }
  };

  // Save changes from inside Order Detail Modal
  const handleSaveModalLogistics = async () => {
    if (!selectedOrder) return;
    setSavingLogistics(true);
    try {
      await handleUpdateOrderStatus(
        selectedOrder.id,
        modalStatus,
        modalCarrier,
        modalTracking
      );
      showToast('✓ Logistics & Status synced to live database.');
    } finally {
      setSavingLogistics(false);
    }
  };

  // Update return status with optimistic UI update
  const handleUpdateReturnStatus = async (returnId: string, newStatus: ReturnRequest['status'], notes?: string) => {
    const prevReturns = [...returns];
    setReturns((prev) =>
      prev.map((r) => (r.id === returnId ? { ...r, status: newStatus, notes: notes || r.notes } : r))
    );

    try {
      const res = await fetch('/api/returns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnId, status: newStatus, notes }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✓ Claim ${returnId} marked as ${newStatus}`);
        fetch('/api/stats')
          .then((r) => r.json())
          .then((st) => st.success && setMetrics(st.metrics))
          .catch(() => {});
      } else {
        setReturns(prevReturns);
        alert(data.message || 'Failed to update return');
      }
    } catch (e: any) {
      setReturns(prevReturns);
      alert('Error updating return: ' + e.message);
    }
  };

  // Delete review with optimistic UI update
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this customer review?')) return;
    const prevReviews = [...reviews];
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));

    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('✓ Review removed from storefront.');
        fetch('/api/stats')
          .then((r) => r.json())
          .then((st) => st.success && setMetrics(st.metrics))
          .catch(() => {});
      } else {
        setReviews(prevReviews);
        alert(data.message || 'Failed to delete review');
      }
    } catch (e: any) {
      setReviews(prevReviews);
      alert('Error deleting review: ' + e.message);
    }
  };

  // Filtered customers with memoization
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }, [customers, customerSearch]);

  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)', color: 'var(--muted-foreground)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500 }}>
          <RefreshCw className="animate-spin" size={18} color="#ff6700" />
          <span>Verifying secure session at admin.rezoni.shop...</span>
        </div>
      </div>
    );
  }

  // ================= RENDER SHADCN LOGIN GATE =================
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--background)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          color: 'var(--foreground)',
          position: 'relative',
        }}
      >
        {/* Subtle ambient accent glow */}
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 103, 0, 0.12) 0%, transparent 70%)',
            top: '25%',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        />

        <div
          className="shadcn-card"
          style={{
            width: '100%',
            maxWidth: '420px',
            padding: '36px 30px',
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Logo & Subdomain branding */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <img
              src="https://www.rezoni.com/cdn/shop/files/final_Horizontal_logo_copy-01_200x.png?v=1647520936"
              alt="Rezoni"
              style={{ height: '26px', margin: '0 auto 14px', display: 'block' }}
            />
            <div className="shadcn-badge shadcn-badge-warning" style={{ fontSize: '10.5px', marginBottom: '8px' }}>
              admin.rezoni.shop
            </div>
            <h1 style={{ fontSize: '19px', fontWeight: 700, margin: '6px 0 4px', color: '#ffffff' }}>
              Operations & CRM
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
              Sign in with your Administrator credentials
            </p>
          </div>

          {authError && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertTriangle size={16} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--muted-foreground)',
                  marginBottom: '6px',
                }}
              >
                Admin ID / Email
              </label>
              <input
                type="text"
                className="shadcn-input"
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
                placeholder="admin@rezoni.shop"
                required
                autoFocus
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--muted-foreground)',
                  marginBottom: '6px',
                }}
              >
                Password
              </label>
              <input
                type="password"
                className="shadcn-input"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="shadcn-btn shadcn-btn-accent"
              style={{ marginTop: '6px', padding: '11px', width: '100%', fontSize: '13.5px' }}
            >
              {authLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Sign In to CRM</span>
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '11px', color: '#71717a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Protected Subdomain • SSL Encrypted Session</span>
          </div>
        </div>
      </div>
    );
  }

  // Navigation Items
  const navTabs: NavTabItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: Package, badge: orders.length },
    { id: 'returns', label: 'Returns', icon: RotateCcw, badge: returns.length },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'customers', label: 'Customers', icon: Users, badge: customers.length },
    { id: 'reviews', label: 'Reviews', icon: Star, badge: reviews.length },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ];

  // ================= AUTHENTICATED EXECUTIVE SHADCN DASHBOARD =================
  return (
    <div className="crm-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '18px',
            right: '18px',
            zIndex: 99999,
            backgroundColor: '#10b981',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MOBILE TOPBAR (< 860px) */}
      <header className="crm-mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="https://www.rezoni.com/cdn/shop/files/final_Horizontal_logo_copy-01_200x.png?v=1647520936"
            alt="Rezoni"
            style={{ height: '20px', display: 'block' }}
          />
          <span className="shadcn-badge shadcn-badge-warning" style={{ fontSize: '9.5px', padding: '2px 7px' }}>
            admin
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={fetchAllData}
            className="shadcn-btn shadcn-btn-ghost"
            style={{ padding: '6px 8px', fontSize: '11.5px' }}
            title="Refresh Data"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleLogout}
            className="shadcn-btn shadcn-btn-destructive"
            style={{ padding: '5px 10px', fontSize: '11px' }}
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* MOBILE HORIZONTAL SCROLLABLE TABS BAR (< 860px) */}
      <nav className="crm-mobile-tabs-bar hide-scrollbar">
        {navTabs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => switchTab(item.id)}
              className="shadcn-btn"
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                borderRadius: '999px',
                backgroundColor: isActive ? '#ff6700' : '#141417',
                color: isActive ? '#ffffff' : '#a1a1aa',
                borderColor: isActive ? '#ff6700' : 'var(--border)',
                flexShrink: 0,
              }}
            >
              <Icon size={14} />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span
                  style={{
                    fontSize: '10px',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    backgroundColor: isActive ? 'rgba(0,0,0,0.25)' : '#27272a',
                    color: isActive ? '#ffffff' : '#d4d4d8',
                    marginLeft: '2px',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* DESKTOP SIDEBAR (> 860px) */}
      <aside className="crm-sidebar">
        <div style={{ padding: '20px 18px', borderBottom: '1px solid var(--border)' }}>
          <img
            src="https://www.rezoni.com/cdn/shop/files/final_Horizontal_logo_copy-01_200x.png?v=1647520936"
            alt="Rezoni"
            style={{ height: '22px', display: 'block', marginBottom: '8px' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span style={{ fontSize: '11px', color: '#ff6700', fontWeight: 700, letterSpacing: '0.04em' }}>
              admin.rezoni.shop
            </span>
          </div>
        </div>

        <nav style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
          {navTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => switchTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(255, 103, 0, 0.4)' : 'transparent',
                  backgroundColor: isActive ? 'rgba(255, 103, 0, 0.12)' : 'transparent',
                  color: isActive ? '#ff6700' : '#a1a1aa',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '1.5px 7px',
                      borderRadius: '999px',
                      backgroundColor: isActive ? '#ff6700' : '#1f1f23',
                      color: isActive ? '#ffffff' : '#a1a1aa',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User profile & Logout */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)', backgroundColor: '#09090b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#f4f4f5', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {adminUser?.id || 'Administrator'}
              </div>
              <div style={{ fontSize: '11px', color: '#71717a' }}>
                {adminUser?.role || 'Executive Admin'}
              </div>
            </div>
            <span className="shadcn-badge shadcn-badge-success" style={{ fontSize: '9px', padding: '1px 5px' }}>
              LIVE
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="shadcn-btn shadcn-btn-outline"
            style={{ width: '100%', padding: '7px 10px', fontSize: '12px', color: '#f87171' }}
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="crm-main">
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', textTransform: 'capitalize' }}>
                {activeTab === 'overview' && 'Executive Dashboard'}
                {activeTab === 'orders' && 'Orders Fulfillment & Tracking'}
                {activeTab === 'returns' && 'Returns & Warranty Claims'}
                {activeTab === 'financials' && 'Financial Analytics'}
                {activeTab === 'customers' && 'Customer Directory'}
                {activeTab === 'reviews' && 'Reviews Moderation'}
                {activeTab === 'security' && 'Security & Status'}
              </h1>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '3px' }}>
              Real-time telemetry • Direct Supabase sync at admin.rezoni.shop
            </p>
          </div>
          <button
            onClick={fetchAllData}
            disabled={loading}
            className="shadcn-btn shadcn-btn-outline"
            style={{ padding: '7px 13px', fontSize: '12.5px' }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '22px' }}>
              {/* Card 1 */}
              <div className="shadcn-card">
                <div className="shadcn-card-header" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="shadcn-card-title">Gross Revenue</span>
                  <DollarSign size={16} color="#ff6700" />
                </div>
                <div className="shadcn-card-content">
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
                    ₹{(metrics?.totalRevenue || 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={12} />
                    <span>Net: ₹{(metrics?.netRevenue || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="shadcn-card">
                <div className="shadcn-card-header" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="shadcn-card-title">Total Orders</span>
                  <Package size={16} color="#38bdf8" />
                </div>
                <div className="shadcn-card-content">
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
                    {metrics?.totalOrders || 0}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#fbbf24', marginTop: '4px' }}>
                    {metrics?.pendingDispatches || 0} pending dispatch
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="shadcn-card">
                <div className="shadcn-card-header" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="shadcn-card-title">Returns & Claims</span>
                  <RotateCcw size={16} color="#f87171" />
                </div>
                <div className="shadcn-card-content">
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
                    {metrics?.totalReturns || 0}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#f87171', marginTop: '4px' }}>
                    ₹{(metrics?.totalRefunded || 0).toLocaleString()} refunded
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="shadcn-card">
                <div className="shadcn-card-header" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="shadcn-card-title">Avg Order Value</span>
                  <ArrowUpRight size={16} color="#c084fc" />
                </div>
                <div className="shadcn-card-content">
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
                    ₹{(metrics?.averageOrderValue || 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#a1a1aa', marginTop: '4px' }}>
                    {metrics?.totalCustomers || 0} total customers
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline progress */}
            <div className="shadcn-card" style={{ marginBottom: '22px' }}>
              <div className="shadcn-card-header">
                <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#fafafa' }}>
                  Fulfillment Pipeline Status
                </h2>
              </div>
              <div className="shadcn-card-content">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                  <div style={{ backgroundColor: '#0d0d10', padding: '12px 14px', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                    <div style={{ fontSize: '10.5px', color: '#a1a1aa', textTransform: 'uppercase', fontWeight: 600 }}>Confirmed</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>{metrics?.pendingDispatches || 0}</div>
                  </div>
                  <div style={{ backgroundColor: '#0d0d10', padding: '12px 14px', borderRadius: '8px', borderLeft: '3px solid #38bdf8' }}>
                    <div style={{ fontSize: '10.5px', color: '#a1a1aa', textTransform: 'uppercase', fontWeight: 600 }}>Dispatched</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>{metrics?.dispatchedCount || 0}</div>
                  </div>
                  <div style={{ backgroundColor: '#0d0d10', padding: '12px 14px', borderRadius: '8px', borderLeft: '3px solid #c084fc' }}>
                    <div style={{ fontSize: '10.5px', color: '#a1a1aa', textTransform: 'uppercase', fontWeight: 600 }}>In Transit</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>{metrics?.inTransitCount || 0}</div>
                  </div>
                  <div style={{ backgroundColor: '#0d0d10', padding: '12px 14px', borderRadius: '8px', borderLeft: '3px solid #f472b6' }}>
                    <div style={{ fontSize: '10.5px', color: '#a1a1aa', textTransform: 'uppercase', fontWeight: 600 }}>Out for Delivery</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>{metrics?.outForDeliveryCount || 0}</div>
                  </div>
                  <div style={{ backgroundColor: '#0d0d10', padding: '12px 14px', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                    <div style={{ fontSize: '10.5px', color: '#a1a1aa', textTransform: 'uppercase', fontWeight: 600 }}>Delivered</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>{metrics?.deliveredCount || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Snapshot in Overview */}
            <div className="shadcn-card">
              <div className="shadcn-card-header" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#fafafa' }}>
                  Recent Orders Snapshot
                </h2>
                <button
                  onClick={() => switchTab('orders')}
                  className="shadcn-btn shadcn-btn-ghost"
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                >
                  View all orders →
                </button>
              </div>
              <div className="shadcn-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table className="shadcn-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id}>
                        <td style={{ fontWeight: 700, color: '#ff6700' }}>{o.id}</td>
                        <td>{o.customerName || o.customerEmail}</td>
                        <td style={{ color: '#a1a1aa' }}>{o.date}</td>
                        <td style={{ fontWeight: 600, color: '#10b981' }}>₹{Number(o.total).toLocaleString()}</td>
                        <td>
                          <span
                            className={`shadcn-badge ${
                              o.status === 'delivered' ? 'shadcn-badge-success' :
                              o.status === 'out_for_delivery' ? 'shadcn-badge-pink' :
                              o.status === 'in_transit' ? 'shadcn-badge-purple' :
                              o.status === 'dispatched' ? 'shadcn-badge-info' : 'shadcn-badge-warning'
                            }`}
                          >
                            {o.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: '#71717a', padding: '24px' }}>
                          No orders recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div>
            {/* Filter and search bar */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                <input
                  type="text"
                  placeholder="Search by Order ID, customer, email, or tracking..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="shadcn-input"
                  style={{ paddingLeft: '34px' }}
                />
              </div>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="shadcn-input"
                style={{ width: 'auto', minWidth: '150px' }}
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
            <div className="shadcn-table-wrapper">
              <table className="shadcn-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Carrier / Tracking</th>
                    <th>Change Status (Live)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    const safeStatus: Order['status'] = ['confirmed', 'dispatched', 'in_transit', 'out_for_delivery', 'delivered'].includes(o.status)
                      ? o.status
                      : 'confirmed';

                    return (
                      <tr key={o.id}>
                        <td style={{ fontWeight: 700, color: '#ff6700' }}>{o.id}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{o.customerName || 'Rezoni Customer'}</div>
                          <div style={{ fontSize: '11px', color: '#71717a' }}>{o.customerEmail}</div>
                        </td>
                        <td style={{ color: '#a1a1aa' }}>{o.date}</td>
                        <td style={{ fontWeight: 700, color: '#10b981' }}>₹{Number(o.total).toLocaleString()}</td>
                        <td>
                          <span
                            className={`shadcn-badge ${
                              safeStatus === 'delivered' ? 'shadcn-badge-success' :
                              safeStatus === 'out_for_delivery' ? 'shadcn-badge-pink' :
                              safeStatus === 'in_transit' ? 'shadcn-badge-purple' :
                              safeStatus === 'dispatched' ? 'shadcn-badge-info' : 'shadcn-badge-warning'
                            }`}
                          >
                            {safeStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '12px', fontWeight: 600 }}>{o.carrier || 'BlueDart Express'}</div>
                          <div style={{ fontSize: '11px', color: '#38bdf8' }}>{o.trackingNumber || 'Unassigned'}</div>
                        </td>
                        <td>
                          <select
                            value={safeStatus}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any, o.carrier, o.trackingNumber)}
                            className="shadcn-input"
                            style={{ padding: '4px 8px', fontSize: '12px', width: 'auto', cursor: 'pointer' }}
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="in_transit">In Transit</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                        <td>
                          <button
                            onClick={() => openOrderModal(o)}
                            className="shadcn-btn shadcn-btn-ghost"
                            style={{ padding: '4px 8px', fontSize: '11.5px' }}
                          >
                            <Eye size={13} />
                            <span>Manage</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', color: '#71717a', padding: '32px' }}>
                        No orders match the current search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: RETURNS & CLAIMS */}
        {activeTab === 'returns' && (
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <select
                value={returnStatusFilter}
                onChange={(e) => setReturnStatusFilter(e.target.value)}
                className="shadcn-input"
                style={{ width: 'auto', minWidth: '150px' }}
              >
                <option value="all">All Returns</option>
                <option value="requested">Requested</option>
                <option value="approved">Approved</option>
                <option value="refunded">Refunded</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="shadcn-table-wrapper">
              <table className="shadcn-table">
                <thead>
                  <tr>
                    <th>Claim ID</th>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Reason</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Manage Claim</th>
                  </tr>
                </thead>
                <tbody>
                  {returns.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 700, color: '#f87171' }}>{r.id}</td>
                      <td style={{ color: '#38bdf8' }}>{r.orderId}</td>
                      <td>{r.customerName}</td>
                      <td style={{ color: '#a1a1aa' }}>{r.reason}</td>
                      <td style={{ fontWeight: 700 }}>₹{r.amount}</td>
                      <td>
                        <span
                          className={`shadcn-badge ${
                            r.status === 'approved' ? 'shadcn-badge-success' :
                            r.status === 'refunded' ? 'shadcn-badge-info' :
                            r.status === 'rejected' ? 'shadcn-badge-destructive' : 'shadcn-badge-warning'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleUpdateReturnStatus(r.id, 'approved')}
                            className="shadcn-btn shadcn-btn-secondary"
                            style={{ padding: '3px 8px', fontSize: '11px', color: '#34d399' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateReturnStatus(r.id, 'refunded')}
                            className="shadcn-btn shadcn-btn-secondary"
                            style={{ padding: '3px 8px', fontSize: '11px', color: '#38bdf8' }}
                          >
                            Refund
                          </button>
                          <button
                            onClick={() => handleUpdateReturnStatus(r.id, 'rejected')}
                            className="shadcn-btn shadcn-btn-destructive"
                            style={{ padding: '3px 8px', fontSize: '11px' }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {returns.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: '#71717a', padding: '32px' }}>
                        No warranty claims or return requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: FINANCIALS */}
        {activeTab === 'financials' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '22px' }}>
              <div className="shadcn-card">
                <div className="shadcn-card-header">
                  <span className="shadcn-card-title">Gross Payments Received</span>
                </div>
                <div className="shadcn-card-content">
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>
                    ₹{(metrics?.totalRevenue || 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px' }}>
                    100% via Razorpay & Online Prepaid
                  </div>
                </div>
              </div>

              <div className="shadcn-card">
                <div className="shadcn-card-header">
                  <span className="shadcn-card-title">Refund Deductions</span>
                </div>
                <div className="shadcn-card-content">
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#f87171' }}>
                    -₹{(metrics?.totalRefunded || 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#71717a', marginTop: '6px' }}>
                    Claims QC settled
                  </div>
                </div>
              </div>

              <div className="shadcn-card">
                <div className="shadcn-card-header">
                  <span className="shadcn-card-title">Net Revenue Balance</span>
                </div>
                <div className="shadcn-card-content">
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#10b981' }}>
                    ₹{(metrics?.netRevenue || 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#c084fc', marginTop: '6px' }}>
                    After warranty adjustments
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMER DIRECTORY */}
        {activeTab === 'customers' && (
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                <input
                  type="text"
                  placeholder="Search customer by name, email, phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="shadcn-input"
                  style={{ paddingLeft: '34px' }}
                />
              </div>
            </div>

            <div className="shadcn-table-wrapper">
              <table className="shadcn-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Orders</th>
                    <th>Lifetime Value</th>
                    <th>Last Order</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{c.name}</td>
                      <td style={{ color: '#38bdf8' }}>{c.email}</td>
                      <td style={{ color: '#a1a1aa' }}>{c.phone || 'On file'}</td>
                      <td style={{ fontWeight: 700 }}>{c.ordersCount} orders</td>
                      <td style={{ fontWeight: 700, color: '#10b981' }}>₹{c.totalSpent.toLocaleString()}</td>
                      <td style={{ color: '#a1a1aa' }}>{c.lastOrder}</td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#71717a', padding: '32px' }}>
                        No customers match search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
              {reviews.map((r) => (
                <div key={r.id} className="shadcn-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{r.userName}</div>
                    <div style={{ color: '#fbbf24', fontSize: '13px' }}>{'★'.repeat(r.rating)}</div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '10px' }}>
                    {r.userEmail} • {r.date}
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#d4d4d8', lineHeight: '1.5', marginBottom: '14px' }}>
                    "{r.body}"
                  </p>
                  <button
                    onClick={() => handleDeleteReview(r.id)}
                    className="shadcn-btn shadcn-btn-destructive"
                    style={{ padding: '5px 10px', fontSize: '11.5px' }}
                  >
                    <Trash2 size={13} />
                    <span>Remove Review</span>
                  </button>
                </div>
              ))}
              {reviews.length === 0 && (
                <div style={{ color: '#71717a', padding: '32px', textAlign: 'center', gridColumn: '1 / -1' }}>
                  No customer reviews awaiting moderation.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: SECURITY & SYSTEM */}
        {activeTab === 'security' && (
          <div>
            <div className="shadcn-card" style={{ maxWidth: '640px' }}>
              <div className="shadcn-card-header">
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#fafafa' }}>
                  Deployment & Infrastructure Isolation
                </h2>
              </div>
              <div className="shadcn-card-content" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#0d0d10', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '12.5px', color: '#a1a1aa' }}>Host Target</span>
                  <span style={{ fontWeight: 700, color: '#ff6700', fontSize: '12.5px' }}>admin.rezoni.shop</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#0d0d10', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '12.5px', color: '#a1a1aa' }}>Main Storefront</span>
                  <span style={{ fontWeight: 700, color: '#38bdf8', fontSize: '12.5px' }}>rezoni.shop</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#0d0d10', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '12.5px', color: '#a1a1aa' }}>Database Engine</span>
                  <span className="shadcn-badge shadcn-badge-success" style={{ fontSize: '11px' }}>
                    Supabase PostgreSQL (Connected)
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#0d0d10', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '12.5px', color: '#a1a1aa' }}>Authentication Protocol</span>
                  <span className="shadcn-badge shadcn-badge-purple" style={{ fontSize: '11px' }}>
                    HMAC Timing-Safe Cookie
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#0d0d10', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '12.5px', color: '#a1a1aa' }}>Client Secret Exposure</span>
                  <span className="shadcn-badge shadcn-badge-success" style={{ fontSize: '11px' }}>
                    0% (Fully Server Isolated)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ORDER DETAIL & LOGISTICS MANAGEMENT MODAL */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="shadcn-card"
            style={{
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#121215',
              border: '1px solid var(--border)',
              padding: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted-foreground)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Order Details & Fulfillment Control
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#ff6700' }}>
                  {selectedOrder.id}
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="shadcn-btn shadcn-btn-ghost"
                style={{ padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* LIVE STATUS & LOGISTICS EDIT FORM */}
            <div
              style={{
                backgroundColor: '#0d0d10',
                border: '1px solid #27272a',
                borderRadius: '8px',
                padding: '14px',
                marginBottom: '16px',
              }}
            >
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fafafa', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={14} color="#ff6700" />
                <span>Live Supabase Order Status & Logistics Editor</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', marginBottom: '4px' }}>
                    Current Order Status
                  </label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value as any)}
                    className="shadcn-input"
                    style={{ fontSize: '12px', padding: '6px 8px' }}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="in_transit">In Transit</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', marginBottom: '4px' }}>
                    Logistics Carrier
                  </label>
                  <input
                    type="text"
                    value={modalCarrier}
                    onChange={(e) => setModalCarrier(e.target.value)}
                    placeholder="e.g. BlueDart Express"
                    className="shadcn-input"
                    style={{ fontSize: '12px', padding: '6px 8px' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', marginBottom: '4px' }}>
                    AWB / Tracking Number (Used for /track-order)
                  </label>
                  <input
                    type="text"
                    value={modalTracking}
                    onChange={(e) => setModalTracking(e.target.value)}
                    placeholder="e.g. BD-29502555 or DELHIVERY-782109"
                    className="shadcn-input"
                    style={{ fontSize: '12px', padding: '6px 8px' }}
                  />
                </div>
              </div>

              <button
                onClick={handleSaveModalLogistics}
                disabled={savingLogistics}
                className="shadcn-btn shadcn-btn-accent"
                style={{ width: '100%', padding: '8px', fontSize: '12.5px' }}
              >
                {savingLogistics ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Syncing with Supabase...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Logistics & Status to Database</span>
                  </>
                )}
              </button>
            </div>

            {/* Customer Details */}
            <div style={{ backgroundColor: '#0d0d10', borderRadius: '8px', padding: '14px', marginBottom: '16px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                {selectedOrder.customerName || 'Customer'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#a1a1aa' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={13} color="#38bdf8" />
                  <span>{selectedOrder.customerEmail}</span>
                </div>
                {selectedOrder.customerPhone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={13} color="#34d399" />
                    <span>{selectedOrder.customerPhone}</span>
                  </div>
                )}
                {selectedOrder.shippingAddress && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '2px' }}>
                    <MapPin size={13} color="#f472b6" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>
                      {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: '8px', textTransform: 'uppercase' }}>
                Purchased Items ({selectedOrder.items?.length || 0})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(selectedOrder.items || []).map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: '#0d0d10',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#71717a' }}>
                        {item.model} {item.variant ? `• ${item.variant}` : ''} • Qty: {item.quantity}
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Total Amount Paid</span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#10b981' }}>
                ₹{Number(selectedOrder.total).toLocaleString()}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedOrder(null)}
                className="shadcn-btn shadcn-btn-secondary"
                style={{ fontSize: '12.5px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
