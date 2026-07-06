var _API = {
    _TS: 0,
    _ROOT: "",
    _TIMER_LAZY: 0,
    tools:null,
    id_app_external:0,
    loginRequired: false,
    externalUserMode: 0,
    imageLogin: "./img/loginDefault.png",
    subsystem: "",
    configuration: null,
    authentication: null,
    branchConfiguration: null,
    urlParameters: null,
    inited: false,
    verbose: false,
    scrollY: 0,
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
    logStatus: function () {
        if (!_API.verbose) { return false; }
        /* Log de valores seteables en la configuración general de acceso, no visible en producción */
        if (_API.urlParameters != null && _API.urlParameters.length) { _API.log("URL parameters", _API.urlParameters); }
        if (_API.configuration != null) { _API.log("Configuration", _API.configuration); }
        if (_API.authentication != null) {_API.log("Authentication", _API.authentication);}
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
    isSet: function (_val) {
        return (typeof _val !== undefined);
    },
    uuid: function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) { s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1); }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
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
    isBase64: function (testString) {
        try {
            var isEncoded = (btoa(atob(testString)) == atob(btoa(testString)));
            return isEncoded;
        } catch (err) {
            return false;
        }
    },
    string_to_b64: function (str) { return window.btoa(unescape(encodeURIComponent(str))); },
    b64_to_string: function (str) {
        str = str.replace(/\s/g, '');
        return decodeURIComponent(escape(window.atob(str)));
    },

    onShowModal: function (_name, _title, _body) {
        return new Promise(
            function (resolve, reject) {
                try {
                    var _id = ("#" + _name);
                    _API.scrollY = window.scrollY;
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
    onShowUnauthorized: function (_message) {
        /* carga html a mostrar en el body de la modal */
        $.get(("html/unauthorized.html?" + _API._TS), function (_html) {
            /* muestra la modal con el body resuelto*/
            _API.onShowModal("modalUnauthorized", "", _html).then(function (_ret) {
                /* remueve footer default de la modal, porque viene con botón de acción en el load de unauthorized.html */
                $(".wfooter").remove();
                /* asigna la imagen del header según valor de variable asignado en el switch por encabezado */
                $(".imgHeaderLogin").attr("src", _API.imageLogin);
                /* Mensaje pasada a la interface de rechazo */
                $(".subTitle").html(_message);
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
                /* Timestamp para forzar ignorar el cache de carga de los archivos de todo el tree */
                _API._TS = _TS;
                fetch("./Recursos/configServers.json?" + _API._TS)
                    .then(function(response) {
                        if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
                        return response.text();
                    })
                    .then(function (config) {
                        var data = JSON.parse(config);
                        var _item = data.find(item => item.key === key);
                        /* Asignación de valores de configuración */
                        _API.configuration = _item;
                        /* Almacena los parámetros de la url de acceso */
                        _API.urlParameters = _API.getUrlParams();
                        /* Setea verbose, para activar o no la escritura en la consola del navegador de los mensajes de log */
                        _API.verbose = (window.location.hostname.toLowerCase() == "localhost");
                        $.getScript(("js/events.js?" + _API._TS), function () {
                            $.getScript(("js/tools.js?" + _API._TS), function () {
                                _API.tools = _T;
                            });
                        });
                        resolve(null);
                    })
                    .catch(function (err) {
                        _API.log("readConfigServers error->", err);
                        reject(err);
                    });
            });
    },
    readConfigBranches: function (key) {
        /* 
        Función de lectura de la configuración indivudual de cada una de las ramas
        Parámetros:
        key: valor para identificar el elemento correcto en el archivo configBranches.js
        */
        return new Promise(
            function (resolve, reject) {
                fetch("./Recursos/configBranches.json?" + _API._TS)
                    .then(function (response) {
                        if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
                        return response.text();
                    })
                    .then(function (config) {
                        var data = JSON.parse(config);
                        var _item = data.find(item => item.key === key);
                        resolve(_item);
                    })
                    .catch(function (err) {
                        _API.log("readConfigBranches error->", err);
                        reject(err);
                    });
            });
    },
    activateBranch: function (_branchConfig) {
        if (_branchConfig.root == null || _branchConfig.root == "") {
            alert("¡Debe especificar un valor válidos para el parámetro _root!");
            return false;
        }
        /* subdirectorio de la implementacion en cuestión */
        _API.branchConfiguration = _branchConfig;
        _API._ROOT = _branchConfig.root;
        /* Identificado de texto de subsystem para mostrar en formulario de login */
        _API.subsystem = _branchConfig.subsystem;
        /* flag de auth de usuario externo requiriendo login */
        _API.loginRequired = _branchConfig.loginRequired;
        /* imagen del encabeado de la pantalla de login */
        if (_branchConfig.imageLogin != null && _branchConfig.imageLogin != "") { _API.imageLogin = (_branchConfig.imageLogin + "?" + _API._TS); }
        /* modo del user a autenticar 0 - LDAP / 1 - EXTERNAL */
        _API.externalUserMode = _branchConfig.externalUserMode;
        /* valor del id de app a la cual el usuario externo debe tener permiso de acceso */
        _API.id_app_external = _branchConfig.id_app_external;
        /* control de acceso autenticado por parte del usuario externo */
        if (!_API.loginRequired) {
            /* acceso sin autenticación de usuario externo */
            _API.loaderFile(_API.configuration.fileLoader).then(function () { _API.logStatus(); });
        } else {
            /* acceso con autenticación de usuario externo 
               debe hacerse llamada de autenticación inicial para lueg poder utilizar la atenticación externa,
               esto no es requerido cuando no se requiere de la autenticacion externa*/
            _API.authenticate().then(function () {
                _API.onShowLoginModal();
            });
        }
    },
    loaderFile: function (_file) {
        return new Promise(
            function (resolve, reject) {
                try {
                    $.getScript((_API._ROOT + _file + "?" + _API._TS), function () {
                        resolve(null);
                    });
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
                        _API.log(("call->response-> " + _url), response);
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
    authenticateexternal: function () {
        return new Promise(
            function (resolve, reject) {
                /* llamada a la API para autenticar credenciales de usuario, segun modo configurado en el switch */
                if (!_API.tools.validate(".validateLogin", false)) { return false; }
                var data = {
                    "id_user": _API.authentication.id,
                    "token_authentication": _API.authentication.token_authentication,
                    "id_app": _API.id_app_external,
                    "username": $(".Username").val(),
                    "password": $(".Password").val(),
                    "external_operator": _API.externalUserMode
                };
                _API.call("production/authenticateexternal", data)
                    .then(function (response) {
                        if (response.status != "OK") {
                            /* si no autentica, alerta y sale del form */
                            alert(response.message);
                        } else {
                            /* si pasa la autenticación ok, destruye el modal y ejecuta el loader */
                            _API.onDestroyModal("#modalLogin");
                            _API.loaderFile(_API.configuration.fileLoader).then(function () { _API.logStatus(); });
                        }
                        _API.log("authenticateexternal", response);
                        resolve(response);
                    })
                    .catch(function (err) {
                        reject(err);
                    });
            });
    },
    verifytoken: function (params) {
        return new Promise(
            function (resolve, reject) {
                /* llamada a la API para autenticar credenciales de usuario, segun modo configurado en el switch */
                if (!_API.tools.validate(".validateLogin", false)) { return false; }
                var data = {
                    "id_user_activate": params.Id_user,
                    "token_authentication": params.Token,
                    "id_app": params.Id_app,
                };
                _API.call("production/verifytoken", data)
                    .then(function (response) {
                        if (response.estado != "OK") {
                            /* si no autentica, alerta y sale del form */
                            reject(null);
                        } else {
                            if (response.records.length == 0) {
                                reject(null);
                            } else {
                                resolve(null);
                            }
                        }
                    })
                    .catch(function (err) {
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
                        data["id_user"] = _API.authentication.data.id;
                        data["token"] = _API.authentication.data.token_authentication;
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
