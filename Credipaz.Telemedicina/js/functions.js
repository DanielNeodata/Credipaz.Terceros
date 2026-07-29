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
			});
	},
	onConsultas: function (_this) {
		_API.method("/telemedicina/consultas", { "idUser": _API.id_user_log })
			.then(function (data) {
				var _html = "";
				if (data.records.length > 0) {
					var vHeaders = ["", "", "Creado", "Paciente", "Código", "", "Médico", "El paciente refiere", "Cierre"];
					var vColumns = ["btnEdit", "notas", "f_created", "f_name_club_redondo", "f_code", "enCurso", "f_doctor", "refiere", "f_type_task_close"];
					var vRules = [];
					_html = _API.onBuildTable(("tblConsultas"), "Consultas", data.records, vHeaders, vColumns, vRules, "", "");
				}
				$(".areaResultado").html(_html).removeClass("d-none");
			});
	},
	onPostClose: function (_this) {
		var _id = _this.attr("data-id");
		$.get((_API._ROOT + "/html/postclose.html?" + _API._TS), function (_html) {
			_API.onShowModal("modalPostClose", "", _html, "modal-lg").then(function (_ret) {
				_API.method("/telemedicina/monitoreo", { "iModo": 4, "Id": _id })
					.then(function (data) {
						if (data.records[0].post_close != "") { $(".tNotasAnteriores").html("Notas anteriores:<br/>" + data.records[0].post_close); }
						$(".tPaciente").html(data.records[0].name_club_redondo);
						$(".tRefiere").html(data.records[0].refiere);
						$(".tMotivo").html(data.records[0].motivo);
						$(".tEvolucion").html(data.records[0].evolucion);
						$(".tDiagnostico").html(data.records[0].diagnostico);
						$(".tIndicaciones").html(data.records[0].indicaciones);
						var _eMed = "";
						_eMed = "<table class='table table-sm table-borderless'>";
						_eMed += "<tr style='font-weight:bold;'><td>Consulta</td><td>Emergencia</td><td>Especialista</td></tr>";
						_eMed += "<tr><td>" + _F.onResolveSiNo(data.records[0].derivado_consulta) + "</td><td>" + _F.onResolveSiNo(data.records[0].derivado_emergencia) + "</td><td>" + _F.onResolveSiNo(data.records[0].derivado_especialista) + "</td></tr>";
						_eMed += "</table>";
						$(".tDerivaciones").html(_eMed);
						$(".wfooter").remove();
						$(".btn-cancel-modal").attr("data-modal", "modalPostClose");
						$(".btnSaveNuevaNota").attr("data-modal", "modalPostClose");
						$(".btnSaveNuevaNota").attr("data-id", _id);
					});
			})
		});
	},
	onEditChargeCode: function (_this) {
		var _id = _this.attr("data-id");
		$.get((_API._ROOT + "/html/editchargecode.html?" + _API._TS), function (_html) {
			_API.onShowModal("modalEditChargeCode", "", _html, "modal-xl").then(function (_ret) {
				_API.method("/telemedicina/monitoreo", { "iModo": 4, "Id": _id })
					.then(function (data) {
						$(".wfooter").remove();
						$(".btn-cancel-modal").attr("data-modal", "modalEditChargeCode");
						$(".btnSaveAtencion").attr("data-modal", "modalEditChargeCode");
						$(".btnSaveAtencion").attr("data-id", _id);
						$(".btnVideo").attr("data-id", _id);
						$(".btnAmbulancia").attr("data-id", _id);
						$(".btnReceta").attr("data-id", _id);
						$(".btnOrden").attr("data-id", _id);
						$(".btnImagenes").attr("data-id", _id).attr("data-id_socio", data.records[0].idSocio);
						$(".btnRecetas").attr("data-id", _id).attr("data-id_socio", data.records[0].idSocio);
						$(".btnAtenciones").attr("data-id", _id).attr("data-id_socio", data.records[0].idSocio);
						if (parseInt(data.records[0].Empresa) == 999) {
							$(".esEmpleado").removeClass("d-none");
							$(".empresa").html("Empleado en CREDIPAZ");
						}
						$(".codigo").html(data.records[0].code);
						$(".especialidad").html(data.records[0].especialidad.replaceAll("_", " "));
						$(".tMotivo").html(data.records[0].motivo);
						$(".tEvolucion").html(data.records[0].evolucion);
						$(".tDiagnostico").html(data.records[0].diagnostico);
						$(".tIndicaciones").html(data.records[0].indicaciones);
						$(".tCierreIrregular").html(data.records[0].note_close);
						$(".tEmail").html(data.records[0].Email);
						$(".tTelefono").html(data.records[0].Telefono);
						$(".tEstado").css({ "background-color": "red" });
						if (data.records[0].Estado == "VIG") { $(".tEstado").css({ "background-color": "lightgreen" }); }
						$(".tEstado").html(data.records[0].Estado);
						$(".tObraSocial").html(data.records[0].ObraSocial);
						_F.onMicroOpt(".tblEvaluaciones", "temperatura", data.records[0].temperatura, "Temperatura");
						_F.onMicroOpt(".tblEvaluaciones", "ta_constatada", data.records[0].ta_constatada, "TA constatada");
						_F.onMicroOpt(".tblEvaluaciones", "tos", data.records[0].tos, "Tos");
						_F.onMicroOpt(".tblEvaluaciones", "expectoracion", data.records[0].expectoracion, "Expectoración");
						_F.onMicroOpt(".tblEvaluaciones", "odinofagia", data.records[0].odinofagia, "Odinofagia");
						_F.onMicroOpt(".tblEvaluaciones", "disfagia", data.records[0].disfagia, "Disfagia");
						_F.onMicroOpt(".tblEvaluaciones", "disnea", data.records[0].disnea, "Disnea");
						_F.onMicroOpt(".tblEvaluaciones", "nauseas", data.records[0].nauseas, "Nauseas");
						_F.onMicroOpt(".tblEvaluaciones", "vomitos", data.records[0].vomitos, "Vómitos");
						_F.onMicroOpt(".tblEvaluaciones", "dolor_abdominal", data.records[0].dolor_abdominal, "Dolor abdominal");
						_F.onMicroOpt(".tblEvaluaciones", "diarrea", data.records[0].diarrea, "Diarrea");
						_F.onMicroOpt(".tblEvaluaciones", "proctorragia", data.records[0].proctorragia, "Proctorragia");
						_F.onMicroOpt(".tblEvaluaciones", "disuria", data.records[0].disuria, "Disuria");
						_F.onMicroOpt(".tblEvaluaciones", "polaquiuria", data.records[0].polaquiuria, "Polaquiuria");
						_F.onMicroOpt(".tblEvaluaciones", "edemas", data.records[0].edemas, "Edemas");
						_F.onMicroOpt(".tblEvaluaciones", "parestesias", data.records[0].parestesias, "Parestesias");
						_F.onMicroOpt(".tblEvaluaciones", "calambres", data.records[0].calambres, "Calambres");
						_F.onMicroOpt(".tblEvaluaciones", "insensibilidad_miembro", data.records[0].insensibilidad_miembro, "Insensibilidad de un miembro");
						_F.onMicroOpt(".tblEvaluaciones", "cefaleas", data.records[0].cefaleas, "Cefaleas");
						_F.onMicroOpt(".tblEvaluaciones", "migrana_antecedente", data.records[0].migrana_antecedente, "Antecedente de migrañas");
						var _tmp = "<tr><td>Migraña medicada</td><td><input placeholder='Medicamento para la migraña' type='text' id='migrana_medicada' name='migrana_medicada' class='migrana_medicada form-control' value='" + data.records[0].migrana_medicada + "'/></td></tr>";
						$(".tblEvaluaciones").append(_tmp);
						_tmp = "<tr><td colspan='2'>Otras evaluaciones</td></tr><tr><td colspan='2'><textarea id='otras_evaluaciones' name='otras_evaluaciones' class='otras_evaluaciones form-control'>" + data.records[0].otras_evaluaciones + "</textarea></td></tr>";
						$(".tblEvaluaciones").append(_tmp);

						_F.onDrawAmbulance(data.records[0]["emergency_details"]);
						_F.onCheckFromValue(data.records[0].derivado_consulta, "#chkPresencial");
						_F.onCheckFromValue(data.records[0].derivado_especialista, "#chkEspecialista");
						_API.onLoadComboAjax("/telemedicina/tiposcierre", ".tCierre", data.records[0].type_task_close, "");

						_API.method("/asesores/socios/credenciales", { "Tipo": "SWISS", "NroDocumento": data.records[0].NroDocumento, "Sexo": data.records[0].Sexo })
							.then(function (data) {
								$.each(data.records, function (i, item) {
									$(".cboSwiss").append("<option data-record='" + _API.string_to_b64(JSON.stringify(item)) + "' value='" + item["IdSocio"] + "'>" + item["Nombre"] + "</option>");
								});
								$('.cboSwiss').find('option:first').prop('selected', true).change();
							});
					});
			})
		});
	},
	onSaveNuevaNota: function (_this) {
		if (!_API.tools.validate(".validatePostClose", false)) { return false; }
		var _id = _this.attr("data-id");
		_API.method("/telemedicina/postcierre", { "Id": _id, "Nota": $(".nuevaNota").val() })
			.then(function (data) {
				$(".btn-cancel-modal").click();
			});
	},
	onResolveSiNo: function (_str) {
		var _ret = "NO";
		if (_str == undefined || _str == "") { _str = 0; }
		_str = parseInt(_str);
		if (_str == 1) { _rt = "SI"; }
		return _ret;
	},
	onCheckFromValue: function (_value, _selector) {
		if (_value == undefined || _value == "") { _value = 0; }
		_value = parseInt(_value);
		$(_selector).prop("checked", (_value == 1));
	},
	onChangeTypeClose: function (_this) {
		var _val = _this.val();
		$(".areaCierreIrregular").addClass("d-none");
		if (_val != "") {
			switch (parseInt(_val)) {
				case 2:
				case 4:
					$(".areaCierreIrregular").removeClass("d-none");
					break;
			};
		};
	},
	onChangeCboSwiss: function (_this) {
		var _rec = JSON.parse(_API.b64_to_string($('.cboSwiss option:selected').attr("data-record")));
		$(".tNombre").html(_rec.Nombre);
		$(".tDocumento").html(_rec.NroDocumento);
		$(".tSexo").html(_rec.sexo);
		$(".tEdad").html(_rec.Edad);
		$(".tIdSocio").html(_rec.IdSocio);
		$(".tFechaAlta").html(_rec.FechaAlta);
		$(".tTipoSocio").html(_rec.Tipo);
		$(".tNumeroPlan").html(_rec.Plan);
		$(".tCredencialSwiss").html(_rec.NroCredencial);
	},
	onAmbulancia: function (_this) {
		var _id = _this.attr("data-id");
		$.get((_API._ROOT + "/html/ambulancia.html?" + _API._TS), function (_html) {
			_API.onShowModalOverAll("modalAmbulancia", "", _html).then(function (_ret) {
				$(".wfooter").remove();
				$(".btn-cancel-modalall").attr("data-modal", "modalAmbulancia");
				$(".btnSaveAmbulancia").attr("data-modal", "modalAmbulancia");
				$(".btnSaveAmbulancia").attr("data-id", _id);
				_API.onLoadComboAjax("/telemedicina/tiposemergencia", ".tEmergencia", "", "");
			})
		})
	},
	onSaveAmbulancia: function (_this) {
		if (!_API.tools.validate(".validateAmbulancia", false)) { return false; }
		var _id = _this.attr("data-id");
		_API.method("/telemedicina/solicitarambulancia", { "Id": _id, "Tipo": $(".tEmergencia").val(), "Nota": $(".tNota").val() })
			.then(function (data) {
				_F.onDrawAmbulance(data.records[0]["emergency_details"]);
				$(".btn-cancel-modalall").click();
			});

	},
	onDrawAmbulance: function (_str) {
		$(".btnAmbulancia").removeClass("d-none");
		if (_str != "") {
			$(".areaMessage").html(_str).removeClass("d-none");
			$(".btnAmbulancia").remove();
		}
	},
	onMicroOpt: function (_target, _id, _val, _title) {
		var _checked = "";
		var _html = "";
		_html += "<tr>";
		_html += "<td>" + _title + "</td>";
		_html += "<td>";
		if (_val == "1") { _checked = "checked"; } else { _checked = ""; }
		_html += "Si <input " + _checked + " type='radio' id='" + _id + "' name='" + _id + "' class='" + _id + "' value='1' style='height:20px;'/> | ";
		if (_val == "0") { _checked = "checked"; } else { _checked = ""; }
		_html += "No <input " + _checked + "  type='radio' id='" + _id + "' name='" + _id + "' class='" + _id + "' value='0' style='height:20px;'/> | ";
		if (_val == "-1" || _val == "") { _checked = "checked"; } else { _checked = ""; }
		_html += "No informa <input " + _checked + " type='radio' id='" + _id + "' name='" + _id + "' class='" + _id + "' value='-1' style='height:20px;'/>";
		_html += "</td>";
		_html += "</tr>";
		$(_target).append(_html);
	},
	onResolveItemStatusMedico: function (_field, _val) {
		switch (String(_val)) {
			case "0":
				return "<li style='display:inline;padding:3px;border:solid 1px pink;'>" + _field + ": <b>NO</b></li>";
			case "1":
				return "<li style='display:inline;padding:3px;border:solid 1px lightgreen;'>" + _field + ": <b>Si</b></li>";
			case "":
			case "null":
			case "-1":
				return "";
			default:
				return "<li style='display:inline;padding:3px;border:solid 1px silver;'>" + _field + ": <b>" + _val + "</b></li>";
		}
	},

	onImagenes: function (_this) {
		_API.method("/telemedicina/mensajes", { "idChargeCode": _this.attr("data-id"), "idTypeDirection": 1, "idTypeItem": 1 })
			.then(function (data) {
				var _html = "<ul class='list-group'>";
				$.each(data.records, function (i, item) {
					var _rec = _API.string_to_b64(JSON.stringify(item));
					_html += "<li data-mode='edit' class='btnVerImagen shadow list-group-item list-group-item-light p-1 m-0' style='width:100%;cursor:pointer;text-align:left;' data-item='" + _rec + "'>";
					_html += "<p>Imagen " + item.fcreated + "</p>";
					_html += "</li>";
				});
				_html += "</ul>";
				$(".areaImagenes").html(_html);
			});
	},
	onVerImagen: function (_this) {
		try {
			var _json = JSON.parse(_API.b64_to_string(_this.attr("data-item")));
			var _raw_data = JSON.parse(_rec.raw_data);
			var _sep = ",";
			if (_raw_data.mime.slice(-1) == ",") { _sep = ""; }
			var _imgUrl = (_raw_data.mime + _sep + _raw_data.base64);
			var _html = "<div class='shadow mb-2'>";
			_html += "<span class='badge badge-primary'>" + _json.message + "</span><br/><img src='" + _imgUrl + "' style='width:100%;'/>";
			_html += "</div>";
			_html += "<center><a href='#' data-modal='' class='btn btn-sm btn-secondary btn-cancel-modalall'>Cerrar</a></center>";
			_API.onShowModalOverAll("modalImagen", "", _html).then(function (_ret) {
				$(".wfooter").remove();
				$(".btn-cancel-modalall").attr("data-modal", "modalImagen");
			});
			return true;
		} catch (rex) {
			alert(rex.message);
			return false;
		}
	},
	onRecetas: function (_this) {
		_API.method("/telemedicina/mensajes", { "idChargeCode": _this.attr("data-id"), "idTypeDirection": 2, "idTypeItem": 2 })
			.then(function (data) {
				var _html = "<ul class='list-group'>";
				$.each(data.records, function (i, item) {
					var _isPDF = (item.type_media == "pdf");
					var _rec = _API.string_to_b64(JSON.stringify(item));
					_html += "<li data-mode='edit' class='btnVerReceta shadow list-group-item list-group-item-light p-1 m-0' style='width:100%;cursor:pointer;text-align:left;' data-item='" + _rec + "'>";
					var _tipo = "Orden";
					if (_isPDF) { _tipo = "Receta"; }
					_html += "<p><b>" + _tipo + " emitida el: </b> " +  item.fcreated + "</p>";
					_html += "</li>";
				});
				_html += "</ul>";
				$(".areaRecetas").html(_html);
			});
	},
	onVerReceta: function (_this) {
		try {
			var _bFill = false;
			var _json = JSON.parse(_API.b64_to_string(_this.attr("data-item")));
			var _raw_data = JSON.parse(_json.raw_data);
			var _isPDF = (_json.type_media == "pdf");
			var _html = "<div class='shadow mb-2 p-1'>";
			if (_isPDF) { 
				_html += "<iframe src='" + _json.message + "' style='border:solid 0px red;height:640px;width:100%;'></iframe>";
			} else {
				_bFill = true;
				_html += _json.message;
			}
			_html += "</div>";
			_html += "<center><a href='#' data-modal='' class='btn btn-sm btn-secondary btn-cancel-modalall'>Cerrar</a></center>";
			_API.onShowModalOverAll("modalReceta", "", _html).then(function (_ret) {
				$("#modalReceta").css({
					"width": "1024px", "height": "768px",
					"position":"absolute","z-index":999999,"top":"50%","left":"50%","transform":"translate(-50%, -50%)"
				});
				$(".wfooter").remove();
				$(".btn-cancel-modalall").attr("data-modal", "modalReceta");
				if (_bFill) {
					$("#obra_social").val(_raw_data.obra_social).prop('disabled', true).css({ "background-color": "white", "height": "25px" });
					$("#nro_obra_social").val(_raw_data.nro_obra_social).prop('disabled', true).css({ "background-color": "white", "height": "25px" });
					$("#obra_social").parent().css({ "width": "33%", "padding": "10px" }).html("Obra social: <br/>" + _raw_data.obra_social);
					$("#obra_social_plan").parent().css({ "width": "33%", "padding": "10px" }).html("Plan: <br/>" + _raw_data.obra_social_plan);
					$("#nro_obra_social").parent().css({ "width": "33%", "padding": "10px" }).html("Nº afiliado: <br/>" + _raw_data.nro_obra_social);
					$("#medicamento_1").val(_raw_data.medicamento1).prop('disabled', true).css("background-color", "white");
					$("#medicamento_2").val(_raw_data.medicamento2).prop('disabled', true).css("background-color", "white");
					$("#medicamento_3").val(_raw_data.medicamento3).prop('disabled', true).css("background-color", "white");
					try {
						var _height = (document.getElementById("indicacion").scrollHeight + 75);
						$("#indicacion").val(_raw_data.indicacion).prop('disabled', true).css({ "background-color": "white", "width": "85%", "height": + _height + "px", "overflow": "hidden" });
					} catch (rex) { }
				}
			});
			return true;
		} catch (rex) {
			alert(rex.message);
			return false;
		}
	},
	onAtenciones: function (_this) {
		_API.method("/telemedicina/atencionesanteriores", { "idSocio": _this.attr("data-id_socio") })
			.then(function (data) {
				var _html = "<ul class='list-group'>";
				$.each(data.records, function (i, item) {
					var _rec = _API.string_to_b64(JSON.stringify(item));
					_html += "<li data-mode='edit' class='btnVerAtencionPrevia shadow list-group-item list-group-item-light p-1 m-0' style='width:100%;cursor:pointer;text-align:left;' data-item='" + _rec + "'>";
					_html += "     <table style='width:100%;'>";
					_html += "        <tr>";
					var _d = item.created.split("T");
					_html += "           <td style='width:100%;font-weight:bold;'>Atención del día " + _d[0] + " " + _d[1] + "</td> <td style='width:30px;'><span class='material-symbols-outlined' style='color:blue;'>info</span></td>";
					_html += "        </tr>";
					if (item.indicaciones == null) { item.indicaciones = "Ninguna"; }
					_html += "        <tr>";
					_html += "           <td style='width:100%;'>Indicación: " + item.indicaciones + "</td>";
					_html += "        </tr>";
					_html += "     </table>";
					_html += "   </li>";
				});
				_html += "</ul>";
				$(".areaAtenciones").html(_html);
			});
	},
	onVerAtencionPrevia: function (_this) {
		try {
			var _json = JSON.parse(_API.b64_to_string(_this.attr("data-item")));
			var _html = "<table class='table table-sm table-borderless table-condensed'>";
			_html += "<tr>";
			_html += "   <td valign='top'>";
			if (String(_json.refiere) == "null") { _json.refiere = ""; }
			_html += "      <h5><b>El paciente refiere:</b></h5><p>" + _json.refiere + "</p>";
			if (String(_json.motivo) == "null") { _json.motivo = ""; }
			_html += "		<h5><b>Motivo:</b></h5><p>" + _json.motivo + "</p>";
			if (String(_json.evolucion) == "null") { _json.evolucion = ""; }
			_html += "		<h5><b>Evolución:</b></h5><p> " + _json.evolucion + "</p>";
			if (String(_json.diagnostico) == "null") { _json.diagnostico = ""; }
			_html += "		<h5><b>Diagnóstico:</b></h5><p> " + _json.diagnostico + "</p>";
			if (String(_json.indicaciones) == "null") { _json.indicaciones = ""; }
			_html += "		<h5><b>Indicaciones:</b></h5><p> " + _json.indicaciones + "</p>";
			_html += "		<h5><b>Evaluación médica</b></h5>";
			_html += "         <ul style='padding:0px;margin:0px;'>";
			_html += _F.onResolveItemStatusMedico("Temperatura", _json.temperatura);
			_html += _F.onResolveItemStatusMedico("Tos", _json.tos);
			_html += _F.onResolveItemStatusMedico("Expectoración", _json.expectoracion);
			_html += _F.onResolveItemStatusMedico("Odinofagia", _json.odinofagia);
			_html += _F.onResolveItemStatusMedico("Disfagia", _json.disfagia);
			_html += "         </ul>";
			_html += "         <ul style='padding:0px;margin:0px;'>";
			_html += _F.onResolveItemStatusMedico("Disnea", _json.disnea);
			_html += _F.onResolveItemStatusMedico("Náuseas", _json.nauseas);
			_html += _F.onResolveItemStatusMedico("Vómitos", _json.vomitos);
			_html += _F.onResolveItemStatusMedico("Dolor abdominal", _json.dolor_abdominal);
			_html += _F.onResolveItemStatusMedico("Diarrea", _json.diarrea);
			_html += "         </ul>";
			_html += "         <ul style='padding:0px;margin:0px;'>";
			_html += _F.onResolveItemStatusMedico("Proctorragia", _json.proctorragia);
			_html += _F.onResolveItemStatusMedico("Disuria", _json.disuria);
			_html += _F.onResolveItemStatusMedico("Polaquiuria", _json.polaquiuria);
			_html += _F.onResolveItemStatusMedico("Edemas", _json.edemas);
			_html += _F.onResolveItemStatusMedico("Parestesias", _json.parestesias);
			_html += "         </ul>";
			_html += "         <ul style='padding:0px;margin:0px;'>";
			_html += _F.onResolveItemStatusMedico("Calambres", _json.calambres);
			_html += _F.onResolveItemStatusMedico("Insensibilidad miembro", _json.insensibilidad_miembro);
			_html += _F.onResolveItemStatusMedico("Cefaleas", _json.cefaleas);
			_html += _F.onResolveItemStatusMedico("Migraña antecedente", _json.migrana_antecedente);
			_html += _F.onResolveItemStatusMedico("Migraña medicada", _json.migrana_medicada);
			_html += "         </ul>";
			_html += "         <ul style='padding:0px;margin:0px;'>";
			_html += _F.onResolveItemStatusMedico("TA constatada", _json.ta_constatada);
			_html += _F.onResolveItemStatusMedico("Derivado consulta", _json.derivado_consulta);
			_html += _F.onResolveItemStatusMedico("Derivado especialista", _json.derivado_especialista);
			_html += "         </ul>";
			if (String(_json.post_close) == "null") { _json.post_close = ""; }
			_html += "		<h5><b>Notas post cierre:</b></h5><p style='padding:5px;border:dotted 2px silver;'> " + _json.post_close + "</p>";
			_html += "      </td>";
			_html += "   </tr>";
			_html += "</table>";
			_html += "<center><a href='#' data-modal='' class='btn btn-sm btn-secondary btn-cancel-modalall'>Cerrar</a></center>";
			_API.onShowModalOverAll("modalAtencionAnterior", "", _html).then(function (_ret) {
				$(".wfooter").remove();
				$(".btn-cancel-modalall").attr("data-modal", "modalAtencionAnterior");
			});
			return true;
		} catch (rex) {
			alert(rex.message);
			return false;
		}
	},
}
