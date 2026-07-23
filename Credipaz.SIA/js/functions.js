/* Objeto con todas las funciones de la rama */
var _F = {

	DNI: "",

	/* FUNCION DE INICIALIZACION */
	onInit: function () {
		return new Promise(
			function (resolve, reject) {
				try {
					$("body").load((_API._ROOT + "/html/index.html?" + _API._TS), function () {
						_API.inited = true;
						// Carga imagenes de encabezados
						$(".img1").attr("src", _API._ROOT + "/img/credipaz.png");
						if (window.innerWidth < 600) {
							$(".img2").attr("src", _API._ROOT + "/img/logo_chico.png");
							$(".qspacer").addClass("d-none");
							$(".qfunc").removeClass("col-2");
							$(".qfunc").addClass("col-4");
							//$(".areaDatos").css({ "style": "100%" });
						}
						else {
							$(".img2").attr("src", _API._ROOT + "/img/logo.png");
							$(".qspacer").removeClass("d-none");
							$(".qfunc").removeClass("col-4");
							$(".qfunc").addClass("col-2");
							$(".qfunc").addClass("col-4");
							//$(".areaResultado").css({ "style": "50%" });
						}
						$(".img3").attr("src", _API._ROOT + "/img/clubredondo.png");
						// Carga imagen de botones
						$(".btn1").attr("src", _API._ROOT + "/img/ambulancia.png");
						$(".btn1").click();
						$(".btn2").attr("src", _API._ROOT + "/img/farmacia.png");
						$(".btn3").attr("src", _API._ROOT + "/img/medico.png");
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
	onTipoClick: function (_this) {
		if (!_this || _this.length === 0) return;

		$(".btnSelect").removeClass("active").removeClass("border").css({ "border": "solid 2px white" });
		_this.css({ "border": "solid 2px navy", "border-radius": "15px" });

		$(".qFuncion").val(_this.attr('data-value'));
		$(".titleBtn").html(_this.attr("data-title"));
		$(".DNI").click();
		$(".DNI").focus();
	},

	onEvalReturn: function (_this, key) {
		var keyCode = (key.keyCode || key.which);
		if (keyCode === 13) {
			$(".btnBuscarAutorizacion").click();
		}
	},

	onBuscar: function (_this) {
		switch ($(".qFuncion").val()) {
			case "farmacia":
				_mode = 3;
                break;
			case "ambulancia":
				_mode = 1;
                break;
			case "medico":
				_mode = 2;
                break;
		}
		var params = { "Modo": _mode, "NroDocumento": $(".DNI").val() };
		_API.method("/asesores/socios/autorizar", params)
			.then(function (msg) {
				_API.log("Content:", msg);
				var _html = "<table class='table table-condensed'>";
				if (msg.records[0].NroAutorizacion.slice(0, 1) == "A") {
					_html += "<tr><td align=center>Nombre</td><td align=center>ID</td></tr>";
					$(".areaResultado").css({ "border": "double 3px green" });
				} else {
					_html += "<tr><td colspan='2' style='color:red;'><b>RECHAZADO</b><br/>No hay usuario habilitado para el servicio con esos datos</td></tr>";
					$(".areaResultado").css({ "border": "double 3px red" });
				}
				_html += "<tr><td align=center><b>" + msg.records[0].Nombre + "</b></td><td align=center><b>" + msg.records[0].NroAutorizacion + "</b></td></tr>";
				_html += "</table>";
				$(".qhr").html("<hr />");
				$(".areaResultado").html(_html);
				$(".btnBuscarAutorizacion").fadeIn();
			})
			.catch(function (retError) {
				_API.log("Se ha producido un error: " + retError.message);
				$(".btnBuscarAutorizacion").fadeIn();
			});

		console.error("Token: " + _API.authentication.data.token_authentication);

	}
}