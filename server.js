import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Authoritative Menu Database (Server-side price verification)
const SERVER_MENU_DB = {
  "mie-gomak": { name: "Spaghetti Medan (Mie Gomak)", price: 30000 },
  "bakso-sapi": { name: "Bakso Sapi Kuah", price: 35000 },
  "ikan-arsik": {
    name: "Ikan Mas Arsik",
    variants: {
      "Per Potong": 25000,
      "Per Box isi 4": 80000
    },
    price: 25000
  },
  "rendang-sapi": {
    name: "Rendang Sapi",
    variants: {
      "Per Potong": 20000,
      "Per Box isi 5": 95000,
      "Per Box isi 10": 190000
    },
    price: 20000
  },
  "teri-medan": { name: "Teri Medan Kacang Sambal Balado", price: 50000 },
  "cumi-asin": { name: "Cumi Asin Sambal Balado", price: 45000 },
  "paket-rendang": { name: "Paket Nasi Rendang", price: 35000 },
  "paket-arsik": { name: "Paket Nasi Ikan Mas Arsik", price: 30000 },
  "babi-panggang": { name: "Babi Panggang", price: 70000 },
  "babi-saksang": { name: "Babi Saksang", price: 60000 },
  "paket-babi-panggang": { name: "Paket Nasi Babi Panggang", price: 40000 },
  "paket-babi-saksang": { name: "Paket Nasi Babi Saksang", price: 35000 }
};

// Simple Persistent File Database Setup
const DB_FILE = path.join(__dirname, 'db_orders.json');

function readDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({ orders: [], lastCounter: 0 }, null, 2));
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file:', err);
    return { orders: [], lastCounter: 0 };
  }
}

function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

// Generate Unique Order Number: KB-YYYYMMDD-XXXX (e.g. KB-20261008-0001)
function generateOrderNumber() {
  const db = readDatabase();
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  db.lastCounter += 1;
  const counterStr = String(db.lastCounter).padStart(4, '0');
  const orderId = `KB-${dateStr}-${counterStr}`;

  writeDatabase(db);
  return orderId;
}

// Nodemailer Transporter Setup
const emailUser = process.env.EMAIL_USER || 'andreasjanuarta@gmail.com';
const rawPassword = process.env.EMAIL_PASSWORD || '';
const emailPassword = rawPassword.replace(/\s+/g, ''); // Remove any spaces in Gmail App Password
const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
const emailPort = parseInt(process.env.EMAIL_PORT) || 465;
const emailSecure = process.env.EMAIL_SECURE !== 'false';
const emailFrom = process.env.EMAIL_FROM || `"Kedai Burju" <${emailUser}>`;

const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: emailSecure,
  auth: {
    user: emailUser,
    pass: emailPassword
  }
});

// Verify SMTP Connection on Startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ [SMTP VERIFICATION ERROR] Failed to connect to Gmail SMTP:');
    console.error(error);
  } else {
    console.log(`✅ [SMTP VERIFIED] Ready to send emails from: ${emailUser} via ${emailHost}:${emailPort}`);
  }
});

// API Route: Create New Order
app.post('/api/orders', (req, res) => {
  try {
    const { name, email, phone, address, notes, deliveryMethod, items } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Alamat email pelanggan tidak valid.' });
    }
    const isHomeDelivery = (deliveryMethod || 'Diantar ke Rumah') === 'Diantar ke Rumah';
    if (!name || !phone || (isHomeDelivery && (!address || !address.trim())) || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Harap lengkapi semua data pesanan & item makanan.' });
    }

    // Recalculate total securely on backend
    let calculatedTotal = 0;
    const verifiedItems = items.map((item) => {
      const dbItem = SERVER_MENU_DB[item.id];
      let unitPrice = dbItem ? dbItem.price : item.price;

      if (dbItem && dbItem.variants && item.variantName && dbItem.variants[item.variantName]) {
        unitPrice = dbItem.variants[item.variantName];
      }

      const qty = Math.max(1, parseInt(item.quantity) || 1);
      const subtotal = unitPrice * qty;
      calculatedTotal += subtotal;

      return {
        id: item.id,
        name: dbItem ? dbItem.name : item.name,
        variantName: item.variantName || null,
        price: unitPrice,
        quantity: qty,
        subtotal: subtotal
      };
    });

    const orderId = generateOrderNumber();
    const orderDate = new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newOrder = {
      orderId,
      orderDate,
      name,
      email,
      phone,
      address: isHomeDelivery ? address : null,
      notes: notes || '-',
      deliveryMethod: deliveryMethod || 'Diantar ke Rumah',
      items: verifiedItems,
      totalAmount: calculatedTotal,
      status: 'LUNAS (QRIS DOKU)',
      createdAt: new Date().toISOString()
    };

    const db = readDatabase();
    db.orders.push(newOrder);
    writeDatabase(db);

    console.log(`[DATABASE] Order saved successfully: #${orderId} for ${name} (${email})`);

    return res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat & disimpan ke database.',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ success: false, message: 'Gagal memproses pesanan di server.' });
  }
});

// API Route: Send Transactional Receipt Email (Inbox Deliverability Optimized)
app.post('/api/orders/:orderId/email-receipt', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { imageBase64 } = req.body;

    const db = readDatabase();
    const order = db.orders.find(o => o.orderId === orderId);

    if (!order) {
      console.error(`[SMTP ERROR] Order not found: ${orderId}`);
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan di database.' });
    }

    console.log(`[SMTP DISPATCH] Sending transactional email receipt to ${order.email} for order #${order.orderId}...`);

    const formattedTotal = `Rp${order.totalAmount.toLocaleString('id-ID')}`;

    // Clean Plain Text Version (Essential for spam filter score optimization)
    const textBody = `Halo ${order.name},

Terima kasih telah melakukan pemesanan di Kedai Burju. Pesanan Anda dengan nomor #${order.orderId} telah berhasil dibuat dengan total pembayaran ${formattedTotal}.

RINCIAN PESANAN:
- Nomor Pesanan : #${order.orderId}
- Tanggal        : ${order.orderDate}
- Status         : ${order.status}
- Nama Pelanggan : ${order.name}
- Alamat Email   : ${order.email}
- Nomor WhatsApp : ${order.phone}
- Metode Kirim   : ${order.deliveryMethod || 'Diantar ke Rumah'}
${order.deliveryMethod === 'Diantar ke Rumah' && order.address ? `- Alamat Kirim   : ${order.address}\n` : ''}
ITEM DI PESAN:
${order.items.map(i => `• ${i.name} ${i.variantName ? `(${i.variantName})` : ''} x${i.quantity} = Rp${i.subtotal.toLocaleString('id-ID')}`).join('\n')}

TOTAL PEMBAYARAN: ${formattedTotal}

Terlampir struk resmi pesanan Anda (Struk-Kedai-Burju-${order.orderId}.jpg) sebagai arsip bukti transaksi digital.

Hormat kami,
Kedai Burju - Masakan Medan Autentik
WhatsApp CS: 0812-8109-8500`;

    // Clean Transactional HTML Body (No hype keywords, no tracking pixels, high deliverability format)
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Struk Pesanan Kedai Burju #${order.orderId}</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #F4F4F5; margin: 0; padding: 20px; color: #222222;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 10px; border: 1px solid #E4E4E7; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <!-- Header -->
          <div style="background-color: #B83232; padding: 24px; text-align: center; color: #FFFFFF;">
            <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">KEDAI BURJU</h1>
            <p style="margin: 4px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.9;">Masakan Medan Autentik</p>
          </div>

          <!-- Body Content -->
          <div style="padding: 24px;">
            <p style="font-size: 15px; margin-top: 0;">Halo <strong>${order.name}</strong>,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #444444;">
              Terima kasih telah memesan di Kedai Burju. Pesanan Anda dengan nomor <strong>#${order.orderId}</strong> telah kami terima dan terbayar lunas.
            </p>

            <!-- Metadata Box -->
            <div style="background-color: #FAFAFA; border: 1px solid #E4E4E7; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px; line-height: 1.7;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #EEEEEE; padding-bottom: 6px; margin-bottom: 6px;">
                <span style="color: #666666;">Nomor Pesanan:</span>
                <strong style="color: #B83232;">#${order.orderId}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #EEEEEE; padding-bottom: 6px; margin-bottom: 6px;">
                <span style="color: #666666;">Waktu Pemesanan:</span>
                <span>${order.orderDate}</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #EEEEEE; padding-bottom: 6px; margin-bottom: 6px;">
                <span style="color: #666666;">Status:</span>
                <span style="color: #16A34A; font-weight: bold;">LUNAS (QRIS DOKU)</span>
              </div>
              <div style="display: flex; justify-content: space-between; ${order.deliveryMethod === 'Diantar ke Rumah' && order.address ? 'border-bottom: 1px solid #EEEEEE; padding-bottom: 6px; margin-bottom: 6px;' : ''}">
                <span style="color: #666666;">Metode Pengiriman:</span>
                <strong>${order.deliveryMethod || 'Diantar ke Rumah'}</strong>
              </div>
              ${order.deliveryMethod === 'Diantar ke Rumah' && order.address ? `
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #666666;">Alamat Pengantaran:</span>
                <span style="text-align: right; max-width: 250px;">${order.address}</span>
              </div>
              ` : ''}
            </div>

            <!-- Items Table -->
            <h3 style="font-size: 14px; color: #222222; margin-bottom: 12px; border-bottom: 2px solid #B83232; padding-bottom: 6px;">Rincian Pesanan</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #F4F4F5; text-align: left;">
                  <th style="padding: 8px 10px; color: #555555;">Item</th>
                  <th style="padding: 8px 10px; color: #555555; text-align: center;">Qty</th>
                  <th style="padding: 8px 10px; color: #555555; text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(i => `
                  <tr style="border-bottom: 1px solid #F4F4F5;">
                    <td style="padding: 10px;">${i.name} ${i.variantName ? `<br><small style="color: #666;">Varian: ${i.variantName}</small>` : ''}</td>
                    <td style="padding: 10px; text-align: center;">${i.quantity}</td>
                    <td style="padding: 10px; text-align: right; font-weight: bold;">Rp${i.subtotal.toLocaleString('id-ID')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <!-- Total Amount -->
            <div style="text-align: right; font-size: 16px; font-weight: bold; color: #B83232; padding: 12px 0; border-top: 2px solid #E4E4E7;">
              Total Pembayaran: ${formattedTotal}
            </div>

            <p style="font-size: 13px; color: #666666; margin-top: 20px; line-height: 1.5;">
              Struk resmi digital terlampir pada email ini dalam format gambar JPG (<strong>Struk-Kedai-Burju-${order.orderId}.jpg</strong>).
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #FAFAFA; padding: 16px; text-align: center; border-top: 1px solid #E4E4E7; font-size: 12px; color: #777777;">
            Kedai Burju — Masakan Medan Autentik<br>
            Layanan WhatsApp CS: 0812-8109-8500
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: emailFrom,
      to: order.email,
      replyTo: emailUser,
      subject: `Struk Pesanan Kedai Burju #${order.orderId}`,
      text: textBody,
      html: htmlBody,
      headers: {
        'Auto-Submitted': 'auto-generated',
        'X-Auto-Response-Suppress': 'OOF, AutoReply',
        'X-Report-Abuse-To': emailUser,
        'X-Entity-Ref-ID': order.orderId
      }
    };

    // Attach JPG receipt image if base64 provided
    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      mailOptions.attachments = [
        {
          filename: `Struk-Kedai-Burju-${order.orderId}.jpg`,
          content: imageBuffer,
          contentType: 'image/jpeg',
          disposition: 'attachment'
        }
      ];
    }

    // Send Email via Nodemailer
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [SMTP SUCCESS] Transactional email sent to ${order.email} (Message ID: ${info.messageId})`);

    return res.status(200).json({
      success: true,
      message: 'Struk berhasil dikirim ke email pelanggan.',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('❌ [SMTP DISPATCH ERROR] Failed sending receipt email:', error);
    return res.status(500).json({
      success: false,
      message: 'Struk belum dapat dikirim ke email. Silakan coba lagi.',
      errorDetails: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Kedai Burju Backend Server running on http://localhost:${PORT}`);
});
