'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, register } = useAuth();
  const [mode, setMode] = useState<'register' | 'login'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setMode(authModalMode);
    setErrorMessage(null);
    setEmail('');
    setPassword('');
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid e-mail address.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        const res = await register(email, password);
        if (res.success) {
          closeAuthModal();
        } else {
          setErrorMessage(res.message || 'Registration failed.');
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          closeAuthModal();
        } else {
          setErrorMessage(res.message || 'Invalid e-mail or password.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={closeAuthModal}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '4px',
          maxWidth: '440px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          position: 'relative',
          padding: '36px 32px 32px',
        }}
      >
        {/* Rezoni Close Button */}
        <button
          onClick={closeAuthModal}
          type="button"
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#111111',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.9">
            <line x1="1" y1="1" x2="13" y2="13" />
            <line x1="13" y1="1" x2="1" y2="13" />
          </svg>
        </button>

        {/* Header 1:1 with Rezoni */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#111111',
              margin: '0 0 8px',
              textTransform: 'none',
            }}
          >
            {mode === 'register' ? 'Register' : 'Login'}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#666666' }}>
            {mode === 'register' ? 'Please fill in the fields below:' : 'Please enter your e-mail and password:'}
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div
            style={{
              backgroundColor: '#fff5f5',
              border: '1px solid #fed7d7',
              color: '#c53030',
              padding: '10px 14px',
              borderRadius: '4px',
              fontSize: '13px',
              marginBottom: '18px',
              textAlign: 'center',
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* E-mail field */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#222222',
                marginBottom: '6px',
              }}
            >
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              style={{
                width: '100%',
                height: '46px',
                padding: '0 14px',
                border: '1px solid #dcdcdc',
                borderRadius: '3px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                color: '#111111',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#111111')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#dcdcdc')}
            />
          </div>

          {/* Password field */}
          <div style={{ marginBottom: '22px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#222222',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                width: '100%',
                height: '46px',
                padding: '0 14px',
                border: '1px solid #dcdcdc',
                borderRadius: '3px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                color: '#111111',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#111111')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#dcdcdc')}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: 'none',
              height: '48px',
              borderRadius: '3px',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#ff6700';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#000000';
            }}
          >
            {loading ? 'Please wait...' : mode === 'register' ? 'Create account' : 'Login'}
          </button>
        </form>

        {/* Secondary toggle action matching Rezoni 1:1 */}
        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: '#666666' }}>
          {mode === 'register' ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#111111',
                  textDecoration: 'underline',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 'inherit',
                }}
              >
                Login
              </button>
            </>
          ) : (
            <>
              New customer?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#111111',
                  textDecoration: 'underline',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 'inherit',
                }}
              >
                Create an account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
