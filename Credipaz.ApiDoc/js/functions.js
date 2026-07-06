/* Objeto con todas las funciones de la rama */
var _F = {
	onInit: function () {
		return new Promise(
			function (resolve, reject) {
				try {
					$("body").load((_API._ROOT + "/html/index.html?" + _API._TS), function () {
						$(".logoImage").attr("src", _API.imageLogin);
						_API.inited = true;
						var data = { "id_user_activate": _API.authentication.data.id, "id_app": _API.configuration.id_app, "token_authentication": _API.authentication.data.token_authentication };
						_API.log("onInit->data->", data);
						_API.call("production/documentationinterface", data).then(function (response) {
							response.html = response.html.replaceAll("[ROOT]", _API._ROOT);
							response.html = response.html.replaceAll("[SERVER]", _API.configuration.server.slice(0, -1));
							$(".areaResultado").html(response.html).removeClass("d-none");
						});
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
	onLoadLink(_this) {
		$(".detailsAPI").load(_this.attr("data-link"), function () {
			$("#endpoint").val(_this.attr("data-endpoint"));
		});
	},
	onUiExecute: function (_json) {
		return new Promise(
			function (resolve, reject) {
				var _endpoint = $("#endpoint").val();
				var _call = { type: "POST", dataType: "json", url: _endpoint, data: _json };
				$("#request").html("<pre>" + JSON.stringify(_call, undefined, 2) + "</pre>");
				var ajaxRq = $.ajax({
					type: "POST",
					dataType: "json",
					url: _endpoint,
					data: _json,
					error: function (xhr, ajaxOptions, thrownError) { reject(thrownError); },
					success: function (datajson) { resolve(datajson); }
				});
			});
	}
}
