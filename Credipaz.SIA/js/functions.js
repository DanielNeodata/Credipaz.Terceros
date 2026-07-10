/* Objeto con todas las funciones de la rama */
var _F = {

	DNI: "",

	/* FUNCION DE INICIALIZACION */
	onInit: function () {
		return new Promise(
			function (resolve, reject) {
				try {
					$("body").load((_API._ROOT + "/html/index.html?" + _API._TS), function () {
						/* evalua los parámetros y realiza las acciones que correspondan según lo recibido */
						_F.onEvalParameters().then(function (response) {
							_API.inited = true;
							resolve(null);
						});
					});
				} catch (err) {
					reject(err);
				}
			}
		);
	},
	/* FUNCION DE DESTRUCCION DE INTERFACE */
	onDestroy: function () {
		return new Promise(
			function (resolve, reject) {
				try {
					$("body").html("");
					_API.inited = false;
					_API._ROOT = "";
					resolve(response);
				} catch (err) {
					reject(err);
				}
			}
		);
	},

	/* FUNCION DE TESTEO */
	onTest: function (_this) {
		var _target = _this.attr("data-target");
		var _alert = _this.attr("data-alert");
		var _message = _this.attr("data-message");
		alert(_alert);
		$(_target).html(_message);
	},

	/* FUNCIONES IMPLEMENTADAS */
}