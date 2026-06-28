/* Archivo con todos los eventos implementados en la rama */

/* EVENTO DE TESTEO */
$("body").off("click", ".btnTest").on("click", ".btnTest", function () {
	_F.onTest($(this));
});

/* EVENTOS IMPLEMENTADOS */
