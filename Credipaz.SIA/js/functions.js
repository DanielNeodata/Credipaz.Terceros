/* Objeto con todas las funciones de la rama */
var _F = {
	/* FUNCION DE INICIALIZACION */
	onInit: function () {
		//$.getScript((_API._ROOT + "/js/any.js?" + _API._TS), function () {
			$("body").load((_API._ROOT + "/html/index.html"));
			_API.inited = true;
		//});
	},
	/* FUNCION DE DESTRUCCION DE INTERFACE */
	onDestroy: function () {
		$("body").html("");
		_API.inited = false;
		_API._ROOT = "";
	},

	onTest: function (_this) {
		var _target = _this.attr("data-target");
		var _alert = _this.attr("data-alert");
		var _message = _this.attr("data-message");
		alert(_alert);
		$(_target).html(_message);
	},
	/* FUNCIONES IMPLEMENTADAS */
}