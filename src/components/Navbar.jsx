import React, { useState, useEffect } from 'react';
import { Utensils, Menu, X, ShoppingBag, User, LogOut } from 'lucide-react';

export default function Navbar({ activeSection, user, onLogout, onOpenAuth, cartCount, onOpenCart }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Tentang Kami', href: '#tentang' },
    { label: 'Menu', href: '#menu' },
    { label: 'Pesan Sekarang', href: '#pesan' },
    { label: 'Kontak', href: '#kontak' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="brand-logo">
          <div className="brand-icon">
            <Utensils size={22} strokeWidth={2.5} />
          </div>
          <div className="brand-text">
            <span className="brand-name">KEDAI BURJU</span>
            <span className="brand-sub">MASAKAN MEDAN</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`nav-link ${activeSection === item.href.replace('#', '') ? 'active' : ''}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right Action Controls: Cart & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Cart Icon Button with Badge */}
          <button
            onClick={onOpenCart}
            style={{
              position: 'relative',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--cream)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '700',
              fontSize: '0.85rem',
              color: 'var(--text-dark)',
              cursor: 'pointer'
            }}
          >
            <ShoppingBag size={18} style={{ color: 'var(--primary-red)' }} />
            <span className="hide-mobile">Keranjang</span>
            {cartCount > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--primary-red)',
                  color: 'var(--white)',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.725rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* User Auth Section */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#FDF2F0',
                  border: '1px solid rgba(184, 50, 50, 0.2)',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: 'var(--primary-red)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary-red)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hide-mobile">{user.name.split(' ')[0]}</span>
              </button>

              {userDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    width: '220px',
                    backgroundColor: 'var(--white)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    border: '1px solid var(--border-color)',
                    padding: '12px',
                    zIndex: 1100
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Logged in as:</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-dark)', wordBreak: 'break-all', marginBottom: '12px' }}>
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdown(false);
                      onLogout();
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <LogOut size={14} /> Logout Akun
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <User size={16} /> Login Gmail
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="mobile-drawer">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="mobile-nav-link"
            >
              {item.label}
            </a>
          ))}
          {!user ? (
            <button onClick={() => { setIsMobileOpen(false); onOpenAuth(); }} className="btn btn-secondary" style={{ width: '100%' }}>
              <User size={18} /> Login / Register Gmail
            </button>
          ) : (
            <button onClick={() => { setIsMobileOpen(false); onLogout(); }} className="btn" style={{ width: '100%', backgroundColor: '#FEE2E2', color: '#DC2626' }}>
              <LogOut size={18} /> Logout ({user.email})
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
