/* Archivo con todos los eventos implementados en la rama */

/* EVENTOS IMPLEMENTADOS */
$("body").off("click", ".btnUiExecute").on("click", ".btnUiExecute", function () {
    _F.onLoadLink($(this));
});

$("body").off("click", ".btnExec").on("click", ".btnExec", function () {
    _F.onUiExecute().then(function (data) { });
});
