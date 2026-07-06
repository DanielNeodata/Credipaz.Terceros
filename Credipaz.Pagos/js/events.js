/* Archivo con todos los eventos implementados en la rama */

/* EVENTO DE TESTEO */
$("body").off("click", ".btnTest").on("click", ".btnTest", function () {
	_F.onTest($(this));
});

/* EVENTOS IMPLEMENTADOS */
$("body").off("click", ".btn-BotonDePagos").on("click", ".btn-BotonDePagos", function () {
	_F.onBotonDePagos($(this));
});
$("body").off("change", ".chkPay").on("change", ".chkPay", function () {
	_F.onTotalizePayment($(this));
});
$("body").off("keydown", ".updImporte").on("keydown", ".updImporte", function (e) {
	$(".data-payment1").addClass("d-none");
});
$("body").off("keyup", ".updImporte").on("keyup", ".updImporte", function (e) {
	$(".data-payment1").addClass("d-none");
	clearTimeout(_API._TIMER_LAZY);
	_API._TIMER_LAZY = setTimeout(function () { _F.onTotalizePayment($(this)); }, 500);
});
$("body").off("click", ".btn-pagar-fiserv").on("click", ".btn-pagar-fiserv", function (e) {
	_F.onPagarFiserv($(this));
});
