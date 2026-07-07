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
			$(".hdrEnd").html(_F.onBuildHeaderEndpoint());
			$(".hdrParam").html(_F.onBuildHeaderParam());
			$(".bodyParam").prepend(_F.onBuildBodyParam());
			$(".footerEndpoint").html(_F.onBuildFooterEndpoint());
			$(".areaAjax").html(_F.onBuildAreaAjax());
			$("#endpoint").val(_this.attr("data-endpoint"));
			$(".apiTitle").html(_this.html());
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
					success: function (datajson) {
						$("#response").html("<pre>" + JSON.stringify(datajson, undefined, 2) + "</pre>");
						$(".titleCall").removeClass("d-none");
						resolve(datajson);
					}
				});
			});
	},
	onBuildHeaderEndpoint() {
		var _html = "<thead class='thead-light'>";
		_html += "<tr><th><b class='p-0 m-0'>Endpoint</b></th><th></th></tr>";
		_html += "</thead>";
		_html += "<tbody>";
		_html += "<tr>";
		_html += "<td><input class='form-control' id='endpoint' name='endpoint' disabled value='' style='padding:5px !important;'/></td>";
		_html += "<td><a href='#' class='btn-copyClip btn btn-sm btn-light' data-source='endpoint'><span class='material-symbols-outlined'>content_copy</span></a></td>";
		_html += "</tr>";
		_html += "</tbody>";
		return _html;
	},
	onBuildHeaderParam() {
		var _html = "<tr><th><b class='p-0 m-0'>Parámetros</b></th><th></th><th></th><th></th></tr>";
		return _html;
	},
	onBuildBodyParam() {
		var _html = "<tr>";
		_html += "<td><b>Token</b></td>";
		_html += "<td><input class='form-control' id='token_authentication' name='token_authentication' type='text' placeholder='Token authentication' value='' autocomplete='new-password'/></td>";
		_html += "<td><i>string</i></td>";
		_html += "<td><span class='badge badge-danger'>requerido</span></td>";
		_html += "</tr>";
		_html += "<tr>";
		_html += "<td><b>ID usuario activo</b></td>";
		_html += "<td><input class='form-control' id='id_user_active' name='id_user_active' type='number' placeholder='ID usuario activo' value='' autocomplete='new-password'/></td>";
		_html += "<td><i>integer</i></td>";
		_html += "<td><span class='badge badge-danger'>requerido</span></td>";
		_html += "</tr>";
		_html += "<tr>";
		_html += "<td><b>ID application</b></td>";
		_html += "<td><input disabled class='form-control' id='id_app' name='id_app' type='number' placeholder='ID application' value='11'/></td>";
		_html += "<td><i>integer</i></td>";
		_html += "<td><span class='badge badge-danger'>requerido</span></td>";
		_html += "</tr>";
		return _html;
	},
	onBuildFooterEndpoint: function () {
		var _html = "<hr/>";
		_html += "<center><a href='#' class='btn btn-raised btn-success btnExec'>Ejecutar</a></center>";
		_html += "<table class='table table-borderless shadow-sm mt-2'>";
		_html += "<thead class='thead-light'>";
		_html += "<tr>";
		_html += "<th><b class='p-0 m-0'>Observaciones</b></th>";
		_html += "</tr>";
		_html += "</thead>";
		_html += "<tbody>";
		_html += "<tr>";
		_html += "<td>";
		_html += "<p>Para integraciones externas se debe utilizar <b>11</b>, como valor de ID application, el cual está fijo en estos ejemplos.</p>";
		_html += "<p>Debe enviarse el <b>token_authentication</b> y el <b>id_user_active</b>, ambos valores obtenidos por medio del endpoint <b>/production/authenticate</b>.</p>";
		_html += "</td>";
		_html += "</tr>";
		_html += "</tbody>";
		_html += "</table>";
		return _html;
	},
	onBuildAreaAjax: function () {
		var _html = "<h5 class='p-0 m-0 titleCall d-none'>Llamada Ajax JQuery</h5>";
		_html += "<div id='request' class='titleCall d-none'></div>";
		_html += "<h5 class='p-0 m-0 titleCall d-none'>Respuesta</h5>";
		_html += "<div id='response' class='titleCall d-none'></div>";
		return _html;
	},
}
