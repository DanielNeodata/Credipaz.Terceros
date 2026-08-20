/* Archivo con todos los eventos implementados en la rama */

/* EVENTO DE TESTEO */
$("body").off("click", ".btnTest").on("click", ".btnTest", function () {
	_F.onTest($(this));
});

/* EVENTOS IMPLEMENTADOS */
$(document).on('change', 'select.Cesiones', function () {
    _F.onSelectFecha($(this));
});

$("body").off("click", ".btnCarpetaDigital").on("click", ".btnCarpetaDigital", function () {
	_F.onTraerCarpetaDigital($(this));
});

$("body").off("click", ".btnBridgeFile").on("click", ".btnBridgeFile", function () {
	_F.onBridgeFile($(this));
});