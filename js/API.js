var _API = {
    _TS: 0,
    _ROOT: "",
    _TIMER_ALERT: 0,
    _TIMER_LAZY: 0,
    tools: null,
    id_user_log: null,
    id_app_external: 0,
    id_sucursal: 100,
    sucursal: "CASA CENTRAL",
    loginRequired: false,
    postLogin: false,
    externalUserMode: 0,
    doctorRequired:false,
    imageLogin: "./img/loginDefault.png",
    subsystem: "",
    configuration: null,
    authentication: null,
    telemedicina: { "isDoctor": 0, "doctorName": "", "doctorFirma": "", "doctorMatricula": "" },
    branchConfiguration: null,
    urlParameters: null,
    inited: false,
    verbose: false,
    /* Funciones de log */
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
        if (_API.authentication != null) { _API.log("Authentication", _API.authentication); }
    },

    /* Funciones de ventanas poup y alertas */
    onAlert: function (_json) {
        try {
            clearTimeout(_API._TIMER_ALERT);
            $(".alert-frame").remove();
            if (typeof _json["message"] === 'object') { _text = ""; } else { _text = _json["message"]; }
            if (_text == undefined) { _text = ""; }
            if (_text == "") { return false; }
            var _html = "<div class='alert-frame' style='position:fixed;top:5px;right:5px;'>";
            _html += "      <div class='push-alert alert " + _json["class"] + " alert-dismissible fade show' role='alert'>";
            _html += "   <button type='button' class='close m-0 p-1 pt-2' style='position:absolute;right:5px;' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
            _html += _text
            _html += "</div>";
            _html += "   </div>";
            $("body").append(_html);
            _API._TIMER_ALERT = setTimeout(function () { $(".push-alert").alert('close') }, 7500);
            return true;
        } catch (rex) {
            alert(rex.message);
            return false;
        }
    },
    onShowModalOverAll: function (_name, _title, _body) {
        return new Promise(
            function (resolve, reject) {
                try {
                    $("html").css({ "overflow": "hidden" });
                    $("#" + $(".modal").attr("id")).fadeOut("slow");
                    $("body").removeClass("modal-open");
                    var _id = ("#" + _name);
                    var _id_container = (_name + "_container");
                    $(_id).remove();
                    $.get(("html/modalDefaultOverAll.html?" + _API._TS), function (_html) {
                        var _back = "<div id='" + _id_container + "' style=' background-color: rgba(0, 0, 0, 0.5);position:absolute;left:0px;top:0px;width:100%;height:100%;z-index:999998;'></div>";
                        $("body").append(_back);
                        $("#" + _id_container).append(_html);

                        //$("body").append(_html);

                        if (_title == "") { $(".modalall-header").remove(); } else { $(".modalall-title").html(_title); }
                        $(".modalall-body").html(_body);
                        $(".modalall").attr("id", _name);
                        $(".btn-cancel-modalall").attr("data-modal", _name);
                        $(".btn-ok-modalall").attr("data-modal", _name);
                        resolve(null);
                    });
                } catch (err) {
                    _API.log(("onShowModal->" + _name), _API.authentication);
                    reject(err);
                }
            }
        );
    },
    onShowModal: function (_name, _title, _body, _size) {
        return new Promise(
            function (resolve, reject) {
                try {
                    $("html").css({ "overflow": "hidden" });
                    var _id = ("#" + _name);
                    _API.onDestroyModal(_id);
                    $.get(("html/modalDefault.html?" + _API._TS), function (_html) {
                        $("body").append(_html);
                        if (_size != "") { $(".modal-dialog").addClass(_size); }
                        if (_title == "") { $(".modal-header").remove(); } else { $(".modal-title").html(_title); }
                        $(".modal-body").html(_body);
                        $(".modal").attr("id", _name);
                        $(".btn-cancel-modal").attr("data-modal", _name);
                        $(".btn-ok-modal").attr("data-modal", _name);
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
        $("html").css({ "overflow": "auto" });
    },
    onDestroyModalAll: function (_id) {
        $(_id + "_container").remove();
        $("html").css({ "overflow": "auto" });
        $("body").addClass("modal-open");
        $("#" + $(".modal").attr("id")).fadeIn("fast");
    },
    
    /* Funciones de acciones sobre menues y entorno */
    onClickMenu: function (_this) {
        _this.parent().addClass("blink");
        setTimeout(function () { _this.parent().removeClass("blink"); }, 1000);
    },
    onClickSubMenu: async function (_this) {
        _this.addClass("blink");
        setTimeout(function () { _this.removeClass("blink"); }, 1000);
        switch (_this.attr("data-mode")) {
            case "interfaces":
                var _url = _this.attr("data-url");
                /*Se chequea accesibilidad por el tipo de conexión - VPN / red interna */
                var check = await _API.tools.isUrlAvailable(_API.configuration.interfaces);
                if (!check) {
                    _API.onAlert({ "message": "La función no es accesible.  <b>Su conexión no es la adecuada.</b>", "class": "alert-danger" });
                    return false;
                }
                /*Chequea si string es url válida y si está accesible, más allá de estar correcto el tipo de conexión */
                check = await _API.tools.isUrlAvailable(_url);
                if (!URL.canParse(_url) || !check) {
                    _API.onAlert({ "message": ("<b>" + _url + "</b> no está accesible por el momento."), "class": "alert-warning" });
                    return false;
                }
                /*Resuelve la navegación y display de la url de Interfaces */
                if (!_url.includes("?")) { _url += "?"; }
                _url += ("id_user_active=" + _API.id_user_log + "&username=" + _API.username_log + "&id_sucursal=" + _API.id_sucursal + "&sucursal=" + _API.sucursal);
                var _html = "<iframe id='neoweb_iframe' class='neoweb_iframe' src='" + encodeURI(_url) + "' frameborder='0' style='height:500vh;width:100%;'></iframe>";
                $(".areaResultado").html(_html).removeClass("d-none");
                break;
        }
    },
    onLoginReturn: function (_this, key) {
        var keyCode = (key.keyCode || key.which);
        if (keyCode === 13) {
            $(".btn-AuthenticateExternal").click();
        }
    },
    onLogout: function (_this) {
        var _html = "<h4 class='pl-2 magenta msgOut blink'></h4>";
        _html += "<div class='progress' style='height:2px;'><div class='progress-bar progress-bar-striped progress-bar-animated bg-dark' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div>";
        _API.onShowModal("modalLogout", "", _html, "").then(function (_ret) {
            $(".wfooter").remove();
            var _messages = ["Desconectando de red...", "Reseteando variables...", "Liberando memoria..."]
            var _timeOut = 3000;
            var _interval = (_timeOut / _messages.length);
            var i = 0;
            setInterval(function () { $(".progress-bar").attr("aria-valuenow", i).css({ "width": (i + "%") }); i++; }, (_timeOut / 100));
            _messages.forEach((item, index) => { setTimeout(function () { $(".msgOut").html(item); }, (_interval * index)); });
            setTimeout(function () { $("body").html("").addClass("bg-silver").fadeOut(100, function () { window.location.reload(); }); }, _timeOut);
        });
    },

    /* Funciones con interface específica */
    onWait: function (_on) {
        if (_on) {
            $.blockUI({ message: '<img src="/img/wait.gif" />', css: { border: 'none', backgroundColor: 'transparent', opacity: 1, color: 'transparent' } });
            $(".blockOverlay").css({ "z-index": 9999999 });
            $(".blockPage").css({ "z-index": 9999999 });
        } else {
            $.unblockUI();
        }
    },
    onSettings: async function (_this) {
        _API.onWait(true);
        var _html = "";
        _html += "<h5>Configuración del usuario</h5><hr/>";
        _html += "<div class='card p-2'>";
        _html += "<b>Detalle de audio, video y permisos</b>";
        _html += "<table class='table table-borderless table-sm'>";
        _html += "   <tr>";
        _html += "      <td>Cámara</td>";
        if (_MEDIA.hasWebcam) { _html += "<td><b style='color:green;'>Existe</b></td>"; } else { _html += "<td><b style='color:red;'>Sin cámara</b></td>"; }
        if (_MEDIA.isWebcamAlreadyCaptured) { _html += "<td><b style='color:green;'>Habilitada</b></td>"; } else { _html += "<td><b style='color:red;'>No habilitada</b></td>"; }
        _html += "      <td><b style='color:blue;'>" + _MEDIA.permissionWebcam + "</b></td>";
        _html += "   </tr>";
        _html += "   <tr>";
        _html += "      <td>Micrófono</td>";
        if (_MEDIA.hasMicrophone) { _html += "<td><b style='color:green;'>Existe</b></td>"; } else { _html += "<td><b style='color:red;'>Sin micrófono</b></td>"; }
        if (_MEDIA.isMicrophoneAlreadyCaptured) { _html += "<td><b style='color:green;'>Habilitado</b></td>"; } else { _html += "<td><b style='color:red;'>No habilitado</b></td>"; }
        _html += "      <td><b style='color:blue;'>" + _MEDIA.permissionMicrophone + "</b></td>";
        _html += "   </tr>";
        _html += "</table>";
        _html += "</div>";
        _html += "<div class='card p-2 mt-1'>";
        _html += "<b>Estado de servicios</b>";
        _html += "<table class='table table-borderless table-sm'>";
        _html += await _API.onServerAvailability("API layer", _API.configuration.server);
        _html += await _API.onServerAvailability("Bussiness layer", _API.configuration.cpfinancial);
        _html += await _API.onServerAvailability("Interfaces layer", _API.configuration.interfaces);
        _html += await _API.onServerAvailability("NeoAuthenticate layer", _API.configuration.authenticationServer);
        _html += await _API.onServerAvailability("NeoVideo layer", _API.configuration.videoServer);
        _html += "</table>";
        _html += "</div>";
        _API.onShowModalOverAll("modalAV", "", _html, "").then(function (_ret) {
            $(".btn-ok-modalall").remove();
            $(".wfooter").addClass("text-center");
            $(".btn-cancel-modalall").html("Cerrar").removeClass("btn-danger").addClass("btn-info").attr("data-modal", "modalAV");
            $("#modalAV").css({ "top": "400px" });
            _API.onWait(false);
        });
    },
    onShowLoginModal: function () {
        /* carga html a mostrar en el body de la modal */
        $.get(("html/login.html?" + _API._TS), function (_html) {
            /* muestra la modal con el body resuelto*/
            _API.onShowModal("modalLogin", "", _html, "").then(function (_ret) {
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
        /*Destruye el contenido ya cargado parcialmente en el body del html */
        $("body").html("");
        /* carga html a mostrar en el body de la modal */
        $.get(("html/unauthorized.html?" + _API._TS), function (_html) {
            /* muestra la modal con el body resuelto*/
            _API.onShowModal("modalUnauthorized", "", _html, "").then(function (_ret) {
                /* remueve footer default de la modal, porque viene con botón de acción en el load de unauthorized.html */
                $(".wfooter").remove();
                /* asigna la imagen del header según valor de variable asignado en el switch por encabezado */
                $(".imgHeaderLogin").attr("src", _API.imageLogin);
                /* Mensaje pasada a la interface de rechazo */
                $(".subTitle").html(_message);
            })
        });
    },
    onBuildTable: function (_id, title, records, vHeaders, vColumns, vRules, tblClass, tblStyle, _preHeader) {
        var _html = "";
        if (title != "") { _html += "<h5>" + title + "</h5>"; }
        if (tblClass == "") { tblClass = "table table-borderless table-hover table-sm table-condensed" }
        if (tblStyle == "") { tblStyle = "width:100%;font-size:14px;"; }
        if (_preHeader != "") { _html += _preHeader; }
        _html += "<table class='" + tblClass + "' style='" + tblStyle + "'>";
        if (vHeaders.length > 0) {
            _html += "<thead class='thead-dark'>";
            _html += "<tr>";
            vHeaders.forEach(function (item) { _html += "<th>" + item + "</th>"; });
            _html += "</tr>";
            _html += "</thead>";
        }
        $.each(records, function (i, record) {
            _bDirty = true;
            _html += "<tr>";
            vColumns.forEach(function (item) { _html += "<td>" + record[item] + "</td>"; });
            _html += "</tr>";
        });
        _html += "</table>";
        return _html;
    },
    onNoTablaForTable: function (_msg) {
        var _html = "<div class='card p-2 shadow-sm'><b>Sin datos para la consulta</b></div>";
        if (_msg != "") { _html = _msg; }
        return _html;
    },
    onLoadComboAjax: function (_endpoint, _target, _selected, _valEmpty = "") {
        return new Promise(
            function (resolve, reject) {
                try {
                    var _value = _selected;
                    var _id = $(_target).attr("data-id");
                    var _descripcion = $(_target).attr("data-descripcion");
                    $(_target).css({ "opacity": 0.5, "color": "red" });
                    _API.method(_endpoint, {}).then(function (data) {
                        var _sel = "";
                        var _empty = $(_target).attr("data-empty");
                        $(_target).empty();
                        if (_value == -1 || _value == "") { _sel = "selected"; }
                        if (_empty != "N") { $(_target).append('<option ' + _sel + ' value="' + _valEmpty + '">[Seleccione]</option>'); }
                        $.each(data.data, function (i, item) {
                            _sel = "";
                            if (_value == item[_id]) {
                                $(_target.replace("#", ".")).val(_selected);
                                _sel = "selected";
                            }
                            $(_target).append('<option ' + _sel + ' value="' + item[_id] + '">' + item[_descripcion] + '</option>');
                        });
                        $(_target).css({ "opacity": 1, "color": "black" });
                        resolve(data.data);
                    }).catch(function (err) {
                        reject(err);
                    });
                } catch (rex) {
                    reject(rex);
                }
            }
        );
    },
    onDniCliente: function (_this, key) {
        if (key !== null) {
            var keyCode = (key.keyCode || key.which);
            if (keyCode !== 13) { return false; }
        }
        if (!_API.tools.validate(".dniCliente", true)) { return false; }
        var _params = { "NroDocumento": $(".dniCliente").val() };
        _API.method("/credipaz/getdatacliente", _params).then(function (data) {
            if (data.status == "OK" && data.message.records.length != 0) {
                _API.onShowModalOverAll("modalDatosCliente", "", data.message.html).then(function (_ret) {
                    $(".btn-ok-modalall").remove();
                    $(".wfooter").addClass("text-center");
                    $(".btn-cancel-modalall").html("Cerrar").removeClass("btn-danger").addClass("btn-info").attr("data-modal", "modalDatosCliente");
                });
            } else {
                alert("Sin resultados para esta consulta");
            }
        });
    },
    onMenuIntranet: function (_target) {
        /*Armado del menu completo*/
        var data = { "id_user_activate": _API.id_user_log, "id_app": 7, "token_authentication": _API.authentication.data.token_authentication };
        _API.call("production/menuinterface", data).then(function (response) {
            response.html = response.html.replaceAll("[ROOT]", _API._ROOT);
            response.html = response.html.replaceAll("[SERVER]", _API.configuration.server.slice(0, -1));
            var _encoded_authentication_data = { "Id_user": _API.id_user_log, "Token": _API.authentication.data.token_authentication, "Id_app": data.id_app };
            response.html = response.html.replaceAll("[ENCODED_AUTHENTICATION_DATA]", encodeURI(_API.tools.string_to_b64(JSON.stringify(_encoded_authentication_data))));
            $(_target).html(response.html).removeClass("d-none");
            if (_API.branchConfiguration.menuColor != "") { $(".itemMenu").addClass(_API.branchConfiguration.menuColor); }
        });
    },
    onSucursalChooser: function (_auth) {
        return new Promise(
            function (resolve, reject) {
                if (!_API.postLogin || _auth.data.details.length == 0) {
                    resolve(true);
                    return false;
                }
                /*Sucursales disponibles para ingreso, dado el usuario autenticado */
                var _sucursales = "";
                $.each(_auth.data.details, function (i, item) {
                    if (parseInt(item.nIDSucursal) != 0) { item.sSucursal = _API.sucursal; item.nIDSucursal = _API.id_sucursal; }
                    _sucursales += '<a class="list-group-item btn btn-sm bg-magenta white bold btnSelectSucursal p-1 m-0" style="color:white;" href="#" data-name="' + item.sSucursal + '" data-id="' + item.nIDSucursal + '">' + item.sSucursal + '</div>';
                });
                $.get(("html/choose.html?" + _API._TS), function (_html) {
                    _API.onShowModalOverAll("modalSelectSucursal", "Seleccione sucursal donde se encuentra", _html).then(function (_ret) {
                        $(".lsChooser").html(_sucursales);
                        $(".wfooter").remove();
                        $(".btn-cancel-modalall").remove();
                        $("#modalSelectSucursal").css({ "top": "200px" });
                        $("body").off("click", ".btnSelectSucursal").on("click", ".btnSelectSucursal", function () {
                            _API.id_sucursal = $(this).attr("data-id");
                            _API.sucursal = $(this).attr("data-name");
                            _API.onDestroyModal("#modalSelectSucursal");
                            resolve(true);
                        });
                    });
                });
            });
    },
    onServerAvailability: async function (_servicio, _url) {
        var _html = "";
        var _style = "color:red;"
        var _estado = "Offline";
        var check = await _API.tools.isUrlAvailable(_url);
        if (check) { _style = "color:green;"; _estado = "Online"; }
        _html += "   <tr>";
        _html += "      <td>" + _servicio +"</td>";
        _html += "      <td><b style='" + _style + "'>" + _estado + "</b></td>";
        _html += "   </tr>";
        return _html;
    },

    /* Funciones core de configuración, carga de archivos y llamadas a servicios externos */
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
                    .then(function (response) {
                        if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
                        return response.text();
                    })
                    .then(function (config) {
                        var data = JSON.parse(config);
                        var _item = data.find(item => item.key === key);
                        /* Asignación de valores de configuración */
                        _API.configuration = _item;
                        $.getScript(("js/media.js?" + _API._TS), function () {
                            $.getScript(("js/events.js?" + _API._TS), function () {
                                $.getScript(("js/tools.js?" + _API._TS), function () {
                                    _API.tools = _T;
                                    /* Almacena los parámetros de la url de acceso */
                                    _API.urlParameters = _API.tools.getUrlParams();
                                    /* Setea verbose, para activar o no la escritura en la consola del navegador de los mensajes de log */
                                    _API.verbose = (window.location.hostname.toLowerCase() == "localhost");
                                });
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
    loadExternalLibraries: function () {
        /*Carga de librerias de terceros y configuracion de las mismas */
        $.getScript("https://jvideo1.gruponeodata.com/external_api.js?" + _API._TS).done(function (script, textStatus) {
            $.getScript(("js/Neodata/NEOAUTHENTICATION.js?" + _API._TS)).done(function (script, textStatus) {
                $.getScript("js/Neodata/NEOVIDEO-jvideo1.js?" + _API._TS).done(function (script, textStatus) {
                    _NEOAUTHENTICATION._SERVER = _API.configuration.authenticationServer;
                    _NEOVIDEO._SERVER = _API.configuration.videoServer;
                    _NEOVIDEO._id_application = _API.configuration.id_neo_app;
                });
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
        /* flag indicando se requiere verificación pors login */
        _API.postLogin = _branchConfig.postLogin;
        /* imagen del encabeado de la pantalla de login */
        if (_branchConfig.imageLogin != null && _branchConfig.imageLogin != "") { _API.imageLogin = (_branchConfig.imageLogin + "?" + _API._TS); }
        /* modo del user a autenticar 0 - LDAP / 1 - EXTERNAL */
        _API.externalUserMode = _branchConfig.externalUserMode;
        /* valor del id de app a la cual el usuario externo debe tener permiso de acceso */
        _API.id_app_external = _branchConfig.id_app_external;
        /* flag para identiicar si es necesario filtrar el acceso a solo los médicos */
        _API.doctorRequired = _branchConfig.doctorRequired;
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
                _API.log("call->data->" + _url, data);
                $.ajax({
                    "type": "POST",
                    "dataType": "json",
                    "url": _url,
                    "data": data,
                    "success": function (response) {
                        _API.log("call->response", response);
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
                    "id_user": _API.authentication.data.id,
                    "token_authentication": _API.authentication.data.token_authentication,
                    "id_app": _API.id_app_external,
                    "username": $(".Username").val(),
                    "password": $(".Password").val(),
                    "external_operator": _API.externalUserMode
                };
                _API.call("production/authenticateexternal", data)
                    .then(function (response) {
                        _API.id_user_log = response.data.id;
                        _API.username_log = response.data.username;
                        _API.authentication.data.id = response.data.id;
                        _API.authentication.data.token_authentication = response.data.token_authentication;
                        _API.authentication.data.token_authentication_created = response.data.token_authentication_created;
                        _API.authentication.data.token_authentication_expired = response.data.token_authentication_expired;
                        _API.telemedicina.atendiendo = response.data.atendiendo;
                        _API.telemedicina.isDoctor = response.data.isDoctor;
                        _API.telemedicina.doctorName = response.data.doctorName;
                        _API.telemedicina.doctorFirma = response.data.firma;
                        _API.telemedicina.doctorMatricula = response.data.matricula;
                        if (response.status != "OK") {
                            /* si no autentica, alerta y sale del form */
                            alert(response.message);
                        } else {
                            /* Selector de sucursales, ver de controlar si se solicita o no */
                            _API.onSucursalChooser(response).then(function (_ret) {
                                _API.onDestroyModal("#modalLogin");
                                /* Si pasa la autenticación ok, destruye el modal y ejecuta el loader */
                                _API.loaderFile(_API.configuration.fileLoader).then(function () {
                                    _API.logStatus();
                                });
                            });
                        }
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
                        data["id_user_active"] = _API.authentication.data.id;
                        data["token_authentication"] = _API.authentication.data.token_authentication;
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
