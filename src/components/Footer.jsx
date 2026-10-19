import React from 'react';
import { Utensils, MessageSquare, Phone } from 'lucide-react';
import { InstagramIcon } from './Icons';

export default function Footer() {
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Footer Brand Info */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--warm-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Utensils size={22} color="#FFF" />
              </div>
              <div>
                <div className="footer-logo-title">KEDAI BURJU</div>
                <div className="footer-logo-sub">MASAKAN MEDAN</div>
              </div>
            </div>
            <p className="footer-desc">
              Menghadirkan kelezatan masakan khas Medan dengan resep autentik, 
              rempah melimpah, dan bahan-bahan segar berkualitas terbaik.
            </p>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="footer-title">Navigasi Utama</h4>
            <ul className="footer-links">
              <li><a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="footer-link">Home</a></li>
              <li><a href="#tentang" onClick={(e) => handleNavClick(e, '#tentang')} className="footer-link">Tentang Kami</a></li>
              <li><a href="#menu" onClick={(e) => handleNavClick(e, '#menu')} className="footer-link">Daftar Menu</a></li>
              <li><a href="#pesan" onClick={(e) => handleNavClick(e, '#pesan')} className="footer-link">Pesanan Acara</a></li>
              <li><a href="#kontak" onClick={(e) => handleNavClick(e, '#kontak')} className="footer-link">Hubungi Kami</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="footer-title">Hubungi & Ikuti Kami</h4>
            <p style={{ fontSize: '0.875rem', opacity: 0.85, marginBottom: '16px', lineHeight: 1.6 }}>
              WhatsApp: 0812-8109-8500 / 0821-2313-5348<br />
              Instagram: @kedai_burju
            </p>
            <div className="social-links">
              <a href="https://instagram.com/kedai_burju" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
                <InstagramIcon size={20} />
              </a>
              <a href="https://wa.me/6281281098500" target="_blank" rel="noreferrer" className="social-icon" aria-label="WhatsApp 1">
                <MessageSquare size={20} />
              </a>
              <a href="https://wa.me/6282123135348" target="_blank" rel="noreferrer" className="social-icon" aria-label="WhatsApp 2">
                <Phone size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>© 2026 Kedai Burju. All rights reserved.</div>
          <div>Masakan Medan Autentik & Lezat</div>
        </div>
      </div>
    </footer>
  );
}
