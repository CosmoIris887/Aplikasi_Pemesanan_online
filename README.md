# Kedai Burju - Website Masakan Medan & Sistem Pemesanan Online

Website landing page modern, sistem keranjang belanja, checkout, pembayaran QRIS (Doku Ready), penyimpanan database pesanan, generate struk JPG, dan pengiriman email transaksi otomatis via Nodemailer Gmail SMTP untuk **Kedai Burju** (Masakan Medan).

---

## 🚀 Cara Menjalankan Website dari Awal (Reset Laptop / Device Baru)

Panduan lengkap ini menjelaskan langkah demi langkah untuk menjalankan aplikasi dari awal pada laptop/perangkat baru atau yang baru di-reset.

### 📋 Prasyarat Sistem
Sebelum memulai, pastikan perangkat Anda sudah terinstall:
1. **Node.js** (Versi 18.0.0 atau lebih baru) & **npm**.
   - Cek versi dengan perintah: `node -v` dan `npm -v`
   - Unduh jika belum ada: [https://nodejs.org/](https://nodejs.org/)
2. **Git** (Opsional untuk kloning repository).

---

### 📦 Langkah 1: Install Dependensi Project
Buka **Terminal / Command Prompt / PowerShell**, masuk ke direktori folder project ini, lalu jalankan perintah:

```bash
npm install
```

Perintah di atas akan menginstall seluruh paket dependensi frontend & backend yang dibutuhkan (`react`, `vite`, `express`, `nodemailer`, `html2canvas`, `cors`, `dotenv`, dll.).

---

### 🔑 Langkah 2: Konfigurasi File Environment (`.env`)
Buat file bernama `.env` pada **root folder project** (sejajar dengan `package.json`). Isi file `.env` dengan konfigurasi berikut:

```env
PORT=5000
EMAIL_USER=andreasjanuarta@gmail.com
EMAIL_PASSWORD=haxsaivjruygtici
EMAIL_FROM="Kedai Burju <andreasjanuarta@gmail.com>"
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
```

> **Catatan Keamanan:**
> - `EMAIL_PASSWORD` berisi 16 karakter **Google App Password** (tanpa spasi).
> - File `.env` sudah terdaftar di `.gitignore` sehingga aman dari upload ke repository publik.

---

### 🏃 Langkah 3: Menjalankan Backend Server & Frontend Dev Server

Untuk menjalankan aplikasi penuh (backend + frontend), Anda perlu menjalankan 2 layanan berikut:

#### 1. Jalankan Backend Node.js Express Server
Buka terminal pertama pada folder project, lalu jalankan:

```bash
node server.js
```
*Backend server akan berjalan pada: **`http://localhost:5000`***
*Log terminal akan mengonfirmasi verifikasi SMTP Gmail:*
`✅ [SMTP VERIFIED] Ready to send emails from: andreasjanuarta@gmail.com via smtp.gmail.com:465`

#### 2. Jalankan Frontend Vite Dev Server
Buka terminal kedua (atau tab baru) pada folder project, lalu jalankan:

```bash
npm run dev
```
*Frontend akan berjalan pada: **`http://localhost:5173/`** atau **`http://127.0.0.1:5174/`***

---

### 🌐 Langkah 4: Membuka Aplikasi di Browser
Buka browser favorit Anda (Chrome, Edge, Safari, Firefox), lalu buka alamat:
👉 **`http://localhost:5173`** atau **`http://127.0.0.1:5174`**

---

### 🏗️ Langkah 5: Build untuk Produksi (Opsional)
Jika ingin membuat bundel aplikasi siap rilis untuk server produksi:

```bash
npm run build
```
Hasil kompilasi produksi akan tersimpan di folder `dist/`.

---

## 🛠️ Ringkasan Fitur Utama
1. **Pilihan Metode Pengiriman Dinamis**:
   - **Diantar ke Rumah**: Field Alamat Pengantaran wajib diisi dan ditampilkan di struk.
   - **Ambil Sendiri di Kedai**: Field Alamat Pengantaran otomatis disembunyikan dari form dan tidak ditampilkan di struk.
2. **Kalkulasi Harga Aman Backend**: Mencegah manipulasi harga dari frontend.
3. **Format Nomor Pesanan Unik**: `KB-YYYYMMDD-XXXX` (misal: `KB-20261008-0001`).
4. **Download Struk JPG**: Menghasilkan gambar nota asli (`html2canvas`) dengan nama berkas `Struk-Kedai-Burju-KB-20261008-0001.jpg`.
5. **Transactional Email Deliverability**: Mengirimkan email struk langsung ke inbox Gmail pelanggan via Nodemailer SMTP.
