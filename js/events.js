/* Archivo con todos los eventos implementados en la rama */

/* EVENTOS COMUNES A TODAS LAS RAMAS */

/*Evento ok por default de las ventanas modal*/
$("body").off("click", ".btn-ok-modal").on("click", ".btn-ok-modal", function () {
    _API.onDestroyModal(_id);
});
/*Evento cancel por default de las ventanas modal*/
$("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
    _API.onDestroyModal(_id);
});

$("body").off("click", ".btn-AuthenticateExternal").on("click", ".btn-AuthenticateExternal", function () {
    /* llamada a la API para autenticar credenciales de usuario, segun modo configurado en el switch */
    if (!_API.validate(".validateLogin", false)) { return false; }
    var data = {
        "id_user": _API.authentication.id,
        "token_authentication": _API.authentication.token_authentication,
        "id_app": _API.authentication.id_app_external,
        "username": $(".Username").val(),
        "password": $(".Password").val(),
        "external_operator": _API.externalUserMode
    };
    _API.call("production/authenticateexternal", data)
        .then(function (response) {
            if (response.status != "OK") {
                /* si no autentica, alerta y sale del form */
                alert(response.message);
                return false;
            }
            /* si pasa la autenticación ok, destruye el modal y ejecuta el loader */
            _API.onDestroyModal("#modalLogin");
            _API.loaderFile(_API.configuration.fileLoader).then(function () { });
        })
        .catch(function (err) { });
});