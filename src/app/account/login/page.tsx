'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push('/pages/account');
      } else {
        setErrorMessage(res.message || 'Invalid e-mail or password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '60px 20px 100px', backgroundColor: '#ffffff', fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ maxWidth: '440px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111', margin: '0 0 10px' }}>Login</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#666666' }}>Please enter your e-mail and password:</p>
        </div>

        {errorMessage && (
          <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', marginBottom: '18px', textAlign: 'center' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#222222', marginBottom: '6px' }}>
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              style={{ width: '100%', height: '46px', padding: '0 14px', border: '1px solid #dcdcdc', borderRadius: '3px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#222222', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{ width: '100%', height: '46px', padding: '0 14px', border: '1px solid #dcdcdc', borderRadius: '3px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', backgroundColor: '#000000', color: '#ffffff', border: 'none', height: '48px', borderRadius: '3px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#666666' }}>
          New customer?{' '}
          <Link href="/account/register" style={{ color: '#111111', textDecoration: 'underline', fontWeight: 600 }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
