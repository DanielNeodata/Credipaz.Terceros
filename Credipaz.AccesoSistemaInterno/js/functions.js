/* Objeto con todas las funciones de la rama */
var _F = {
	_esperando: 0,
	_interfaceActiva: "",
	_logo_receta_left: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTA0LTI5VDE4OjAwOjM2LTAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wNS0wNFQxMTo0NToyOS0wMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNS0wNFQxMTo0NToyOS0wMzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjYTEwZmJkZS03MWQzLWM1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",

	/* FUNCION DE INICIALIZACION */
	onInit: function () {
		return new Promise(
			function (resolve, reject) {
				try {
					if (_API.doctorRequired && _API.telemedicina.isDoctor != 1) {
						_API.onShowUnauthorized("El usuario autenticado no es un médico.");
						reject(null);
					} else {
						$("body").load((_API._ROOT + "/html/index.html?" + _API._TS), function () {
							_API.inited = true;
							$(".logoImage").attr("src", _API.imageLogin);
							$(".badgeUsername").html(_API.username_log);
							$(".badgeSucursal").html(_API.sucursal);
							$(".areaStatus").removeClass("blink");
							clearInterval(_API._TIMER_ALERT);
							setTimeout(function () { _F.onEstadoColaAtencion(); }, 1000);
							_API._TIMER_ALERT = setInterval(function () { _F.onEstadoColaAtencion(); }, 10000);
							_F.onDrawStatusDoctor();
							_API.onMenuIntranet(".areaMenu");
							resolve(null);
						});
					}
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

	/* FUNCIONES IMPLEMENTADAS */
	onMonitoreo: function (_this) {
		_F._interfaceActiva = "monitoreo";
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
		_F._interfaceActiva = "supervision";
		_API.method("/telemedicina/supervision", {})
			.then(function (data) {
				var _html = "";
				if (data.records.length > 0) {
					var vHeaders = ["", "", "Creado", "Paciente", "Código", "Médico", "El paciente refiere", "Cierre"];
					var vColumns = ["btnEdit", "notas", "f_created", "f_name_club_redondo", "f_code", "f_doctor", "refiere", "f_type_task_close"];
					var vRules = [];
					_html = _API.onBuildTable(("tblSupervision"), "Supervisión", data.records, vHeaders, vColumns, vRules, "", "", "");
				} else {
					_html = _API.onNoTablaForTable("");
				}
				$(".areaResultado").html(_html).removeClass("d-none");
			});
	},
	onConsultas: function (_this) {
		_F._interfaceActiva = "consultas";
		_API.method("/telemedicina/consultas", { "idUser": _API.id_user_log })
			.then(function (data) {
				var _html = "";
				if (data.records.length > 0) {
					var vHeaders = ["", "", "Creado", "Paciente", "Código", "", "Médico", "El paciente refiere", "Cierre"];
					var vColumns = ["btnEdit", "notas", "f_created", "f_name_club_redondo", "f_code", "enCurso", "f_doctor", "refiere", "f_type_task_close"];
					var vRules = [];
					var _preHeader = "<div class='container-full my-2 p-2 shadow-sm' style='border-radius:5px;border:solid 1px gainsboro;'>";
					_preHeader += "      <div class='row'>";
					_preHeader += "         <div class='col-2'><label>DNI</label><br/><input type='number' placeholder='DNI' class='form-control onlyNumbers dniEspontanea' name='dniEspontanea' id='dniEspontanea'/></div>";
					_preHeader += "         <div class='col-2'><label>Socio Mediya</label><br/><input type='number' placeholder='Nºde socio' class='form-control onlyNumbers nroSocioEspontanea' name='nroSocioEspontanea' id='nroSocioEspontanea'/></div>";
					_preHeader += "         <div class='col-2 mt-2 pt-4'><a href='#' class='btn btn-primary btn-md btnEspontanea'>Espontánea</a></div>";

					_preHeader += "      </div>";
					_preHeader += "   </div>";
					_html = _API.onBuildTable(("tblConsultas"), "Consultas", data.records, vHeaders, vColumns, vRules, "", "", _preHeader);
				} else {
					_html = _API.onNoTablaForTable("");
				}
				$(".areaResultado").html(_html).removeClass("d-none");
			});
	},
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
		_API.method("/telemedicina/monitoreo", { "iModo": iModo, "idUser": _API.id_user_log })
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
					_html = _API.onBuildTable(("tblMonitoreo" + iModo), _title, data.records, vHeaders, vColumns, vRules, "", "", "");
				} else {
					_html = _API.onNoTablaForTable("");
				}
				$((".areaResultado-" + iModo)).html(_html);
			});
	},
	onPostClose: function (_this) {
		var _id = _this.attr("data-id");
		$.get((_API._ROOT + "/html/postclose.html?" + _API._TS), function (_html) {
			_API.onShowModal("modalPostClose", "", _html, "modal-lg").then(function (_ret) {
				_API.method("/telemedicina/monitoreo", { "iModo": 4, "Id": _id, "idUser": _API.id_user_log })
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
				_API.method("/telemedicina/monitoreo", { "iModo": 4, "Id": _id, "idUser": _API.id_user_log })
					.then(function (data) {
						$(".wfooter").remove();
						$(".btn-cancel-modal").attr("data-modal", "modalEditChargeCode");
						$(".btnGrabarAtencion").attr("data-modal", "modalEditChargeCode");
						$(".btnGrabarAtencion").attr("data-id", _id);
						$(".btnAddItems").attr("data-id", _id);

						$(".btnBuildOrden").attr("data-id-type-item", 2);
						$(".btnBuildOrden").attr("data-id-charge-code", data.records[0].id_charges_codes);
						$(".btnBuildOrden").attr("data-nombre_paciente", data.records[0].Nombre);
						$(".btnBuildOrden").attr("data-nro_documento", data.records[0].NroDocumento);
						$(".btnBuildOrden").attr("data-nro_club_redondo", data.records[0].idSocio);
						$(".btnBuildOrden").attr("data-nro_swiss", data.records[0].NroCredencial);
						$(".btnBuildOrden").attr("data-obra_social", data.records[0].ObraSocial);
						$(".btnBuildOrden").attr("data-obra_social_plan", data.records[0].Plan);
						$(".btnBuildOrden").attr("data-nro_obra_social", data.records[0].NroCredencial);
						$(".btnBuildOrden").attr("data-matricula", _API.telemedicina.doctorMatricula);
						$(".btnBuildOrden").attr("data-medico", _API.telemedicina.doctorName);
						$(".btnBuildOrden").attr("data-firma", _API.telemedicina.doctorFirma);

						$(".btnBuildReceta").attr("data-id-type-item", 2);
						$(".btnBuildReceta").attr("data-id-charge-code", data.records[0].id_charges_codes);
						$(".btnBuildReceta").attr("data-fechanacimiento", data.records[0].FechaNacimiento);
						$(".btnBuildReceta").attr("data-nombre", data.records[0].NombreSocio);
						$(".btnBuildReceta").attr("data-apellido", data.records[0].ApellidoSocio);
						$(".btnBuildReceta").attr("data-dni", data.records[0].NroDocumento);
						$(".btnBuildReceta").attr("data-sexo", data.records[0].Sexo);
						$(".btnBuildReceta").attr("data-panswiss", data.records[0].NroCredencial);

						$(".btnVideo").attr("data-token", data.records[0].dataToken);
						$(".btnVideo").attr("data-alias", _API.username_log);
						$(".btnVideo").attr("data-full-name", _API.username_log);
						$(".btnVideo").attr("data-room-name", data.records[0].dataChatRoom);
						$(".btnVideo").attr("data-domain", _API.configuration.videoDataDomain);

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

						//EVALUAR DESDE ACA PORQUE NO CARGA COMBO PARA RESOLVER SOCIO!
						var _pCred = { "Tipo": "SWISS", "NroDocumento": data.records[0].NroDocumento, "Sexo": data.records[0].Sexo };
						_API.method("/asesores/socios/credenciales", _pCred)
							.then(function (data) {
								$.each(data.records, function (i, item) {
									$(".cboSwiss").append("<option data-record='" + _API.tools.string_to_b64(JSON.stringify(item)) + "' value='" + item["IdSocio"] + "'>" + item["Nombre"] + "</option>");
								});
								$('.cboSwiss').find('option:first').prop('selected', true).change();
							});

						switch (_F._interfaceActiva) {
							case "supervision":
								$(".btnGrabarAtencion").remove();
								$(".btn-cancel-modal").html("Cerrar").addClass("btn-primary");
								$('#modalEditChargeCode :input').prop('disabled', true);
								$('#modalEditChargeCode :select').prop('disabled', true);
								break;
						}
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
		var _rec = JSON.parse(_API.tools.b64_to_string($('.cboSwiss option:selected').attr("data-record")));
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
	onBuildOrden: function (_this) {
		var _id_type_item = parseInt(_this.attr("data-id-type-item"));
		var _id_charge_code = parseInt(_this.attr("data-id-charge-code"));
		var _nombre_paciente = _this.attr("data-nombre_paciente");
		var _nro_documento = _this.attr("data-nro_documento");
		var _nro_club_redondo = _this.attr("data-nro_club_redondo");
		var _nro_swiss = _this.attr("data-nro_swiss");
		var _matricula = _this.attr("data-matricula");
		var _medico = _this.attr("data-medico");
		var _firma = _this.attr("data-firma");
		var _obra_social = _this.attr("data-obra_social");
		var _obra_social_plan = _this.attr("data-obra_social_plan");
		var _nro_obra_social = _this.attr("data-nro_obra_social");
		var _body = "";
		_body += "<div id='message' name='message' class='shadow message p-2' style='width:100%;'>";
		_body += '<table width="100%">';
		_body += '   <tr>';
		_body += '      <td align="left"><img src="' + _F._logo_receta_left + '" width="60"/></td>';
		_body += '      <td align="center" valign="middle" style="font-size:1.75em;color:rgb(43, 135, 201);">Servicio de Telemedicina</td>';
		_body += '      <td align="right"></td>';
		_body += '   </tr>';
		_body += '   <tr><td colspan="3" style="border-top:solid 2px rgb(43, 135, 201);"></td></tr>';
		_body += '</table > ';
		_body += "<br/>";
		_body += "<table width='100%'>";
		_body += "   <tr><td>Fecha de emisión</td><td align='right'>" + _API.tools.getNow() + "</td></tr>";
		_body += "   <tr><td>RX</td><td align='right'><b>ORIGINAL</b></td></tr>";
		_body += "   <tr><td>Paciente</td><td align='right' class='nombrepaciente editable' contenteditable style='font-weight:bold;border-bottom:dotted 1px silver;'><b>" + _nombre_paciente + "</b></td></tr>";
		_body += "   <tr><td>Nº de documento</td><td align='right' class='documentopaciente editable' contenteditable style='font-weight:bold;border-bottom:dotted 1px silver;'><b>" + _nro_documento + "</b></td></tr>";
		_body += "</table>";
		_body += "<table class='table table-condensed table-borderless table-sm' style='border:solid 1px grey;'>";
		_body += "   <tr>";
		_body += "      <td>Obra social: <input style='border:solid 0px white;border-right:solid 1px grey;border-bottom:solid 1px grey;width:100%;' type='text' class='shadow text obra_social' id='obra_social' name='obra_social' data-default='" + _obra_social + "' value='" + _obra_social + "'/></td>";;
		_body += "      <td>Plan: <input style='border:solid 0px white;border-right:solid 1px grey;border-bottom:solid 1px grey;width:100%;' type='text' class='shadow text obra_social_plan' id='obra_social_plan' name='obra_social_plan' data-default='" + _obra_social_plan + "' value='" + _obra_social_plan + "'/></td>";
		_body += "      <td>Nº de afiliado: <input style='border:solid 0px white;border-right:solid 1px grey;border-bottom:solid 1px grey;width:100%;' type='text' class='shadow text nro_obra_social' id='nro_obra_social' name='nro_obra_social' data-default='" + _nro_obra_social + "' value='" + _nro_obra_social + "'/>";
		_body += "   </tr>";
		_body += "</table>";
		_body += "<table style='width:100%' class='noshare autofill mt-2'>";
		_body += "   <tr>";
		_body += "      <td align='center'><a href='#' class='btn btn-raised btn-sm btn-primary btnCambiarDatosOrden' data-number='" + _nro_swiss + "' data-plan='LIFE' data-os='SWISS MEDICAL'>Datos Swiss</a></td>";
		_body += "      <td align='center'><a href='#' class='btn btn-raised btn-sm btn-primary btnCambiarDatosOrden' data-number='" + _nro_club_redondo + "' data-plan='' data-os='CLUB REDONDO'>Datos Mediya</a></td>";
		_body += "      <td align='center'><a href='#' class='btn btn-raised btn-sm btn-secondary btnCambiarDatosOrden' data-number='' data-plan='' data-os=''>Limpiar</a></td>";
		_body += "   </tr>";
		_body += "</table>";
		_body += "<h4 class='noshare'></h4>"
		_body += "<p class='pIndicacion'></p>";
		_body += "<table width='100%'>";
		_body += "   <tr><td align='left'><textarea class='form-control indicacion' rows='11' id='indicacion' name='indicacion' placeholder='Escriba aquí notas relacionadas con la receta'></textarea></td></tr>";
		_body += "</table>";
		_body += "<hr/>";
		_body += "<table width='100%'>";
		_body += "   <tr>";
		_body += "      <td align='center'>";
		if (_firma != "") { _body += "<img src='" + _firma + "' height='120'/>"; }
		_body += "      </td>";
		_body += "      <td align='left'>";
		_body += "         <table valign='middle'>";
		_body += "            <tr><td align='left'>Dr./Dra. <b>" + _medico + "</b></td></tr>";
		_body += "            <tr><td align='left'>Matrícula <b>" + _matricula + "</b></td></tr>";
		_body += "         </table>";
		_body += "      </td>";
		_body += "   </tr>";
		_body += "   <tr>";
		_body += "      <td align='center' colspan='2' >";
		_body += "         <b>Indicación / Orden</b>";
		_body += "      </td>";
		_body += "   </tr>";
		_body += "</table>";
		_body += "</div> ";
		_body += "<hr/>";
		_body += "<table width='100%'>";
		_body += "   <tr>";
		_body += "      <td align='center' width='25%'>";
		_body += "         <input style='height:20px;' id='carbon_copy' name='carbon_copy' type='checkbox' class='form-control check carbon_copy' value='1'/>¿Generar copia?";
		_body += "      </td>";
		_body += "      <td align='right' width='75%'>";
		_body += "         <a href='#' class='btn btn-danger btn-sm btn-cancel-modalall'>Cerrar</a>";
		_body += "         <a href='#' class='btn btn-md btn-success btnGrabarOrdenMedica' data-iface='receta' data-id-charge-code='" + _id_charge_code + "' data-id-type-item='" + _id_type_item + "' data-id-type-direction='2'>Grabar</a>";
		_body += "      </td>";
		_body += "   </tr>";
		_body += "</table>";
		_API.onShowModalOverAll("modalOrden", "", _body).then(function (_ret) {
			$(".wfooter").remove();
			$(".btn-cancel-modalall").attr("data-modal", "modalOrden");
		});
	},
	onBuildReceta: function (_this) {
		_API.onWait(true);
		var _id_type_item = parseInt(_this.attr("data-id-type-item"));
		var _id_charge_code = parseInt(_this.attr("data-id-charge-code"));
		var _fnac = _this.attr("data-fechanacimiento");
		var _arr = _fnac.split("/");
		_fnac = (_arr[2] + "-" + _arr[1] + "-" + _arr[0]);
		var _params = {
			"dni": _this.attr("data-dni"),
			"nombre": _this.attr("data-nombre"),
			"apellido": _this.attr("data-apellido"),
			"sexo": _this.attr("data-sexo"),
			"fechaNacimiento": _fnac,
			"panswiss": _this.attr("data-panswiss"),
			"idChargeCode": _id_charge_code,
			"idUser": _API.id_user_log
		}
		_API.method("/telemedicina/farmalinkreceta", _params).then(function (response) {
			if (response.url != null) {
				var _html = "<div class='container-full'>";
				_html += "    <div style='position:absolute;left:100px;top:12px;z-index:999999;'>";
				_html += "       <span class='badge badge-success'>Adjunte el PDF generado:</span>";
				_html += "       <input data-id-charge-code='" + _id_charge_code + "' class='btnUploadReceta btn btn-dark' type='file' id='pdfFile' name='pdfFile' accept='application/pdf'>";
				_html += "    </div>";
				_html += "    <button type='button' data-modal='' class='close btn-cancel-modalall' style='color:red;font-size:42px;position:absolute;right:15px;top:2px;z-index:9999999;'>&times;</button>";
				_html += "    <div class='modal-body p-0 m-0'>";
				_html += "       <iframe src='" + response.url + "' style='width:100%;height:1000px;border:solid 0px red;'></iframe>"
				_html += "    </div>";
				_html += "</div>";
				_API.onShowModalOverAll("modalFarmalink", "", _html).then(function (_ret) {
					$(".wfooter").remove();
					$(".btn-cancel-modalall").attr("data-modal", "modalFarmalink");
					$("#modalFarmalink").attr("style", "position:absolute;z-index:999999;top:0px;left:0px;width:100%;-webkit-transform:translate(0%,0%);transform:translate(0%,0%);");
					_API.onWait(false);
				});
			} else {
				var _j = JSON.parse(response.validation);
				alert("No se ha podido acceder a la plataforma externa de emisión de recetas. " + _j[0]["errorMessage"]);
				_API.onWait(false);
			}
		}).catch(function (err) {
			alert("No se ha podido acceder a la plataforma externa de emisión de recetas. Error de gateway externo.");
			_API.onWait(false);
		});
	},
	onImagenes: function (_this) {
		_API.method("/telemedicina/mensajes", { "idChargeCode": _this.attr("data-id"), "idTypeDirection": 1, "idTypeItem": 1 })
			.then(function (data) {
				var _html = "<ul class='list-group'>";
				$.each(data.records, function (i, item) {
					var _rec = _API.tools.string_to_b64(JSON.stringify(item));
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
			var _json = JSON.parse(_API.tools.b64_to_string(_this.attr("data-item")));
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
					var _rec = _API.tools.string_to_b64(JSON.stringify(item));
					_html += "<li data-mode='edit' class='btnVerReceta shadow list-group-item list-group-item-light p-1 m-0' style='width:100%;cursor:pointer;text-align:left;' data-item='" + _rec + "'>";
					var _tipo = "Orden";
					if (_isPDF) { _tipo = "Receta"; }
					_html += "<p><b>" + _tipo + " emitida el: </b> " + item.fcreated + "</p>";
					_html += "</li>";
				});
				_html += "</ul>";
				$(".areaRecetas").html(_html);
			});
	},
	onVerReceta: function (_this) {
		try {
			var _bFill = false;
			var _json = JSON.parse(_API.tools.b64_to_string(_this.attr("data-item")));
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
					"position": "absolute", "z-index": 999999, "top": "50%", "left": "50%", "transform": "translate(-50%, -50%)"
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
					var _rec = _API.tools.string_to_b64(JSON.stringify(item));
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
			var _json = JSON.parse(_API.tools.b64_to_string(_this.attr("data-item")));
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
	onCambiarDatosOrden: function (_this) {
		$(".obra_social").val(_this.attr("data-os"));
		$(".obra_social_plan").val(_this.attr("data-plan"))
		$(".nro_obra_social").val(_this.attr("data-number"));
	},
	onEspontanea: function (_this) {
		var _dni = $(".dniEspontanea").val();
		var _idSocio = $(".nroSocioEspontanea").val();
		if (_dni == "" && _idSocio == "") { alert("Debe indicar DNI o Nºde socio"); return false; }
		_API.onWait(true);
		var _params = {
			"dni": _dni,
			"idSocio": _idSocio,
			"idUser": _API.id_user_log
		}
		_API.method("/telemedicina/atencionespontanea", _params).then(function (response) {
			_API.log("atencionespontanea_>", response);
			$(".shadowInput").attr("data-id", response.records[0]["id_ot"]);
			_API.onWait(false);
			_F.onEditChargeCode($(".shadowInput"));
		}).catch(function (err) {
			alert("No se ha podido procesar la atención espontánea.");
			_API.onWait(false);
		});
	},
	onGrabarOrdenMedica: function (_this) {
		var _indicacion = $("#indicacion").val();
		var _iface = _this.attr("data-iface");
		var _obra_social = $("#obra_social").val();
		var _obra_social_plan = $("#obra_social_plan").val();
		var _nro_obra_social = $("#nro_obra_social").val();
		var _carbon_copy = 0;
		if ($("#carbon_copy").prop("checked")) { _carbon_copy = 1; }
		if (_indicacion == "") {
			alert("No ha escrito orden o indicación.  Por favor complete los datos.");
			return false;
		}
		$(".rx-hidden").fadeIn("fast");
		$(".btnGrabarOrdenMedica").fadeOut("fast");
		$(".editable").attr("contenteditable", false);
		$(".pIndicacion").html(_indicacion);
		$("#indicacion").remove();

		var _raw_data = {
			"obra_social": _obra_social,
			"obra_social_plan": _obra_social_plan,
			"nro_obra_social": _nro_obra_social,
			"indicacion": _indicacion
		};
		$(".attach").each(function () { _raw_data = _this.attr("data-url"); });
		$(".autofill").remove();
		var _message = $("#message").html();
		var _params = {
			"carbonCopy": _carbon_copy,
			"Message": _message,
			"Raw_data": JSON.stringify(_raw_data),
			"idChargeCode": _this.attr("data-id-charge-code"),
			"idUser": _API.id_user_log
		};
		_API.method("/telemedicina/grabarordenmedica", _params).then(function (response) {
			if (response.estado == "OK") {
				alert("¡El mensaje ha sido enviado!");
				$(".btn-cancel-modalall").click();
			} else {
				alert(response.message);
				$(".btnGrabarOrdenMedica").fadeIn("fast");
			}
		}).catch(function (error) { alert(error.message); });
	},
	onGrabarAtencion: function (_this) {
		_API.onWait(true);
		var _idTypeClose = $(".tCierre").val();
		var _dPresencial = 0;
		if ($(".chkPresencial").prop("checked")) { _dPresencial = 1; }
		var _dEspecialista = 0;
		if ($(".chkEspecialista").prop("checked")) { _dEspecialista = 1; }
		var _params = {
			"idUser": _API.id_user_log,
			"idOperatorTask": _this.attr("data-id"),
			"motivo": $(".tMotivo").val(),
			"evolucion": $(".tEvolucion").val(),
			"diagnostico": $(".tDiagnostico").val(),
			"indicaciones": $(".tIndicaciones").val(),
			"derivado_consulta": _dPresencial,
			"derivado_especialista": _dEspecialista,
			"note_close": $(".tCierreIrregular").val(),
			"temperatura": $('input[name="temperatura"]:checked').val(),
			"tos": $('input[name="tos"]:checked').val(),
			"expectoracion": $('input[name="expectoracion"]:checked').val(),
			"odinofagia": $('input[name="odinofagia"]:checked').val(),
			"disfagia": $('input[name="disfagia"]:checked').val(),
			"disnea": $('input[name="disnea"]:checked').val(),
			"nauseas": $('input[name="nauseas"]:checked').val(),
			"vomitos": $('input[name="vomitos"]:checked').val(),
			"dolor_abdominal": $('input[name="dolor_abdominal"]:checked').val(),
			"diarrea": $('input[name="diarrea"]:checked').val(),
			"proctorragia": $('input[name="proctorragia"]:checked').val(),
			"disuria": $('input[name="disuria"]:checked').val(),
			"polaquiuria": $('input[name="polaquiuria"]:checked').val(),
			"edemas": $('input[name="edemas"]:checked').val(),
			"parestesias": $('input[name="parestesias"]:checked').val(),
			"calambres": $('input[name="calambres"]:checked').val(),
			"insensibilidad_miembro": $('input[name="insensibilidad_miembro"]:checked').val(),
			"cefaleas": $('input[name="cefaleas"]:checked').val(),
			"migrana_antecedente": $('input[name="migrana_antecedente"]:checked').val(),
			"migrana_medicada": $(".migrana_medicada").val(),
			"ta_constatada": $('input[name="ta_constatada"]:checked').val(),
			"otras_evaluaciones": $(".otras_evaluaciones").val()
		};
		if (_idTypeClose != "") { _params["id_type_task_close"] = _idTypeClose; }
		_API.method("/telemedicina/grabaratencion", _params).then(function (response) {
			if (response.estado == "OK") {
				$(".btn-cancel-modal").click();
				$(".btnConsultas").click()
			} else {
				alert(response.message);
			}
			_API.onWait(false);
		}).catch(function (error) {
			alert(error.message);
			_API.onWait(false);
		});
	},
	onDoctorAtencion: function (_this) {
		_API.onWait(true);
		var _params = {
			"idUser": _API.id_user_log,
			"Estado": _this.attr("data-action")
		};
		_API.method("/telemedicina/cambiarestadodoctor", _params).then(function (response) {
			_API.telemedicina.atendiendo = parseInt(response.records[0].active);
			_F.onDrawStatusDoctor();
			_API.onWait(false);
		}).catch(function (error) {
			alert(error.message);
			_API.onWait(false);
		});
	},
	onUploadReceta: function (_this) {
		var _message = "";
		var reader = new FileReader();
		reader.readAsDataURL($(".btnUploadReceta").prop('files')[0]);
		reader.onload = function () {
			_message = reader.result;
			var _params = {
				"Message": _message,
				"idChargeCode": _this.attr("data-id-charge-code"),
				"idUser": _API.id_user_log
			};
			_API.method("/telemedicina/grabarreceta", _params).then(function (response) {
				if (response.estado == "OK") {
					alert("¡Se ha adjuntado la receta correctamente!");
					$(".btn-cancel-modalall").click();
				} else {
					alert(response.message);
				}
			}).catch(function (error) { alert(error.message); });
		};
	},
	onVideo: function (_this) {
		/*NeoVideo implementation! */
		_this.fadeOut("slow");
		var _dataToken = _this.attr("data-token");
		_NEOVIDEO._id_application = 6;
		_NEOVIDEO._username = "credipaz";
		_NEOVIDEO._password = "08.!Rcp#@80";
		_NEOVIDEO._CONFIG_INIT_VIDEO_DEFAULTS.height = "600px";
		_NEOVIDEO._CONFIG_INIT_VIDEO_DEFAULTS.width = "100%";
		_NEOVIDEO._INTERFACE_CONFIG_OVERWRITE.TOOLBAR_BUTTONS = ['microphone', 'camera', 'hangup', 'chat', 'tileview'];
		_NEOVIDEO._CONFIG_OVERWRITE.disableSelfView = true;
		_NEOVIDEO._CONFIG_OVERWRITE.disableSelfViewSettings = true;
		_NEOVIDEO.onDisconnect = function () {
			$(".btnVideo").fadeIn("fast");
			$(_NEOVIDEO._CONFIG_INIT_VIDEO_DEFAULTS.target).addClass("d-none").hide();
		};
		_NEOVIDEO.onJoinOpenSession(_dataToken, true).then(function (conn) {
			$('[name ^= "jitsiConferenceFrame"]').css({ "height": _NEOVIDEO._CONFIG_INIT_VIDEO_DEFAULTS.height, "width": _NEOVIDEO._CONFIG_INIT_VIDEO_DEFAULTS.width });
			$(_NEOVIDEO._CONFIG_INIT_VIDEO_DEFAULTS.target).removeClass("d-none").fadeIn("fast");
		}).catch(function (err) { });

	},
	onEstadoColaAtencion: function () {
		var _params = {
			"idUser": _API.id_user_log
		};
		_API.method("/telemedicina/estadocolaatencion", _params).then(function (response) {
			_API.telemedicina.atendiendo = parseInt(response.records[0].activo);
			_F.onDrawStatusDoctor();
			var _total = parseInt(response.records[0].total);
			$(".conDemora").html("").addClass("d-none");
			$(".enEspera").html("Nadie en espera").removeClass("blink").removeClass("badge-dark").removeClass("badge-danger").addClass("badge-success");
			if (_total > 0) {
				$(".enEspera").html(_total + " en espera").removeClass("badge-success").addClass("badge-danger");
				$(".conDemora").html(response.records[0].elapsed).removeClass("d-none");
				if (_F._esperando < _total) {
					_F._esperando = _total;
					$("#ringerAlertas").attr("src", "audio/vintage.mp3");
					$(".enEspera").addClass("blink");
				}
			}
		}).catch(function (error) {
			alert(error.message);
		});
	},
	onDrawStatusDoctor: function () {
		if (_API.telemedicina.isDoctor != 1) {
			clearInterval(_API._TIMER_ALERT);
			$(".areaDoctor").addClass("d-none");
			return false;
		}
		$(".doctorName").html("Dr./Dra. " + _API.telemedicina.doctorName); 
		$(".doctorMatricula").html("Matrícula " + _API.telemedicina.doctorMatricula);
		$(".doctorFirma").attr("src", _API.telemedicina.doctorFirma);
		$(".btnDoctorAtencion").attr("data-action", "atender").removeClass("btn-danger").addClass("btn-info").html("En descanso");
		if (_API.telemedicina.atendiendo == 1) { $(".btnDoctorAtencion").attr("data-action", "descansar").removeClass("btn-info").addClass("btn-danger").html("Atendiendo"); }
		$(".areaDoctor").removeClass("d-none");
	},
}
