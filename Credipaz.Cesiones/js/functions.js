/* Objeto con todas las funciones de la rama */
var _F = {
	/* FUNCION DE INICIALIZACION */
	onInit: function () {
		return new Promise(
			function (resolve, reject) {
				try {
					$("body").load((_API._ROOT + "/html/index.html?" + _API._TS), function () {
//						$(".logoImage").attr("src", _API.imageLogin);
						_API.inited = true;
						// Tomar ID de la tabla de Entidades
						var data = { "idEntidad": 1 };
						_API.method("credipaz/cesiones", data).then(function (response) {
							console.log("Lista cruda: " + JSON.stringify(response));
							// No es necesario aplicar el filtro
							//const filteredList = response.data.filter(item => item.Entidad === _API.username_log);
							//listString = JSON.stringify(filteredList);
							//console.log("Lista filtrada: " + listString);
							if (response.data) {
								_qstr = "<table>\n";
								_qstr += "<tr>\n";
								_qstr += "<td class='col-2'>Entidad</td>\n";
								_qstr += "<td class='col-4'>Fecha de cesión</td >\n";
								_qstr += "</tr>\n";
								_qstr += "<tr>\n";
								_qstr += "<td class='col-2'>\n";
								_qstr += "<b>" + _API.username_log + "</b>\n";
								_qstr += "</td>\n";
								_qstr += "<td class='col-4'>\n";
								_qstr += "<select id='Cesiones' name='Cesiones' class='form-control Cesiones'>\n";
								response.data.forEach((obj, index) => {
									_qstr += "<option value='" + obj.Id + "'>" + obj.Descripcion + "</option>\n";
								});
								_qstr += "</select>\n";
								_qstr += "</td>\n";
								_qstr += "</tr>\n";
								_qstr += "</table>\n";
								_qstr += "<br>\n";
								//console.log("Cesiones: " + _qstr);
								$(".areaBusqueda").html(_qstr).removeClass("d-none");
							}
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
	onSelectFecha: function (_this) {
		return new Promise(
			function (resolve, reject) {
				try {
					// Carga lista de Cedidos
					var data = { "idEntidad": "1", "cesion": _this.val(), "download": "N" };
					_API.method("credipaz/cedidos", data).then(function (response) {
						console.log(response);
						if (response.data) {
							// No es necesario filtrar
							const orderedList = response.data.sort((a, b) => a.fFecha - b.fFecha);
							if (orderedList.length > 1) {
								var vHeaders = [];
								var vColumns = [];
								var vRules = [];
								vHeaders = ["Fecha", "DNI", "Titular", ""];
								vColumns = ["fFecha", "NroDocumento", "Nombre", "fInformes"];
								_qstr = _API.onBuildTable("tblCarpetaDigital", "Carpeta Digital", orderedList, vHeaders, vColumns, vRules, "table table-borderless table-hover table-sm table-condensed table-striped", "", "");
							} else {
								_qstr = _API.onNoTablaForTable("<b>No se encontraron créditos cedidos en la fecha</b>");
							}
							_API.onLoadAreaResultado(_qstr);
						}
					});
					resolve(null);
				} catch (err) {
					reject(err);
				}
			}
		);
	},

	onBridgeFile: function (_this) {
		var _mime = _this.attr("data-mime");
		var _params = { "key": _this.attr("data-path"), "file": _this.attr("data-fullfilename") };
		var _url = "/credipaz/archivourl";
		$(".areaArchivo").addClass("d-none");
		_API.call(_url, _params).then(function (data) {
			//var _fullmime = "";
			//if (!data.base64.includes("base64,")) { _fullmime = ("data:" + _mime + ";base64,"); }
			switch (_mime) {
				case "application/pdf":
					$(".areaArchivo").html("<embed type='" + _mime + "' src='" + data.url + "' style='height:850px;width:100%;'/>").removeClass("d-none");
					break;
				default:
					$(".areaArchivo").html("<embed type='" + _mime + "' src='" + data.url + "' style='height:100%;width:100%;'/>").removeClass("d-none");
					break;
			}
			/*
			switch (_mime) {
				case "application/pdf":
					$(".areaArchivo").html("<embed type='" + _mime + "' src='" + _fullmime + data.base64 + "' style='height:850px;width:100%;'/>").removeClass("d-none");
					break;
				default:
					$(".areaArchivo").html("<embed type='" + _mime + "' src='" + _fullmime + data.base64 + "' style='height:100%;width:100%;'/>").removeClass("d-none");
					break;
			}
			*/
			//$(".areaArchivo").html("<embed type='" + _mime + "' src='" + data.url + "' style='height:850px;width:100%;'/>").removeClass("d-none");
		});
	},

	onTraerCarpetaDigital: function (_this) {
		try {
			_API.onWait(true);
			_this.fadeOut("fast");
			var _params = { "idTransaccion": _this.attr("data-idtransaccion"), "nroDocumento": _this.attr("data-dni"), "segmento": _this.attr("data-segmento"), "idRequest": _this.attr("data-idrequest") };
			_API.call("/credipaz/carpetadigital", _params).then(function (data) {
				if (data.status != "OK") { throw data; }
				var _styleDiv = "width:100%;height:100%;";
				var _body = "";
				_body += "<div class='m-1 p-1 shadow' style='" + _styleDiv + "'>";
				_body += "   <div class='row'>";
				_body += "      <div class='col-2'>";
				_body += "         <ul class='list-group'>";
				var _color = "btn-primary";
				$.each(data.data, function (i, item) {
					_body += "<li class='mb-1 btn btn-sm " + _color + " btnBridgeFile' style='cursor:pointer;width:100%;font-size:0.75rem;' data-path='" + item.path + "' data-fullfilename='" + item.fullFilename + "' data-mime='" + item.mimeType + "' title='Fecha: " + item.created + " Tamaño: " + item.size + "'>";
					_body += item.filename;
					_body += "</li>";
					if (item.break != "") {
						_body += "<li class='list-group-item disabled'><i>Otros archivos...</i></li>";
						_color = "btn-warning";
					}
				});
				_body += "         </ul>";
				_body += "      </div>";
				_body += "      <div class='col-10 areaArchivo d-none'>";
				_body += "      </div>";
				_body += "   </div>";
				_body += "</div>";

				console.log(_body);
				_API.onShowModal("modalCarpetaDigital", "Carpeta digital", _body, "modal-xl")
					.then(function () {
						$(".btn-ok-modal").remove();
						_API.onWait(false);
						_this.fadeIn("slow");
					});
			});
		}
		catch (m) {
			alert(m.message);
			_API.onWait(false);
			_this.fadeIn("slow");
		}
	},
}