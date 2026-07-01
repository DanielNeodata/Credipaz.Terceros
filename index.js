$(document).ready(function () {
    /* en el scope de la carga, utilizar _TS y NO _API._TS, _API._TS debe usarse luego de la ejecución de readConfigServers */
    var _TS = new Date().getMilliseconds();
    $.getScript(("js/API.js?" + _TS), function () {
        /* Lectura de la configuración general para controlar comunicación con la API 
           Lee valores de parámetros de acceso en la url 
           Setea la verbosity de la función log, solo generando logs en ambientes de desarrollo
           Setea timestamp para saltear los cachés*/
        _API.readConfigServers("API", _TS).then(function () {
            /* asignacion de key pa lectura de configuracion de la rama, segun el encabezado de produccion */
            var _headerProductionKey = "";
            switch (window.location.host) {
                case "apidoc.mediya.com.ar": //Documentación API Mediya - producción
                case "localhost:4439": //Documentación API Mediya - dev daniel
                case "localhost:54439": //Documentación API Mediya - dev ruben
                    _headerProductionKey = "apidoc.mediya.com.ar";
                    break;
                case "apidoc.credipaz.com": //Documentación API Credipaz - producción
                case "localhost:4440": //Documentación API Credipaz - dev daniel
                case "localhost:54440": //Documentación API Credipaz - dev ruben
                    _headerProductionKey = "apidoc.credipaz.com";
                    break;
                case "deuda.credipaz.com": //Gestión externa de deuda - producción
                case "localhost:4441": //Gestión externa de deuda - dev daniel
                case "localhost:54441": //Gestión externa de deuda - dev ruben
                    _headerProductionKey = "deuda.credipaz.com";
                    break;
                case "cesiones.credipaz.com": //Cesiones - producción
                case "localhost:4442": //Cesiones - dev daniel
                case "localhost:54442": //Cesiones - dev ruben
                    _headerProductionKey = "cesiones.credipaz.com";
                    break;
                case "sia.credipaz.com": //SIA - producción
                case "localhost:4443": //SIA - dev daniel
                case "localhost:54443": //SIA - dev ruben
                    _headerProductionKey = "sia.credipaz.com";
                    break;
                case "pagos.credipaz.com": //Botón de pago credipaz- producción
                case "localhost:4444": //Botón de pago Credipaz - dev daniel
                case "localhost:54444": //Botón de pago Credipaz - dev ruben
                    _headerProductionKey = "pagos.credipaz.com";
                    break;
                case "pagos.mediya.com.ar": //Botón de pago - producción
                case "localhost:4445": //Botón de pago Mediya - dev daniel
                case "localhost:54445": //Botón de pago Mediya - dev ruben
                    _headerProductionKey = "pagos.mediya.com.ar";
                    break;
            }
            /* Switch para ir a la rama del tree según el encabezado del sitio 
            Seteo de valres específicos de comportamiento de la rama mediante readConfigBranches
            Parámetros:
            key = encabezado de producción*/
            _API.readConfigBranches(_headerProductionKey).then(function (_branchConfig) {
                _API.activateBranch(_branchConfig);
            })
        });
    });
});
