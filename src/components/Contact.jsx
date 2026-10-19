import React from 'react';
import { Phone, MapPin, MessageSquare, QrCode } from 'lucide-react';
import { InstagramIcon } from './Icons';
import { WA_NUMBERS } from '../data/menu';

export default function Contact() {
  const openWA = (rawNumber) => {
    const text = encodeURIComponent('Halo Kedai Burju, saya ingin bertanya mengenai pemesanan makanan.');
    window.open(`https://wa.me/${rawNumber}?text=${text}`, '_blank');
  };

  const openIG = () => {
    window.open('https://instagram.com/kedai_burju', '_blank');
  };

  return (
    <section id="kontak" className="section contact-section">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <span className="section-tag">HUBUNGI KAMI</span>
          <h2 className="section-title">KEDAI BURJU</h2>
          <p className="section-subtitle">
            Punya pertanyaan atau ingin langsung memesan? Silakan hubungi kami via WhatsApp 
            atau ikuti Instagram kami untuk update menu terbaru.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Details */}
          <div className="contact-info-card">
            <div className="contact-item">
              <div className="contact-icon">
                <MapPin size={22} />
              </div>
              <div>
                <div className="contact-label">Lokasi / Brand</div>
                <div className="contact-value">Kedai Burju — Masakan Medan</div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Phone size={22} />
              </div>
              <div>
                <div className="contact-label">WhatsApp Admin 1</div>
                <div className="contact-value">0812-8109-8500</div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Phone size={22} />
              </div>
              <div>
                <div className="contact-label">WhatsApp Admin 2</div>
                <div className="contact-value">0821-2313-5348</div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <InstagramIcon size={22} />
              </div>
              <div>
                <div className="contact-label">Instagram Official</div>
                <div className="contact-value">@kedai_burju</div>
              </div>
            </div>

            <div className="contact-buttons">
              <button onClick={() => openWA('6281281098500')} className="btn btn-whatsapp">
                <MessageSquare size={18} /> WhatsApp Admin 1
              </button>
              <button onClick={() => openWA('6282123135348')} className="btn btn-whatsapp" style={{ backgroundColor: '#128C7E' }}>
                <MessageSquare size={18} /> WhatsApp Admin 2
              </button>
              <button onClick={openIG} className="btn btn-secondary">
                <InstagramIcon size={18} /> Instagram
              </button>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="qr-box">
            <div className="qr-img-placeholder">
              <svg width="130" height="130" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-red)' }}>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="5" y="5" width="3" height="3" fill="currentColor" />
                <rect x="16" y="5" width="3" height="3" fill="currentColor" />
                <rect x="5" y="16" width="3" height="3" fill="currentColor" />
                <path d="M14 14h3v3h-3z" fill="currentColor" />
                <path d="M18 18h3v3h-3z" fill="currentColor" />
                <path d="M14 20h2" />
                <path d="M20 14v2" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>Scan QR WhatsApp</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-gray)', marginBottom: '20px' }}>
              Scan QR code di atas menggunakan kamera HP Anda untuk terhubung langsung ke WhatsApp Kedai Burju.
            </p>
            <button onClick={() => openWA('6281281098500')} className="btn btn-primary" style={{ width: '100%' }}>
              <QrCode size={18} /> Chat Langsung via QR
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
