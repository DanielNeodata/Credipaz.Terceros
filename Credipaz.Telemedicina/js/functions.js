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
	onCancelTelemedicina: function (_this) {
		if (!confirm("Se cancelará la atención seleccionada. ¿Confirma?")) { return false; }
		_API.onWait(true);
		_API.method("/telemedicina/cancelar", { "Id": _this.attr("data-id") })
			.then(function (data) {
				_F.onMonitoreo(null);
				_API.onWait(false);
			}).catch(function (e) {
				_API.onWait(false);
			});
	},
	onBuildArea: function (iModo, _title) {
		_API.method("/telemedicina/monitoreo", { "iModo": iModo })
			.then(function (data) {
				var _html = "";
				if (data.records.length > 0) {
					var vHeaders = [];
					var vColumns = [];
					var vRules = [];
					switch (iModo) {
						case 1:
							vColumns = ["f_name_club_redondo", "f_elapsed", "especialidad"];
							break;
						case 2:
							vColumns = ["f_name_club_redondo", "f_doctor", "f_elapsed", "cancelar"];
							break;
						case 3:
							vColumns = ["f_name_club_redondo", "f_doctor", "f_elapsed"];
							break;
					}
					_html = _API.onBuildTable(("tblMonitoreo" + iModo), _title, data.records, vHeaders, vColumns, vRules, "", "");
				}
				$((".areaResultado-" + iModo)).html(_html);
			})
			.catch(function (retError) {
				_API.log("Se ha producido un error: " + retError.message);
			});
	},
	onMonitoreo: function (_this) {
		var _html = "";
		_html += "<div class='row'>";
		_html += "<div class='col-2 areaResultado-1 p-1 shadow-sm'></div>";
		_html += "<div class='col-5 areaResultado-2 p-1 shadow-sm'></div>";
		_html += "<div class='col-5 areaResultado-3 p-1 shadow-sm'></div>";
		_html += "</div>";
		$(".areaResultado").html(_html).removeClass("d-none");
		_F.onBuildArea(1, "En Espera");
		_F.onBuildArea(2, "Siendo atendidos");
		_F.onBuildArea(3, "Últimas atenciones");
	},
	onSupervision: function (_this) {
		_API.method("/telemedicina/supervision", {})
			.then(function (data) {
				var _html = "";
				if (data.records.length > 0) {
					var vHeaders = ["", "", "Creado", "Paciente", "Código", "Médico", "El paciente refiere", "Cierre"];
					var vColumns = ["btnEdit", "notas", "f_created", "f_name_club_redondo", "f_code", "f_doctor", "refiere", "f_type_task_close"];
					var vRules = [];
					_html = _API.onBuildTable(("tblSupervision"), "Supervisión", data.records, vHeaders, vColumns, vRules, "", "");
				}
				$(".areaResultado").html(_html).removeClass("d-none");
			})
			.catch(function (retError) {
				_API.log("Se ha producido un error: " + retError.message);
			});
	},
	onConsultas: function (_this) {
		_API.method("/telemedicina/consultas", { "idUser": _API.authentication.data.id })
			.then(function (data) {
				var _html = "";
				if (data.records.length > 0) {
					var vHeaders = ["", "", "Creado", "Paciente", "Código","", "Médico", "El paciente refiere", "Cierre"];
					var vColumns = ["btnEdit", "notas", "f_created", "f_name_club_redondo", "f_code", "enCurso", "f_doctor", "refiere", "f_type_task_close"];
					var vRules = [];
					_html = _API.onBuildTable(("tblConsultas"), "Consultas", data.records, vHeaders, vColumns, vRules, "", "");
				}
				$(".areaResultado").html(_html).removeClass("d-none");
			})
			.catch(function (retError) {
				_API.log("Se ha producido un error: " + retError.message);
			});
	},
	onPostClose: function (_this) {
		var _id = _this.attr("data-id");
		$.get((_API._ROOT + "/html/postclose.html?" + _API._TS), function (_html) {
			_API.onShowModal("modalPostClose", "", _html, "modal-lg").then(function (_ret) {

			})
		});
	},
	onEditChargeCode: function (_this) {
		var _id = _this.attr("data-id");
		$.get((_API._ROOT + "/html/editchargecode.html?" + _API._TS), function (_html) {
			_API.onShowModal("modalEditChargeCode", "", _html, "modal-xl").then(function (_ret) {

			})
		});

	},
}