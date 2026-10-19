import React from 'react';
import { ShoppingBag, BookOpen, Flame, Award, Clock } from 'lucide-react';

export default function Hero() {
  const handleScrollToMenu = (e) => {
    e.preventDefault();
    const menuEl = document.querySelector('#menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderWA = (e) => {
    e.preventDefault();
    const waUrl = `https://wa.me/6281281098500?text=${encodeURIComponent('Halo Kedai Burju, saya ingin bertanya tentang menu dan pemesanan masakan Medan.')}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section id="home" className="hero">
      <div className="hero-deco-1"></div>
      <div className="container hero-grid">
        {/* Left Column Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <Flame size={15} />
            <span>MASAKAN MEDAN • FRESHLY PREPARED</span>
          </div>

          <h1 className="hero-title">
            CITA RASA MEDAN <br />
            <span>DI SETIAP HIDANGAN</span>
          </h1>

          <p className="hero-desc">
            Nikmati berbagai pilihan masakan khas Medan dengan cita rasa yang autentik 
            dan cocok untuk dinikmati bersama keluarga maupun acara bersama.
          </p>

          <div className="hero-cta">
            <button onClick={handleOrderWA} className="btn btn-primary">
              <ShoppingBag size={18} /> PESAN SEKARANG
            </button>
            <button onClick={handleScrollToMenu} className="btn btn-secondary">
              <BookOpen size={18} /> LIHAT MENU
            </button>
          </div>

          <div style={{ display: 'flex', gap: '28px', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary-red)' }}>100%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-gray)' }}>Rempah Autentik</div>
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary-red)' }}>Kamis & Jumat</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-gray)' }}>Jadwal Pengantaran PO</div>
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary-red)' }}>Menerima</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-gray)' }}>Pesanan Acara</div>
            </div>
          </div>
        </div>

        {/* Right Column Image */}
        <div className="hero-image-wrapper">
          <div className="hero-image-frame">
            <img
              src="/images/hero.jpg"
              alt="Masakan Medan Autentik Kedai Burju"
              className="hero-img"
            />
          </div>

          {/* Floating Trust Badge */}
          <div className="hero-floating-badge">
            <div className="badge-icon">
              <Award size={22} />
            </div>
            <div>
              <div className="badge-text-title">Resep Warisan Medan</div>
              <div className="badge-text-sub">Bumbu Lengkap & Fresh Setiap Hari</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
