import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onProceedCheckout }) {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100vh',
          backgroundColor: 'var(--white)',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Cart Drawer Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} style={{ color: 'var(--primary-red)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Keranjang Belanja</h3>
            <span style={{ fontSize: '0.8rem', padding: '2px 10px', borderRadius: '12px', backgroundColor: 'var(--cream)', color: 'var(--primary-red)', fontWeight: '800' }}>
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)} item
            </span>
          </div>
          <button onClick={onClose} style={{ padding: '6px', borderRadius: '50%', color: 'var(--text-gray)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--cream)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ShoppingBag size={32} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>Keranjang Anda Masih Kosong</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-gray)', marginBottom: '24px' }}>
                Pilih menu lezat khas Medan Kedai Burju untuk mulai memesan.
              </p>
              <button onClick={onClose} className="btn btn-secondary">
                Lihat Daftar Menu
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.variantName || 'default'}-${index}`}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--cream)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-dark)', lineHeight: '1.3' }}>
                        {item.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(index)}
                        style={{ color: '#EF4444', padding: '2px', cursor: 'pointer' }}
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {item.variantName && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--warm-red)', fontWeight: '700', display: 'block', marginTop: '2px' }}>
                        Varian: {item.variantName}
                      </span>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--primary-red)' }}>
                        Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                      </span>

                      <div className="qty-control" style={{ gap: '8px' }}>
                        <button
                          className="qty-btn"
                          style={{ width: '28px', height: '28px', fontSize: '0.9rem' }}
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="qty-val" style={{ fontSize: '0.9rem', minWidth: '18px' }}>
                          {item.quantity}
                        </span>
                        <button
                          className="qty-btn"
                          style={{ width: '28px', height: '28px', fontSize: '0.9rem' }}
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--white)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
              <span>Subtotal Menu</span>
              <span>Rp{totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-dark)' }}>
              <span>Total Pembayaran</span>
              <span style={{ color: 'var(--primary-red)' }}>Rp{totalAmount.toLocaleString('id-ID')}</span>
            </div>

            <button onClick={onProceedCheckout} className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
              LANJUT KE PEMBAYARAN <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
