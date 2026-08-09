/* Archivo con todos los eventos implementados en la rama */

/* EVENTOS COMUNES A TODAS LAS RAMAS */

/*Evento click sobre elemento de menu*/
$("body").off("click", ".itemMenu").on("click", ".itemMenu", function () {
    _API.onClickMenu($(this));
});
/*Evento click sobre elemento de menu*/
$("body").off("click", ".itemSubMenu").on("click", ".itemSubMenu", function () {
    _API.onClickSubMenu($(this));
});

/*Evento ok por default de las ventanas modal*/
$("body").off("click", ".btn-ok-modal").on("click", ".btn-ok-modal", function () {
    _API.onDestroyModal("#" + $(this).attr("data-modal"));
});
$("body").off("click", ".btn-ok-modalall").on("click", ".btn-ok-modalall", function () {
    _API.onDestroyModalAll("#" + $(this).attr("data-modal"));
});

/*Evento cancel por default de las ventanas modal*/
$("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
    _API.onDestroyModal("#" + $(this).attr("data-modal"));
});
$("body").off("click", ".btn-cancel-modalall").on("click", ".btn-cancel-modalall", function () {
    _API.onDestroyModalAll("#" + $(this).attr("data-modal"));
});

/*Evento para máscara de numeros en inputs*/
$("body").off("keyup", ".onlyNumbers").on("keyup", ".onlyNumbers", function () {
    _API.tools.onlyNumbers($(this));
});

/*Evento para return de formulario de login*/
$("body").off("keyup", ".loginreturn").on("keyup", ".loginreturn", function (key) {
    _API.onLoginReturn($(this), key);
});

/*Evento que dispara el boton de autenticación externa*/
$("body").off("click", ".btn-AuthenticateExternal").on("click", ".btn-AuthenticateExternal", function () {
    _API.authenticateexternal($(this));
});

/*Evento que dispara el boton de reinicio de la interface para logout*/
$("body").off("click", ".btnLogout").on("click", ".btnLogout", function () {
    _API.onLogout($(this));
});

/*Evento que copia el contenido del elemento al portapapeles*/
$("body").off("click", ".btn-copyClip").on("click", ".btn-copyClip", function () {
    _T.copyToClipboard($(this));
});

/*Evento para search de datos del cliente*/
$("body").off("keyup", ".dniCliente").on("keyup", ".dniCliente", function (key) {
    _API.onDniCliente($(this), key);
});
$("body").off("click", ".btnSearchCliente").on("click", ".btnSearchCliente", function () {
    _API.onDniCliente($(this), null);
});

/*Evento para acceso a la configuración del usuario*/
$("body").off("click", ".btnSettings").on("click", ".btnSettings", function () {
    _API.onSettings($(this));
});
