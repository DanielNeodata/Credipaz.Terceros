/* Archivo con todos los eventos implementados en la rama */

/* EVENTO DE TESTEO */
$("body").off("click", ".btnTest").on("click", ".btnTest", function () {
	_F.onTest($(this));
});

/* EVENTOS IMPLEMENTADOS */
$("body").off("click", ".btnCancelTelemedicina").on("click", ".btnCancelTelemedicina", function () {
	_F.onCancelTelemedicina($(this));
});
$("body").off("click", ".btnSupervision").on("click", ".btnSupervision", function () {
	_F.onSupervision($(this));
});
$("body").off("click", ".btnMonitoreo").on("click", ".btnMonitoreo", function () {
	_F.onMonitoreo($(this));
});
$("body").off("click", ".btnConsultas").on("click", ".btnConsultas", function () {
	_F.onConsultas($(this));
});
$("body").off("click", ".btnPostClose").on("click", ".btnPostClose", function () {
	_F.onPostClose($(this));
});
$("body").off("click", ".btnEditChargeCode").on("click", ".btnEditChargeCode", function () {
	_F.onEditChargeCode($(this));
});

