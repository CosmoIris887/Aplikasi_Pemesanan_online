import React from 'react';
import { ChefHat, UtensilsCrossed, CalendarCheck } from 'lucide-react';

export default function About() {
  const highlights = [
    {
      icon: <ChefHat size={32} />,
      title: "Masakan Medan",
      desc: "Cita rasa khas Medan yang menjadi identitas utama Kedai Burju dengan olahan bumbu rempah melimpah."
    },
    {
      icon: <UtensilsCrossed size={32} />,
      title: "Pilihan Menu",
      desc: "Tersedia menu makanan per porsi maupun paket praktis untuk kebutuhan santap sendiri maupun bersama."
    },
    {
      icon: <CalendarCheck size={32} />,
      title: "Pesanan Acara",
      desc: "Menerima pesanan khusus porsi besar untuk arisan, ulang tahun, persekutuan doa, dan acara keluarga."
    }
  ];

  return (
    <section id="tentang" className="section about-section">
      <div className="container">
        <div className="about-intro">
          <span className="section-tag">TENTANG KAMI</span>
          <h2 className="section-title">Kedai Burju</h2>
          <p className="about-text">
            Kedai Burju menghadirkan berbagai pilihan masakan Medan dengan cita rasa 
            yang khas dan cocok untuk dinikmati secara pribadi maupun bersama keluarga, 
            teman, dan berbagai acara.
          </p>
        </div>

        <div className="highlights-grid">
          {highlights.map((item, idx) => (
            <div key={idx} className="highlight-card">
              <div className="highlight-icon-box">
                {item.icon}
              </div>
              <h3 className="highlight-title">{item.title}</h3>
              <p className="highlight-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
