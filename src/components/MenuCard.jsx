import React, { useState } from 'react';
import { ShoppingBag, AlertTriangle } from 'lucide-react';

export default function MenuCard({ item, onSelectOrder }) {
  const [selectedVariant, setSelectedVariant] = useState(
    item.hasVariants ? item.variants[0] : null
  );

  const handleOrderClick = () => {
    onSelectOrder({
      ...item,
      selectedVariant: selectedVariant
    });
  };

  const currentPrice = selectedVariant ? selectedVariant.price : item.price;
  const formattedPrice = `Rp${currentPrice.toLocaleString('id-ID')}`;

  return (
    <div className={`menu-card ${item.isFeatured ? 'featured' : ''} ${!item.isHalal ? 'non-halal-card' : ''}`}>
      {/* Image Wrap */}
      <div className="card-img-wrap">
        <img src={item.image} alt={item.name} className="card-img" loading="lazy" />
        
        {item.badge && (
          <span className={`card-badge ${!item.isHalal ? 'non-halal-badge' : ''}`}>
            {!item.isHalal && <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px' }} />}
            {item.badge}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="card-body">
        <h3 className="card-title">{item.name}</h3>
        <p className="card-desc">{item.description}</p>

        {/* Variant Select if applicable */}
        {item.hasVariants && (
          <div className="card-variant-select">
            <label className="variant-label">Pilih Varian / Porsi:</label>
            <select
              className="variant-dropdown"
              value={selectedVariant?.name || ''}
              onChange={(e) => {
                const found = item.variants.find(v => v.name === e.target.value);
                if (found) setSelectedVariant(found);
              }}
            >
              {item.variants.map((variant) => (
                <option key={variant.name} value={variant.name}>
                  {variant.label || `${variant.name} (Rp${variant.price.toLocaleString('id-ID')})`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Footer info & action */}
        <div className="card-footer">
          <div className="card-price">
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Harga</span>
            <span className="price-num">{item.hasVariants ? formattedPrice : item.priceLabel}</span>
          </div>

          <button onClick={handleOrderClick} className="order-btn">
            <ShoppingBag size={15} style={{ marginRight: '4px' }} /> PESAN
          </button>
        </div>
      </div>
    </div>
  );
}
