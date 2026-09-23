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
$("body").off("click", ".btnSaveNuevaNota").on("click", ".btnSaveNuevaNota", function () {
	_F.onSaveNuevaNota($(this));
});
$("body").off("click", ".btnAmbulancia").on("click", ".btnAmbulancia", function () {
	_F.onAmbulancia($(this));
});
$("body").off("click", ".btnSaveAmbulancia").on("click", ".btnSaveAmbulancia", function () {
	_F.onSaveAmbulancia($(this));
});
$("body").off("click", ".btnImagenes").on("click", ".btnImagenes", function () {
	_F.onImagenes($(this));
});
$("body").off("click", ".btnRecetas").on("click", ".btnRecetas", function () {
	_F.onRecetas($(this));
});
$("body").off("click", ".btnAtenciones").on("click", ".btnAtenciones", function () {
	_F.onAtenciones($(this));
});
$("body").off("click", ".btnVerAtencionPrevia").on("click", ".btnVerAtencionPrevia", function () {
	_F.onVerAtencionPrevia($(this));
});
$("body").off("click", ".btnVerImagen").on("click", ".btnVerImagen", function () {
	_F.onVerImagen($(this));
});
$("body").off("click", ".btnVerReceta").on("click", ".btnVerReceta", function () {
	_F.onVerReceta($(this));
});
$("body").off("click", ".btnBuildOrden").on("click", ".btnBuildOrden", function () {
	_F.onBuildOrden($(this));
});
$("body").off("click", ".btnBuildReceta").on("click", ".btnBuildReceta", function () {
	_F.onBuildReceta($(this));
});
$("body").off("click", ".btnCambiarDatosOrden").on("click", ".btnCambiarDatosOrden", function () {
	_F.onCambiarDatosOrden($(this));
});
$("body").off("click", ".btnEspontanea").on("click", ".btnEspontanea", function () {
	_F.onEspontanea($(this));
});
$("body").off("click", ".btnGrabarOrdenMedica").on("click", ".btnGrabarOrdenMedica", function () {
	_F.onGrabarOrdenMedica($(this));
});
$("body").off("click", ".btnGrabarAtencion").on("click", ".btnGrabarAtencion", function () {
	_F.onGrabarAtencion($(this));
});
$("body").off("click", ".btnDoctorAtencion").on("click", ".btnDoctorAtencion", function () {
	_F.onDoctorAtencion($(this));
});
$("body").off("click", ".btnVideo").on("click", ".btnVideo", function () {
	_F.onVideo($(this));
});

$("body").off("click", ".btnUploadReceta").on("click", ".btnUploadReceta", function (event) {
	$(this).val(null);
});



$("body").off("change", ".btnUploadReceta").on("change", ".btnUploadReceta", function (event) {
	_F.onUploadReceta($(this));
});
$("body").off("change", ".tCierre").on("change", ".tCierre", function () {
	_F.onChangeTypeClose($(this));
});
$("body").off("change", ".cboSwiss").on("change", ".cboSwiss", function () {
	_F.onChangeCboSwiss($(this));
});