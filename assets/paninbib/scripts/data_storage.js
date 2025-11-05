/**
 * data_storage.js
 * Menggunakan localStorage untuk menyimpan data antar halaman, menggantikan PHP Session.
 */

const STORAGE_KEY = 'panin_data';

/**
 * Menyimpan data ke localStorage.
 * @param {object} data - Objek data yang akan disimpan.
 */
function saveData(data) {
    let existingData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const newData = { ...existingData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
}

/**
 * Mengambil semua data dari localStorage.
 * @returns {object} - Objek data yang tersimpan.
 */
function loadData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

/**
 * Menghapus semua data dari localStorage.
 */
function clearData() {
    localStorage.removeItem(STORAGE_KEY);
}

// Export fungsi-fungsi ini agar bisa digunakan di file JS lain
// Karena ini akan di-load sebagai script biasa, kita tidak perlu 'module.exports'
// Cukup pastikan fungsi-fungsi ini tersedia secara global.
// Namun, untuk kejelasan, kita akan menggunakan pola IIFE (Immediately Invoked Function Expression)
// dan menyimpannya di window.
(function() {
    window.dataStorage = {
        save: saveData,
        load: load: loadData,
        clear: clearData
    };
})();
