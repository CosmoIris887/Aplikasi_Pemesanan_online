import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { WA_NUMBERS } from '../data/menu';

export default function OrderModal({ item, onClose }) {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    item.selectedVariant || (item.hasVariants ? item.variants[0] : null)
  );
  const [selectedWa, setSelectedWa] = useState(WA_NUMBERS[0]);
  const [notes, setNotes] = useState("");

  const unitPrice = selectedVariant ? selectedVariant.price : item.price;
  const totalPrice = unitPrice * quantity;

  const menuTitle = selectedVariant ? `${item.name} (${selectedVariant.name})` : item.name;

  // Build the pre-filled message text
  const generateMessage = () => {
    let msg = `Halo Kedai Burju, saya ingin memesan:\n\n`;
    msg += `Menu: ${menuTitle}\n`;
    msg += `Jumlah: ${quantity}\n`;
    msg += `Harga: Rp${unitPrice.toLocaleString('id-ID')}/pcs\n`;
    if (notes.trim()) {
      msg += `Catatan: ${notes.trim()}\n`;
    }
    msg += `Total Estimasi: Rp${totalPrice.toLocaleString('id-ID')}\n\n`;
    msg += `Mohon informasi lebih lanjut. Terima kasih.`;
    return msg;
  };

  const handleSendWA = () => {
    const message = generateMessage();
    const encodedMessage = encodeURIComponent(message);
    const targetUrl = `https://wa.me/${selectedWa.raw}?text=${encodedMessage}`;
    window.open(targetUrl, '_blank');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={22} />
        </button>

        {/* Modal Header */}
        <div className="modal-header-info">
          <img src={item.image} alt={item.name} className="modal-food-img" />
          <div>
            <h3 className="modal-item-title">{item.name}</h3>
            <div className="modal-item-price">
              Rp{unitPrice.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {/* Variant selection if available */}
        {item.hasVariants && (
          <div className="modal-field">
            <label className="modal-label">Pilihan Varian / Porsi:</label>
            <select
              className="modal-select"
              value={selectedVariant?.name || ''}
              onChange={(e) => {
                const v = item.variants.find(varItem => varItem.name === e.target.value);
                if (v) setSelectedVariant(v);
              }}
            >
              {item.variants.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.label || `${v.name} — Rp${v.price.toLocaleString('id-ID')}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quantity selector */}
        <div className="modal-field">
          <label className="modal-label">Jumlah Pesanan:</label>
          <div className="qty-control">
            <button
              className="qty-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <span className="qty-val">{quantity}</span>
            <button
              className="qty-btn"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="modal-field">
          <label className="modal-label">Catatan Tambahan (Opsional):</label>
          <input
            type="text"
            className="modal-input"
            placeholder="Contoh: Kuah dipisah / pedas sedang"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* WhatsApp CS Selection */}
        <div className="modal-field">
          <label className="modal-label">Kirim Pesanan Ke WhatsApp CS:</label>
          <div className="wa-number-select">
            {WA_NUMBERS.map((wa) => (
              <button
                key={wa.raw}
                className={`wa-option-btn ${selectedWa.raw === wa.raw ? 'selected' : ''}`}
                onClick={() => setSelectedWa(wa)}
              >
                {wa.label} <br />
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{wa.display}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message Preview */}
        <div className="modal-field">
          <label className="modal-label">Preview Pesan WhatsApp:</label>
          <div className="modal-preview-box">
            {generateMessage()}
          </div>
        </div>

        {/* Action Button */}
        <button onClick={handleSendWA} className="btn btn-whatsapp" style={{ width: '100%' }}>
          <Send size={18} /> KIRIM PESANAN KE WHATSAPP
        </button>
      </div>
    </div>
  );
}
