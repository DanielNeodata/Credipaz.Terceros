/* Carga el archivo de eventos de la rama */
_API.loaderFile(_API.configuration.fileEvents).then(function () {
    /* Carga el archivo de funciones de la rama */
    _API.loaderFile(_API.configuration.fileFunctions).then(function () {
        _F.onInit();
    });
});
