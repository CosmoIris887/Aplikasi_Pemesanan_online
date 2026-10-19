import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Harap isi Email dan Password.');
      return;
    }

    if (isRegister && !name) {
      setError('Harap isi Nama Lengkap.');
      return;
    }

    if (!email.includes('@')) {
      setError('Format email tidak valid (harus mengandung @).');
      return;
    }

    // Simulate Auth Success
    const userData = {
      name: isRegister ? name : email.split('@')[0].toUpperCase(),
      email: email,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem('kedai_burju_user', JSON.stringify(userData));
    setSuccess(isRegister ? 'Pendaftaran berhasil! Otomatis masuk...' : 'Login berhasil!');
    
    setTimeout(() => {
      onLoginSuccess(userData);
      onClose();
    }, 600);
  };

  const handleGoogleLogin = () => {
    const googleUser = {
      name: 'Pelanggan Kedai Burju',
      email: 'pelanggan.burju@gmail.com',
      avatar: 'G',
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('kedai_burju_user', JSON.stringify(googleUser));
    onLoginSuccess(googleUser);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={22} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FDF2F0', color: 'var(--primary-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <User size={24} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
            {isRegister ? 'Buat Akun Kedai Burju' : 'Login Pelanggan'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginTop: '4px' }}>
            Diperlukan untuk pengiriman resi/struk pembayaran ke Gmail Anda.
          </p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#DCFCE7', color: '#16A34A', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> {success}
          </div>
        )}

        {/* Google Quick Sign-In */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="btn btn-secondary"
          style={{ width: '100%', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#FFF', border: '1px solid #E2E8F0' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Masuk dengan Google / Gmail
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>atau Email</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="modal-field">
              <label className="modal-label">Nama Lengkap:</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="modal-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Nama Lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="modal-field">
            <label className="modal-label">Alamat Gmail / Email:</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="modal-input"
                style={{ paddingLeft: '40px' }}
                placeholder="contoh: nama@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-field">
            <label className="modal-label">Password:</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="modal-input"
                style={{ paddingLeft: '40px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
            {isRegister ? 'DAFTAR SEKARANG' : 'MASUK KE AKUN'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem' }}>
          {isRegister ? 'Sudah punya akun? ' : 'Belum memiliki akun? '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setSuccess('');
            }}
            style={{ color: 'var(--primary-red)', fontWeight: '700', textDecoration: 'underline' }}
          >
            {isRegister ? 'Login di sini' : 'Daftar Akun Baru'}
          </button>
        </div>
      </div>
    </div>
  );
}
