/* Objeto con todas las funciones de la rama */
var _F = {
	/* FUNCION DE INICIALIZACION */
	onInit: function () {
		return new Promise(
			function (resolve, reject) {
				try {
					$("body").load((_API._ROOT + "/html/index.html?" + _API._TS), function () {
						_API.inited = true;
						$(".logoImage").attr("src", (_API._ROOT + "/img/logo.png?" + _API._TS));
						resolve(null);
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
	onSupervision: function (_this) {
		$(".areaResultado").html("Supervisión").removeClass("d-none");
	},
	onMonitoreo: function (_this) {
		var params = { "Modo": _mode, "NroDocumento": $(".DNI").val() };
		_API.method("/asesores/socios/autorizar", params)
			.then(function (msg) {
				_API.log("Content:", msg);
				var _html = "<table class='table table-condensed'>";
				_html += "</table>";
				$(".areaResultado").html(_html);
			})
			.catch(function (retError) {
				_API.log("Se ha producido un error: " + retError.message);
			});
	},
	onConsultas: function (_this) {
		$(".areaResultado").html("Consultas").removeClass("d-none");
	},
}