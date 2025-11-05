const axios = require('axios');

// Variabel Lingkungan (Environment Variables)
// Di Vercel, ini harus diatur sebagai Environment Variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7684766212:AAF2R1TQkrY9EDacFLYhjl7G1zU6j5MUKbs';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '6083049408';

/**
 * Mengirim pesan ke Telegram.
 * @param {string} message - Pesan yang akan dikirim.
 */
async function sendMessage(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const data = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
    };

    try {
        await axios.post(url, data);
        console.log('Pesan berhasil dikirim ke Telegram.');
    } catch (error) {
        console.error('Gagal mengirim pesan ke Telegram:', error.response ? error.response.data : error.message);
    }
}

/**
 * Mendapatkan informasi lokasi berdasarkan IP (menggunakan ip-api.com).
 * @param {string} ip - Alamat IP.
 * @returns {Promise<object>} - Objek berisi info lokasi.
 */
async function getLocationInfo(ip) {
    if (ip === '::1' || ip === '127.0.0.1') {
        return { country: 'Localhost', city: 'Localhost', region: 'Localhost', isp: 'Localhost' };
    }
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}?fields=country,city,regionName,isp`);
        const data = response.data;
        return {
            country: data.country || 'Tidak Diketahui',
            city: data.city || 'Tidak Diketahui',
            region: data.regionName || 'Tidak Diketahui',
            isp: data.isp || 'Tidak Diketahui'
        };
    } catch (error) {
        console.error('Gagal mendapatkan info lokasi:', error.message);
        return { country: 'Gagal', city: 'Gagal', region: 'Gagal', isp: 'Gagal' };
    }
}

/**
 * Mendapatkan informasi perangkat dari User-Agent (simulasi sederhana).
 * @param {string} userAgent - String User-Agent.
 * @returns {object} - Objek berisi info perangkat.
 */
function getDeviceInfo(userAgent) {
    const info = { device: 'Tidak Diketahui', os: 'Tidak Diketahui', browser: 'Tidak Diketahui' };

    // OS
    if (userAgent.match(/Windows/i)) info.os = 'Windows';
    else if (userAgent.match(/Macintosh|Mac OS X/i)) info.os = 'macOS';
    else if (userAgent.match(/Android/i)) info.os = 'Android';
    else if (userAgent.match(/iPhone|iPad|iPod/i)) info.os = 'iOS';
    else if (userAgent.match(/Linux/i)) info.os = 'Linux';

    // Browser
    if (userAgent.match(/Chrome/i) && !userAgent.match(/Edg/i)) info.browser = 'Chrome';
    else if (userAgent.match(/Firefox/i)) info.browser = 'Firefox';
    else if (userAgent.match(/Safari/i) && !userAgent.match(/Chrome/i)) info.browser = 'Safari';
    else if (userAgent.match(/Edge/i)) info.browser = 'Edge';
    else if (userAgent.match(/MSIE|Trident/i)) info.browser = 'IE';

    // Device
    if (userAgent.match(/Mobile/i) || userAgent.match(/Android/i) || userAgent.match(/iPhone/i)) info.device = 'Mobile';
    else if (userAgent.match(/Tablet/i) || userAgent.match(/iPad/i)) info.device = 'Tablet';
    else info.device = 'Desktop';

    return info;
}

module.exports = {
    sendMessage,
    getLocationInfo,
    getDeviceInfo
};
