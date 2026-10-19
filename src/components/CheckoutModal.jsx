import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Mail, Phone, MapPin, QrCode, CheckCircle2, Copy, Send, Download, Clock, AlertTriangle, ArrowLeft, Loader2, RefreshCw, Image, Truck } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function CheckoutModal({ isOpen, onClose, cartItems, user, onRequireLogin, onClearCart }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1); // 1: Shipping Info, 2: QRIS Payment, 3: Success Receipt
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Diantar ke Rumah');
  const [paymentTimer, setPaymentTimer] = useState(900); // 15 mins
  const [createdOrder, setCreatedOrder] = useState(null);
  
  // Backend & Email Status States
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [emailStatus, setEmailStatus] = useState('idle'); // 'idle', 'sending', 'sent', 'error'
  const [emailMessage, setEmailMessage] = useState('');

  const currentCartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    if (user && !name) {
      setName(user.name);
    }
  }, [user]);

  // Countdown timer for QRIS
  useEffect(() => {
    let interval = null;
    if (step === 2 && paymentTimer > 0) {
      interval = setInterval(() => {
        setPaymentTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, paymentTimer]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Step 1 -> Step 2: Call Backend API to create order in database
  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    if (!user) {
      onRequireLogin();
      return;
    }
    if (!phone || !phone.trim()) {
      alert('Harap isi Nomor WhatsApp aktif.');
      return;
    }

    if (deliveryMethod === 'Diantar ke Rumah' && (!address || !address.trim())) {
      alert('Harap isi Alamat Pengantaran untuk metode Diantar ke Rumah.');
      return;
    }

    setIsCreatingOrder(true);
    try {
      // Send order request to backend API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: user.email,
          phone,
          address: deliveryMethod === 'Ambil Sendiri di Kedai' ? null : address,
          notes,
          deliveryMethod,
          items: cartItems.map(i => ({
            id: i.id,
            name: i.name,
            variantName: i.variantName || null,
            price: i.price,
            quantity: i.quantity
          }))
        })
      });

      const data = await response.json();
      if (data.success && data.order) {
        setCreatedOrder(data.order);
        setStep(2);
      } else {
        alert(data.message || 'Gagal menyimpan pesanan ke database.');
      }
    } catch (error) {
      console.error('Error connecting to server:', error);
      alert('Gagal terhubung ke server backend.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Step 2 -> Step 3: Payment Confirmed
  const handleSimulatePaymentSuccess = async () => {
    setStep(3);
    onClearCart();
    
    // Automatically trigger receipt email dispatch to backend
    if (createdOrder) {
      sendEmailReceiptToBackend(createdOrder.orderId);
    }
  };

  // Render Struk HTML to high quality JPG image base64 using html2canvas
  const generateStrukJpgBase64 = async () => {
    const strukElement = document.getElementById('printable-struk');
    if (!strukElement) return null;

    try {
      const canvas = await html2canvas(strukElement, {
        scale: 2,
        backgroundColor: '#FFFDFB',
        useCORS: true,
        logging: false
      });
      return canvas.toDataURL('image/jpeg', 0.92);
    } catch (err) {
      console.error('Failed rendering HTML to JPG canvas:', err);
      return null;
    }
  };

  // Download Struk JPG image directly to user's device
  const handleDownloadStrukJpg = async () => {
    if (!createdOrder) return;
    const jpgBase64 = await generateStrukJpgBase64();
    if (!jpgBase64) {
      alert('Gagal membuat gambar struk JPG.');
      return;
    }

    const filename = `Struk-Kedai-Burju-${createdOrder.orderId}.jpg`;
    const link = document.createElement('a');
    link.href = jpgBase64;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Send Email Request to Backend Endpoint POST /api/orders/:orderId/email-receipt
  const sendEmailReceiptToBackend = async (targetOrderId) => {
    setEmailStatus('sending');
    setEmailMessage('Sedang mengirimkan struk JPG ke email pelanggan...');

    try {
      // Generate JPG Image Base64 of the receipt
      const imageBase64 = await generateStrukJpgBase64();

      const response = await fetch(`/api/orders/${targetOrderId}/email-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setEmailStatus('sent');
        setEmailMessage('Struk berhasil dikirim ke email pelanggan.');
      } else {
        setEmailStatus('error');
        setEmailMessage(result.message || 'Struk belum dapat dikirim ke email. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error sending email via backend:', error);
      setEmailStatus('error');
      setEmailMessage('Struk belum dapat dikirim ke email. Silakan coba lagi.');
    }
  };

  const handleResendEmail = () => {
    if (createdOrder) {
      sendEmailReceiptToBackend(createdOrder.orderId);
    }
  };

  const generateWAConfirmationMsg = (order) => {
    if (!order) return '';
    let msg = `*KONFIRMASI PESANAN — KEDAI BURJU*\n\n`;
    msg += `Order ID: #${order.orderId}\n`;
    msg += `Status: *LUNAS (PAID VIA QRIS)*\n`;
    msg += `Tanggal: ${order.orderDate}\n\n`;
    msg += `*Detail Pembeli:*\n`;
    msg += `• Nama: ${order.name}\n`;
    msg += `• Email: ${order.email}\n`;
    msg += `• WhatsApp: ${order.phone}\n`;
    msg += `• Metode Pengiriman: ${order.deliveryMethod}\n`;
    if (order.deliveryMethod === 'Diantar ke Rumah' && order.address) {
      msg += `• Alamat Pengantaran: ${order.address}\n`;
    }
    if (order.notes && order.notes.trim() && order.notes !== '-') {
      msg += `• Catatan: ${order.notes.trim()}\n`;
    }
    msg += `\n*Pesanan:*\n`;
    order.items.forEach((item) => {
      msg += `- ${item.name} ${item.variantName ? `(${item.variantName})` : ''} x${item.quantity} = Rp${item.subtotal.toLocaleString('id-ID')}\n`;
    });
    msg += `\n*Total Terbayar:* Rp${order.totalAmount.toLocaleString('id-ID')}\n\n`;
    msg += `Resi/Struk digital telah dikirim ke email ${order.email}.\nMohon diproses. Terima kasih!`;
    return msg;
  };

  const handleSendWA = () => {
    if (!createdOrder) return;
    const msg = generateWAConfirmationMsg(createdOrder);
    const url = `https://wa.me/6281281098500?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: step === 3 ? '600px' : '540px' }}>
        <button className="modal-close no-print" onClick={onClose}>
          <X size={22} />
        </button>

        {/* STEP 1: Customer & Delivery Method Form */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span className="section-tag">CHECKOUT ONLINE</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Form Pemesanan & Pengantaran</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>
                Isi data pemesanan di bawah ini untuk pembuatan struk & konfirmasi pesanan.
              </p>
            </div>

            {!user ? (
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', marginBottom: '20px', textAlign: 'center' }}>
                <AlertTriangle size={24} style={{ color: '#D97706', marginBottom: '6px' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#92400E' }}>Login Gmail Diperlukan</h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-gray)', marginTop: '4px', marginBottom: '12px' }}>
                  Anda harus login terlebih dahulu agar resi/struk pembayaran dapat disimpan di database & dikirimkan ke email Anda.
                </p>
                <button onClick={onRequireLogin} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                  Login / Daftar Akun Sekarang
                </button>
              </div>
            ) : (
              <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={20} style={{ color: '#16A34A' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: '700', textTransform: 'uppercase' }}>Alamat Email Terdaftar:</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#166534' }}>{user.email} ({user.name})</div>
                </div>
              </div>
            )}

            <form onSubmit={handleProceedToPayment}>
              <div className="modal-field">
                <label className="modal-label">Nama Lengkap:</label>
                <input
                  type="text"
                  className="modal-input"
                  required
                  placeholder="Nama Lengkap Pemesan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">Nomor WhatsApp Pembeli:</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    className="modal-input"
                    style={{ paddingLeft: '40px' }}
                    required
                    placeholder="0812XXXXXXXX (untuk konfirmasi WA)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Dynamic Delivery Method Selector */}
              <div className="modal-field">
                <label className="modal-label">Metode Pengiriman / Pengambilan:</label>
                <div style={{ position: 'relative' }}>
                  <Truck size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                  <select
                    className="modal-select"
                    style={{ paddingLeft: '40px' }}
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                  >
                    <option value="Diantar ke Rumah">Diantar ke Rumah</option>
                    <option value="Ambil Sendiri di Kedai">Ambil Sendiri di Kedai</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Conditional Address Input */}
              {deliveryMethod === 'Diantar ke Rumah' && (
                <div className="modal-field">
                  <label className="modal-label">Alamat Pengantaran Lengkap:</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                    <textarea
                      className="modal-input"
                      style={{ paddingLeft: '40px', minHeight: '75px', fontFamily: 'inherit' }}
                      required={deliveryMethod === 'Diantar ke Rumah'}
                      placeholder="Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan, Kota"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="modal-field">
                <label className="modal-label">Catatan Pesanan (Opsional):</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Contoh: Titip di satpam / pedas sedang"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Summary Box */}
              <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: 'var(--cream)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-gray)', marginBottom: '4px' }}>
                  <span>Jumlah Item ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} Porsi)</span>
                  <span>Rp{currentCartTotal.toLocaleString('id-ID')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-red)' }}>
                  <span>Total yang Harus Dibayar</span>
                  <span>Rp{currentCartTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button type="submit" disabled={isCreatingOrder} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                {isCreatingOrder ? (
                  <>
                    <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite', marginRight: '6px' }} />
                    Menyimpan Pesanan ke Database...
                  </>
                ) : (
                  'KONFIRMASI PESANAN & BAYAR'
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: QRIS Payment Screen */}
        {step === 2 && createdOrder && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <button onClick={() => setStep(1)} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-gray)' }}>
                <ArrowLeft size={16} /> Kembali
              </button>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', padding: '4px 10px', borderRadius: '12px', backgroundColor: '#FDF2F0', color: 'var(--primary-red)' }}>
                QRIS Acquired by DOKU
              </div>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '4px' }}>Pembayaran via QRIS</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-gray)' }}>
              Scan QRIS menggunakan BCA Mobile, Mandiri Livin, GoPay, OVO, ShopeePay, Dana, atau Bank Lainnya.
            </p>

            {/* Timer */}
            <div style={{ margin: '16px 0', padding: '10px', borderRadius: '8px', backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#B45309', fontWeight: '700', fontSize: '0.9rem' }}>
              <Clock size={18} /> Selesaikan Pembayaran Dalam: <span style={{ fontSize: '1.1rem', color: 'var(--primary-red)' }}>{formatTimer(paymentTimer)}</span>
            </div>

            {/* QR Canvas */}
            <div style={{ width: '220px', height: '220px', margin: '0 auto 16px', padding: '16px', backgroundColor: '#FFF', borderRadius: '16px', border: '2px dashed var(--warm-red)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-dark)' }}>
                <rect x="2" y="2" width="8" height="8" rx="1" fill="#000" />
                <rect x="14" y="2" width="8" height="8" rx="1" fill="#000" />
                <rect x="2" y="14" width="8" height="8" rx="1" fill="#000" />
                <rect x="4" y="4" width="4" height="4" fill="#FFF" />
                <rect x="16" y="4" width="4" height="4" fill="#FFF" />
                <rect x="4" y="16" width="4" height="4" fill="#FFF" />
                <rect x="5" y="5" width="2" height="2" fill="#000" />
                <rect x="17" y="5" width="2" height="2" fill="#000" />
                <rect x="5" y="17" width="2" height="2" fill="#000" />
                <path d="M12 2v20M2 12h20M14 14h3v3h-3zM18 18h3v3h-3z" />
              </svg>

              <div style={{ position: 'absolute', bottom: '8px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.1em', color: 'var(--primary-red)', backgroundColor: '#FFF', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                QRIS NATIONAL • DOKU
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-gray)' }}>Total Nominal QRIS (Server Verified):</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-red)' }}>
                Rp{createdOrder.totalAmount.toLocaleString('id-ID')}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '2px' }}>
                Nomor Pesanan: {createdOrder.orderId}
              </div>
            </div>

            <button
              onClick={handleSimulatePaymentSuccess}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', backgroundColor: '#16A34A', boxShadow: '0 8px 20px rgba(22, 163, 74, 0.3)' }}
            >
              <CheckCircle2 size={18} /> KONFIRMASI PEMBAYARAN SUKSES
            </button>
          </div>
        )}

        {/* STEP 3: Official Struk & Direct Email/Download JPG */}
        {step === 3 && createdOrder && (
          <div>
            <div className="no-print" style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#14532D' }}>PESANAN BERHASIL DIBUAT!</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>
                Data tersimpan di database. Struk digital siap diunduh JPG & dikirim ke email.
              </p>
            </div>

            {/* Email Dispatch Status Banner */}
            <div className="no-print" style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: emailStatus === 'sent' ? '#F0FDF4' : (emailStatus === 'error' ? '#FEF2F2' : '#EFF6FF'), border: `1px solid ${emailStatus === 'sent' ? '#86EFAC' : (emailStatus === 'error' ? '#FCA5A5' : '#BFDBFE')}`, marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {emailStatus === 'sending' && (
                  <Loader2 size={20} className="spin" style={{ color: '#2563EB', animation: 'spin 1s linear infinite' }} />
                )}
                {emailStatus === 'sent' && (
                  <CheckCircle2 size={20} style={{ color: '#16A34A' }} />
                )}
                {emailStatus === 'error' && (
                  <AlertTriangle size={20} style={{ color: '#DC2626' }} />
                )}
                
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: emailStatus === 'sent' ? '#166534' : (emailStatus === 'error' ? '#991B1B' : '#1E40AF') }}>
                    {emailMessage}
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    Tujuan: {createdOrder.email}
                  </div>
                </div>
              </div>

              {emailStatus === 'error' && (
                <button
                  onClick={handleResendEmail}
                  style={{ padding: '6px 12px', fontSize: '0.775rem', fontWeight: '800', borderRadius: '6px', backgroundColor: '#DC2626', color: '#FFF', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RefreshCw size={12} /> Kirim Ulang
                </button>
              )}
            </div>

            {/* OFFICIAL RESTAURANT NOTA STRUK (DYNAMICALLY ADAPTS TO DELIVERY METHOD) */}
            <div
              id="printable-struk"
              style={{
                backgroundColor: '#FFFDFB',
                border: '2px dashed var(--warm-red)',
                borderRadius: '14px',
                padding: '24px',
                marginBottom: '20px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              {/* Header Brand */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-red)', letterSpacing: '-0.02em' }}>KEDAI BURJU</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--orange-accent)', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase' }}>MASAKAN MEDAN AUTENTIK</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-gray)', marginTop: '4px' }}>Jl. Masakan Medan • Telp/WA: 0812-8109-8500</div>
              </div>

              {/* Order Information */}
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', lineHeight: '1.7', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Nomor Pesanan:</span> <strong style={{ color: 'var(--primary-red)' }}>{createdOrder.orderId}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Waktu Pemesanan:</span> <span>{createdOrder.orderDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Status Pembayaran:</span> <strong style={{ color: '#16A34A' }}>{createdOrder.status}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Nama Pelanggan:</span> <strong>{createdOrder.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Email:</span> <span>{createdOrder.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Nomor WhatsApp:</span> <span>{createdOrder.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Metode Pengiriman:</span> <strong>{createdOrder.deliveryMethod}</strong>
                </div>

                {/* ONLY SHOW ADDRESS IF DELIVERED TO HOME */}
                {createdOrder.deliveryMethod === 'Diantar ke Rumah' && createdOrder.address && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Alamat Pengantaran:</span> <span style={{ textAlign: 'right', maxWidth: '220px', fontWeight: '600' }}>{createdOrder.address}</span>
                  </div>
                )}

                {createdOrder.notes && createdOrder.notes !== '-' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Catatan:</span> <span style={{ fontStyle: 'italic' }}>{createdOrder.notes}</span>
                  </div>
                )}
              </div>

              {/* Itemized Table */}
              <div style={{ borderTop: '1px dashed var(--border-color)', borderBottom: '1px dashed var(--border-color)', padding: '14px 0', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Item Makanan</span>
                  <span>Subtotal</span>
                </div>

                {createdOrder.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>
                        {item.name} {item.variantName ? `(${item.variantName})` : ''}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-gray)' }}>
                        {item.quantity} x Rp{item.price.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div style={{ fontWeight: '800', color: 'var(--text-dark)' }}>
                      Rp{item.subtotal.toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.1rem', fontWeight: '800' }}>
                <span style={{ color: 'var(--text-dark)' }}>TOTAL PEMBAYARAN</span>
                <span style={{ color: 'var(--primary-red)', fontSize: '1.25rem' }}>Rp{createdOrder.totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={handleDownloadStrukJpg} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                <Image size={18} /> DOWNLOAD STRUK JPG
              </button>

              <button onClick={() => sendEmailReceiptToBackend(createdOrder.orderId)} className="btn btn-secondary" style={{ width: '100%', backgroundColor: '#EFF6FF', color: '#1D4ED8', borderColor: '#BFDBFE' }}>
                <Mail size={18} /> KIRIM STRUK KE EMAIL
              </button>

              <button onClick={handleSendWA} className="btn btn-whatsapp" style={{ width: '100%' }}>
                <Send size={18} /> KONFIRMASI PESANAN KE WHATSAPP
              </button>

              <button onClick={onClose} className="btn" style={{ width: '100%', color: 'var(--text-gray)' }}>
                Selesai & Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
