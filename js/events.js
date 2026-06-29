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

$("body").off("click", ".btn-AuthenticateExternal").on("click", ".btn-AuthenticateExternal", function () {
    _API.authenticateexternal($(this));
});