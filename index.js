$(document).ready(function () {
    /* en el scope de la carga, utilizar _TS y NO _API._TS, _API._TS debe usarse luego de la ejecución de readConfigServers */
    var _TS = new Date().getMilliseconds();
    $.getScript(("js/API.js?" + _TS), function () {
        $.getScript(("js/events.js?" + _TS), function () {
            /* Lectura de la configuración general para controlar comunicación con la API 
               Lee valores de parámetros de acceso en la url 
               Setea la verbosity de la función log, solo generando logs en ambientes de desarrollo
               Setea timestamp para saltear los cachés*/
            _API.readConfigServers("API", _TS).then(function () {
                    /* Log de valores seteables en la configuración general de acceso, no visible en producción */
                    _API.log("URL parameters", _API.urlParameters);
                    _API.log("Configuration", _API.configuration);
                    /* Switch para ir a la rama del tree según el encabezado del sitio 
                    Seteo de valres específicos de comportamiento de la rama
                    Parámetros:
                    _root = subdirectorio específico de código de la rama
                    _subsystem = identificador de texto para el subsystem, que se muestra en el formulario de login
                    _loginRequired = true si requiere o no autenticacion de usuario LDAP o EXTERNO / salse si no requiere autenticación de usuario externo
                    _imageLogin = url relativa o absoluta, sin parámetros, para el header del login, null si _loginRequired=false
                    _externalUserMode = 0 para LDAP / 1 para EXTERNO - null si _loginRequired=false
                    _id_app_external = valor del id de app a la cual el usuario externo debe tener permiso de acceso, segun valores en mod_backend_applications */
                    switch (window.location.host) {
                        case "localhost:4441": //Gestión externa de deuda - dev daniel
                            _API.setBranch("Credipaz.GestionExternaDeuda", "Acceso a la gestión externa de deuda", true, "./img/credipaz.png", 1, 13);
                            break;
                        case "localhost:4442": //Cesiones - dev daniel
                            _API.setBranch("Credipaz.Cesiones", "Acceso a información de cesiones", true, "./img/credipaz.png", 1, 12);
                            break;
                        case "localhost:4443": //SIA - dev daniel
                            _API.setBranch("Credipaz.SIA", null, false, null, null);
                            break;
                        case "localhost:4444": //Botón de pago - dev daniel
                            _API.setBranch("Credipaz.Pagos", null, false, null, null);
                            break;
                    }
                    /* control de acceso autenticado por parte del usuario externo */
                    if (!_API.loginRequired) {
                        /* acceso sin autenticación de usuario externo */
                        _API.loaderFile(_API.configuration.fileLoader).then(function () { });
                    } else {
                        /* acceso con autenticación de usuario externo 
                           debe hacerse llamada de autenticación inicial para lueg poder utilizar la atenticación externa,
                           esto no es requerido cuando no se requiere de la autenticacion externa*/
                        _API.authenticate().then(function () {
                            _API.log("Authentication", _API.authentication);
                            _API.onShowLoginModal();
                        });
                    }
            });
        });
    });
});
