import React from 'react';
import { Calendar, PackageCheck, Percent, Clock } from 'lucide-react';

export default function OrderingInfo() {
  const rules = [
    {
      icon: <Calendar size={24} />,
      title: "Jadwal Pengantaran Pre-Order",
      desc: "Pre-order tersedia khusus untuk jadwal pengantaran setiap hari Kamis dan Jumat."
    },
    {
      icon: <PackageCheck size={24} />,
      title: "Pemesanan Skala Besar",
      desc: "Pesanan lebih dari 50 pax harap dilakukan minimal H-3 sebelum tanggal pengantaran."
    },
    {
      icon: <Percent size={24} />,
      title: "Diskon Spesial",
      desc: "Tersedia diskon khusus untuk pelajar, mahasiswa, serta pesanan untuk tempat ibadah."
    },
    {
      icon: <Clock size={24} />,
      title: "Hari Operasional",
      desc: "Kedai Burju tutup pada hari Minggu serta Hari Libur Nasional."
    }
  ];

  return (
    <section className="section ordering-info-section">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <span className="section-tag">INFORMASI PEMESANAN</span>
          <h2 className="section-title">KETENTUAN PEMESANAN</h2>
          <p className="section-subtitle">
            Harap memperhatikan ketentuan pemesanan di bawah ini demi kenyamanan dan 
            kualitas hidangan terbaik untuk Anda.
          </p>
        </div>

        <div className="info-grid">
          {rules.map((rule, idx) => (
            <div key={idx} className="info-card">
              <div className="info-icon">
                {rule.icon}
              </div>
              <div>
                <h3 className="info-content-title">{rule.title}</h3>
                <p className="info-content-text">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
