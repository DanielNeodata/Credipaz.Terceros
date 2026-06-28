var _API = {
    _TS: 0,
    _ROOT: "",
    loginRequired: false,
    externalUserMode: 0,
    imageLogin: "./img/loginDefault.png",
    subsystem: "",
    configuration: null,
    authentication: null,
    urlParameters: null,
    inited: false,
    verbose: false,
    _scrollY: 0,
    log: function (key, data) {
        /* 
        Función para escribir log en consola.
        La función escribe, si el flag verbose es TRUE
        verbose se controla en el switch y se activa en los encabezados con localhost
        */
        if (!_API.verbose) { return false; }
        console.log(key);
        console.log(data);
    },
    getUrlParams: function (url) {
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
        var obj = {};
        if (queryString) {
            queryString = queryString.split('#')[0];
            var arr = queryString.split('&');
            for (var i = 0; i < arr.length; i++) {
                var a = arr[i].split('=');
                var paramName = a[0];
                var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
                if (paramName.match(/\[(\d+)?\]$/)) {
                    var key = paramName.replace(/\[(\d+)?\]/, '');
                    if (!obj[key]) obj[key] = [];
                    if (paramName.match(/\[\d+\]$/)) {
                        var index = /\[(\d+)\]/.exec(paramName)[1];
                        obj[key][index] = paramValue;
                    } else {
                        obj[key].push(paramValue);
                    }
                } else {
                    if (!obj[paramName]) {
                        obj[paramName] = paramValue;
                    } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                        obj[paramName] = [obj[paramName]];
                        obj[paramName].push(paramValue);
                    } else {
                        obj[paramName].push(paramValue);
                    }
                }
            }
        }
        return obj;
    },
    isValidDate: function (dateString) {
        var timestamp = Date.parse(dateString);
        return !isNaN(timestamp);
    },
    isValidEmail: function (email) {
        var em = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        return em.test(email);
    },
    onlyNumbers: function (_this) {
        _this.val(_this.val().replace(/[^0-9]/g, ''));
    },
    dateCompareGreaterThan: function (_dateGreater, _dateBase) {
        const date1 = new Date(_dateGreater);
        const date2 = new Date(_dateBase);
        if (date1 > date2) {
            return true;
        } else if (date1 < date2) {
            return false;
        } else {
            return true;
        }
    },
    validate: function (_selector, _seeAlert) {
        if (_seeAlert == undefined) { _seeAlert = false; }
        var _ret = true;
        $(_selector).each(function () { _ret = _API.formatValidation($(this)) && _ret; });
        if (!_ret && _seeAlert) { alert("Faltan datos."); }
        return _ret;
    },
    formatValidation: function (_obj) {
        var _ret = true;
        var _value = _obj.val();
        var property = _obj.attr('name');
        switch (_obj.prop("tagName")) {
            case "TEXTAREA":
            case "INPUT":
                var _min = _obj.attr('data-min');
                var _max = _obj.attr('data-max');
                switch (_obj.attr("type")) {
                    case "number":
                        if (_value == "") { _ret = false; }
                        if (isNaN(_value)) { _ret = false; }
                        if (_min !== undefined) {
                            if (isNaN(_min)) {
                                _min = $(_min).val();
                                if (_min != undefined) { if (isNaN(_min)) { _ret = false; } }
                            }
                            if (_ret) { _ret = (parseDouble(_value) > parseDouble(_min)); }
                        }
                        if (_ret) {
                            if (_max !== undefined) {
                                if (isNaN(_max)) {
                                    _max = $(_max).val();
                                    if (_max != undefined) { if (isNaN(_max)) { _ret = false; } }
                                }
                                if (_ret) { _ret = (parseDouble(_value) < parseDouble(_max)); }
                            }
                        }
                        break;
                    case "date":
                    case "datetime-local":
                        if (!_API.isValidDate(_value)) { _ret = false; }
                        if (_min !== undefined) {
                            if (!_API.isValidDate(_min)) {
                                _min = $(_min).val();
                                if (_min != undefined) { if (!_API.isValidDate(_min)) { _ret = false; } }
                            }
                            if (_ret) { _ret = _API.dateCompareGreaterThan(_value, _min); }
                        }
                        if (_ret) {
                            if (_max !== undefined) {
                                if (!_API.isValidDate(_max)) {
                                    _max = $(_max).val();
                                    if (_max != undefined) { if (!_API.isValidDate(_max)) { _ret = false; } }
                                }
                                if (_ret) { _ret = _API.dateCompareGreaterThan(_max, _value); }
                            }
                        }
                        break;
                    case "email":
                        if (!_API.isValidEmail(_value)) { _ret = false; }
                        break;
                    case "radio":
                        _ret = ($("input[name='" + property + "']:checked").val() != undefined);
                        if (!_ret) {
                            _obj.parent().css("border", "solid 1px red");
                        } else {
                            _obj.parent().css("border", "solid 0px transparent");
                        }
                        break;
                    case "checkbox":
                        var _checked = _obj.is(":checked");
                        if (!_checked) { _ret = false; }
                        break;
                    default:
                        if (_obj.hasClass("data-list")) {
                            if (_obj.attr("data-selected-id") == "" || _obj.attr("data-selected-id") == undefined) { _ret = false; }
                        } else {
                            if (_value == "") { _ret = false; }
                        }
                        break;
                }
                break;
            case "SELECT":
                if (_value == "0" || _value == "-1" || _value == undefined || _value == null || _value == "") { _ret = false; }
                break;
        }
        if (_ret) {
            _obj.removeClass("is-invalid").addClass("is-valid");
            $(".invalid-" + _obj.prop("name")).html("").addClass("d-none");
        } else {
            _obj.removeClass("is-valid").addClass("is-invalid");
        }
        if (!_ret) { _API.log("formatValidation, elemento en FALSE", property); }
        return _ret;
    },
    getFormValues: function (_selector, _this) {
        try {
            var _jsonSave = {};
            $(_selector).each(function () {
                var property = $(this).attr('name');
                var value = "";
                switch ($(this).attr("data-type")) {
                    case "select":
                        if ($(this).length == 0) { value = ""; } else { value = $(this).val(); }
                        if (value == null || value == "-1" || value == "0") { value = ""; }
                        break;
                    case "radio":
                        value = $("input[name='" + property + "']:checked").val();
                        if (value == undefined) { value = ""; }
                        break;
                    case "checkbox":
                        if ($(this).prop("checked")) {
                            value = $(this).val();
                            if (parseInt(value) == 0 || value == '') { value = 1; }
                        } else {
                            value = 0;
                        }
                        break;
                    default:
                        value = $(this).val();
                        break;
                }
                _jsonSave[property] = value;
            });
        } catch (rex) { };
        return _jsonSave;
    },
    getNow: function () {
        var currentDate = new Date();
        var second = currentDate.getSeconds();
        var minute = currentDate.getMinutes();
        var hour = currentDate.getHours();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        if (day < 10) { day = "0" + day; }
        if (month < 10) { month = "0" + month; }
        if (hour < 10) { hour = "0" + hour; }
        if (minute < 10) { minute = "0" + minute; }
        if (second < 10) { second = "0" + second; }
        return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
    },
    getToday: function () {
        var currentDate = new Date();
        var second = currentDate.getSeconds();
        var minute = currentDate.getMinutes();
        var hour = currentDate.getHours();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        if (day < 10) { day = "0" + day; }
        if (month < 10) { month = "0" + month; }
        if (hour < 10) { hour = "0" + hour; }
        if (minute < 10) { minute = "0" + minute; }
        if (second < 10) { second = "0" + second; }
        return (year + ":" + month + ":" + day + "-" + hour + ":" + minute + ":" + second);
    },
    isBase64: function (testString) {
        try {
            var isEncoded = (btoa(atob(testString)) == atob(btoa(testString)));
            return isEncoded;
        } catch (err) {
            return false;
        }
    },
    UUID: function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) { s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1); }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
    },
    formatChargeTotal: function (str) {
        var part = str.toString().split(".");
        return (part[0] + "." + part[1].slice(0, 2));
    },
    isset: function (_val) {
        return (typeof _val !== undefined);
    },
    hash: async function (alg, str) {
        var msgBuffer = new TextEncoder().encode(str);
        var hashBuffer = await crypto.subtle.digest(alg, msgBuffer);
        var hashArray = Array.from(new Uint8Array(hashBuffer));
        var hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
        return hashHex;
    },
    bin2hex: function (str) {
        var hex = '';
        for (var i = 0; i < str.length; i++) {
            var charCode = str.charCodeAt(i);
            hex += charCode.toString(16).padStart(2, '0');
        }
        return hex;
    },
    utf8_to_b64: function (str) { return window.btoa(unescape(encodeURIComponent(str))); },
    b64_to_utf8: function (str) {
        str = str.replace(/\s/g, '');
        return decodeURIComponent(escape(window.atob(str)));
    },
    formatMoney: function (_val, _dec = 2) {
        if (isNaN(_val)) { _val = 0; }
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: _dec, maximumFractionDigits: _dec }).format(_val);
    },

    onShowModal: function (_name, _title, _body) {
        return new Promise(
            function (resolve, reject) {
                try {
                    var _id = ("#" + _name);
                    _API._scrollY = window.scrollY;
                    _API.onDestroyModal(_id);
                    $.get(("html/modalDefault.html?" + _API._TS), function (_html) {
                        $("body").append(_html);
                        if (_title == "") {
                            $(".modal-header").remove();
                        } else {
                            $(".modal-title").html(_title);
                        }
                        $(".modal-body").html(_body);
                        $(".modal").attr("id", _name);
                        $(".modal").attr("aria-labelledby", (_name + "Label"));
                        var _options = { backdrop: 'static', keyboard: false, show: true };
                        $(_id).modal(_options);
                        resolve(null);
                    });
                } catch (err) {
                    _API.log(("onShowModal->" + _name), _API.authentication);
                    reject(err);
                }
            }
        );
    },
    onDestroyModal: function (_id) {
        $(".modal-backdrop").remove();
        $(_id).remove();
    },
    onShowLoginModal: function () {
        /* carga html a mostrar en el body de la modal */
        $.get(("html/login.html?" + _API._TS), function (_html) {
            /* muestra la modal con el body resuelto*/
            _API.onShowModal("modalLogin", "", _html).then(function (_ret) {
                /* remueve footer default de la modal, porque viene con botón de acción en el load de login.html */
                $(".wfooter").remove();
                /* asigna la imagen del header según valor de variable asignado en el switch por encabezado */
                $(".imgHeaderLogin").attr("src", _API.imageLogin);
                /* asigna identificador de subsystem en el encabezado del form de login */
                $(".subTitle").html(_API.subsystem);
            })
        });
    },

    readConfigServers: function (key, _TS) {
        /* 
        Función de lectura de la configuración general de todas las ramas
        Parámetros:
        key: valor para identificar el elemento correcto en el archivo configServers.js
        */
        return new Promise(
            function (resolve, reject) {
                fetch("./Recursos/configServers.json?" + _API._TS)
                    .then(response => {
                        if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
                        /* Almacena los parámetros de la url de acceso */
                        _API.urlParameters = _API.getUrlParams();
                        /* Setea verbose, para activar o no la escritura en la consola del navegador de los mensajes de log */
                        _API.verbose = (window.location.hostname.toLowerCase() == "localhost");
                        /* Timestamp para forzar ignorar el cache de carga de los archivos de todo el tree */
                        _API._TS = _TS;
                        return response.text();
                    })
                    .then(function (config) {
                        var data = JSON.parse(config);
                        var _item = data.find(item => item.key === key);
                        /* Asignación de valores de configuración */
                        _API.configuration = _item;
                        resolve(null);
                    })
                    .catch(function (err) {
                        _API.log("Fetch error:", err);
                        reject(err);
                    });
            });
    },
    setBranch: function (_root, _subsystem, _loginRequired, _imageLogin, _externalUserMode) {
        if (_root == null || _root == "") {
            alert("¡Debe especificar un valor válidos para el parámetro _root!");
            return false;
        }
        /* subdirectorio de la implementacion en cuestión */
        _API._ROOT = _root;
        /* Identificado de texto de subsystem para mostrar en formulario de login */
        _API.subsystem = _subsystem;
        /* flag de auth de usuario externo requiriendo login */
        _API.loginRequired = _loginRequired;
        /* imagen del encabeado de la pantalla de login */
        if (_loginRequired && _imageLogin != null && _imageLogin != "") { _API.imageLogin = (_imageLogin + "?" + _API._TS); }
        /* modo del user a autenticar 0 - LDAP / 1 - EXTERNAL */
        _API.externalUserMode = _externalUserMode;
    },
    loaderFile: function (_file) {
        return new Promise(
            function (resolve, reject) {
                try {
                    $.getScript((_API._ROOT + _file + "?" + _API._TS), function () { resolve(null); });
                } catch (err) {
                    _API.log(("loader-> " + _url), response);
                    reject(err);
                }
            }
        )
    },
    call: function (endpoint, data) {
        /* NO AUTENTICA
        Función directa para llamadas genéricas, sin autenticación previa 
        Parámetros:
        endpoint: punto de acceso a la API
        data: objeto json con los parámetros a enviar en la llamada, deben incluirse id_user, token y id_app
        */
        return new Promise(
            function (resolve, reject) {
                var _url = (_API.configuration.server + endpoint);
                $.ajax({
                    "type": "POST",
                    "dataType": "json",
                    "url": _url,
                    "data": data,
                    "success": function (response) {
                        _API.log(("call-> " + _url), response);
                        resolve(response);
                    },
                    "error": function (xhr, status, error) { reject(error); }
                });
            });
    },
    authenticate: function () {
        /*
        Función directa para llamadas de autenticación del desarrollador 
        */
        return new Promise(
            function (resolve, reject) {
                /* Se auto asignan los parámetros basados en los datos de configServers.js */
                var data = {
                    "id_app": _API.configuration.id_app,
                    "username": _API.configuration.username,
                    "password": _API.configuration.password,
                    "version": _API.configuration.version
                };
                /* Llamada a la autenticación */
                _API.call("production/authenticate", data)
                    .then(function (auth) {
                        /* Asignación de valores de autenticación */
                        _API.authentication = auth;
                        resolve(auth);
                    })
                    .catch(function (err) {
                        _API.auth = null;
                        _API.log("authenticate error", err);
                        reject(err);
                    });
            });
    },
    method: function (endpoint, data) {
        /* AUTOAUTENTICA
        Función genérica para hacer cualquier llamada a la API, 
        incluyendo la autenticación previa con los datos del desarrollador tomados de configServers.js
        Parámetros:
        endpoint: punto de acceso a la API
        data: objeto json con los parámetros a enviar en la llamada, NO deben incluirse id_user, token y id_app
        */
        return new Promise(
            function (resolve, reject) {
                /* Llamada de auto autenticación */
                _API.authenticate()
                    .then(function (auth) {
                        /* Agregado de valores de la autenticación correcta al objeto data */
                        data["id_user"] = auth.id;
                        data["token"] = auth.token_authentication;
                        data["id_app"] = _API.configuration.id_app;
                        /* Llamada directa al método de la API con los valores completos */
                        _API.call(endpoint, data)
                            .then(function (response) {
                                resolve(response);
                            })
                            .catch(function (err) {
                                _API.log("method error->" + endpoint, err);
                                reject(err);
                            });
                    }).catch(function (err) {
                        _API.log("method authenticate error->" + endpoint, err);
                    });
            });
    },
};
