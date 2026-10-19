import React from 'react';
import { MessageSquare, Users } from 'lucide-react';

export default function EventSection() {
  const handleEventConsultation = () => {
    const text = encodeURIComponent(
      'Halo Kedai Burju, saya mau berkonsultasi mengenai pesanan katering masakan Medan untuk acara (Arisan / Ulang Tahun / Persekutuan Doa / Acara Keluarga).'
    );
    window.open(`https://wa.me/6281281098500?text=${text}`, '_blank');
  };

  return (
    <section id="pesan" className="section event-section">
      <div className="container">
        <div className="event-box">
          <span className="event-tag">PESANAN KHUSUS & KATERING</span>
          <h2 className="event-title">PUNYA ACARA?</h2>
          <p className="event-desc">
            Kedai Burju menerima pesanan khusus untuk berbagai acara seperti arisan, 
            ulang tahun, persekutuan doa, dan acara keluarga lainnya. Sajikan hidangan 
            khas Medan autentik yang disukai seluruh tamu undangan Anda.
          </p>
          <button onClick={handleEventConsultation} className="btn btn-whatsapp" style={{ padding: '16px 36px', fontSize: '1rem' }}>
            <MessageSquare size={20} /> KONSULTASI PESANAN
          </button>
        </div>
      </div>
    </section>
  );
}
