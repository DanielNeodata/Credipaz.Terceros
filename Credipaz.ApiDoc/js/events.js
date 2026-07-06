/* Archivo con todos los eventos implementados en la rama */

/* EVENTOS IMPLEMENTADOS */
$("body").off("click", ".btnUiExecute").on("click", ".btnUiExecute", function () {
    _F.onLoadLink($(this));
});
