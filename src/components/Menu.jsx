import React, { useState } from 'react';
import { MENU_DATA, CATEGORIES } from '../data/menu';
import MenuCard from './MenuCard';
import { AlertTriangle, Filter } from 'lucide-react';

export default function Menu({ onSelectOrder }) {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filteredItems = MENU_DATA.filter((item) => {
    if (activeCategory === "Semua") return true;
    return item.category === activeCategory;
  });

  return (
    <section id="menu" className="section menu-section">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <span className="section-tag">LEZAT & AUTENTIK</span>
          <h2 className="section-title">DAFTAR MENU</h2>
          <p className="section-subtitle">
            Pilih hidangan khas Medan kesukaan Anda. Dibuat dengan bahan-bahan segar 
            dan bumbu rempah pilihan terbaik.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="filter-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`filter-btn ${cat.key === 'Non Halal' ? 'non-halal' : ''} ${activeCategory === cat.key ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Non Halal Caution Banner if active category is Non Halal */}
        {activeCategory === "Non Halal" && (
          <div className="non-halal-banner">
            <div className="banner-icon">
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="banner-title">KATEGORI NON HALAL</div>
              <div className="banner-text">
                Menu dalam kategori ini mengandung bahan Non Halal (Babi). Dapur dan peralatan 
                diolah secara terpisah demi kenyamanan seluruh pelanggan kami.
              </div>
            </div>
          </div>
        )}

        {/* Menu Grid */}
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} onSelectOrder={onSelectOrder} />
          ))}
        </div>
      </div>
    </section>
  );
}
