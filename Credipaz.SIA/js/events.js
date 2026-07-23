/* Archivo con todos los eventos implementados en la rama */

/* EVENTO DE TESTEO */
$("body").off("click", ".btnTest").on("click", ".btnTest", function () {
	_F.onTest($(this));
});

/* EVENTOS IMPLEMENTADOS */
$("body").off("click", ".btnSelect").on("click", ".btnSelect", function (e) {
	_F.onTipoClick($(this));
});

/*Evento para Enter en formulario*/
$("body").off("keyup", ".evalReturn").on("keyup", ".evalReturn", function (key) {
	_F.onEvalReturn($(this), key);
});

$("body").off("click", ".btnBuscarAutorizacion").on("click", ".btnBuscarAutorizacion", function () {
	_F.onBuscar($(this));
});