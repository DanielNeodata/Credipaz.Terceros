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

/*Evento para máscara de numeros en inputs*/
$("body").off("keyup", ".onlyNumbers").on("keyup", ".onlyNumbers", function () {
    _API.tools.onlyNumbers($(this));
});

/*Evento para return de formulario de login*/
$("body").off("keyup", ".loginreturn").on("keyup", ".loginreturn", function (key) {
    _API.onLoginReturn($(this), key);
});

/*Evento que dispara el boton de autenticvación externa*/
$("body").off("click", ".btn-AuthenticateExternal").on("click", ".btn-AuthenticateExternal", function () {
    _API.authenticateexternal($(this));
});
/*Botón de cierre de la interface por control de seguridad*/
$("body").off("click", ".btn-Unauthorized").on("click", ".btn-Unauthorized", function () {
    window.close();
});

/*Evento que copia el contenido del elemento al portapapeles*/
$("body").off("click", ".btn-copyClip").on("click", ".btn-copyClip", function () {
    _T.copyToClipboard($(this));
});
