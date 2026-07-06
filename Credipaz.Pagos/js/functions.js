/* Objeto con todas las funciones de la rama */
var _F = {
	/* VARIABLES ACCESIBLES EN TODA LA RAMA VA OBETO _F */
	_itemsPagos: [],
	_TMR_PAY_BOTONPAGO: 0,
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
	/* FUNCION DE AUTOMATIZACION AL ACCESO POR VALORES DE PARAMETROS */
	onEvalParameters: function () {
		return new Promise(
			function (resolve, reject) {
				try {
					/* acá va el stack de evaluación de tratamiento de cada uno de los parámetros a evaluar al acceso */
					_F.onCodeReceived().then(function (response) {
						resolve(null);
					});
				} catch (err) {
					reject(err);
				}
			})
	},

	/* FUNCIONES DE LA RAMA */
	onCodeReceived: function () {
		return new Promise(
			function (resolve, reject) {
				try {
					/*Automatización de acceso con dni en el parametro code de la url */
					if (_API.urlParameters["code"] != undefined) {
						$(".headerImage").addClass("d-none");
						$(".areaSelector").addClass("d-none");
						/* url decoding del valor del parametro */
						var _documento = decodeURIComponent(_API.urlParameters["code"].toString());
						/* chequea si el valor es una cadena en base64 y la decodea */
						if (_API.isBase64(_documento)) { _documento = _API.b64_to_string(_documento); }
						/* asigna el valor del parametro decodeado o raw, segun corresponda */
						$(".Documento").val(_documento);
						/* búsqueda de valor automático */
						$(".btn-BotonDePagos").click();
						/* remueve del html el componente que permite la búsqueda */
						$(".headerImage").remove();
						$(".areaSelector").remove();
					} else {
						if (_API.urlParameters["data"] != undefined) {
							var _data = decodeURIComponent(_API.urlParameters["data"].toString());
							var _json = JSON.parse(_API.b64_to_string(_data));
							/*Verify id_user & token*/
							_API.verifytoken(_json).then(function (verify) {
								$(".logoImage").attr("src", (_API._ROOT + "/img/logoImageBig.png?" + _API._TS));
							}).catch(function (err) {
								_API.onShowUnauthorized("Verificaciones no aprobadas.");
							});
						} else {
							_API.onShowUnauthorized("Parámetros no enviados.");
						}
					}
					resolve(null);
				} catch (err) {
					_API.onShowUnauthorized("Parámetros de ejecución incorrectos.");
					reject(err);
				}
			})
	},
	onBotonDePagos: function (_this) {
		return new Promise(
			function (resolve, reject) {
				try {
					if (!_API.tools.validate(".validateFirst", false)) { throw null; }
					_this.fadeOut("fast");
					_F.DNI = $(".Documento").val();
					var data = { "NroDocumento": _F.DNI };
					_API.method("credipaz/segmentosDeuda", data)
						.then(function (response) {
							$(".divIFrame").addClass("d-none");
							if (response.estado == "OK") {
								$(".areaResultado").html(response.html).removeClass("d-none");
								var element = document.getElementById('otro_monto');
								if (element != null) {
									var maskOptions = { mask: Number, scale: 2, thousandsSeparator: '.', padFractionalZeros: true, normalizeZeros: true, radix: ',', mapToRadix: ['.'], min: 0, max: 999999999, autofix: true, };
									var mask = IMask(element, maskOptions);
								}
								if ($(".samImporte").val() != undefined) { _F.onTotalizePayment($(".samImporte")); }
								if ($(".moraImporte").val() != undefined) { _F.onTotalizePayment($(".moraImporte")); }
							}
							_this.fadeIn("slow");
							resolve(response);
						})
						.catch(function (err) {
							_this.fadeIn("slow");
							reject(err);
						});
				} catch (err) {
					_API.log("onBotonDePagos error", err);
					_this.fadeIn("slow");
					reject(err);
				}
			}
		);
	},
	onTotalizePayment: function (_this) {
		var _pagoTarjeta = 0;
		var _reset = _this.attr("data-reset");
		var _sort = parseInt(_this.attr("data-sort"));
		var _total = 0;
		var _color = "";
		var _rec = "";

		_F._itemsPagos = [];
		if (_reset != "") {
			$(_reset).prop("checked", false);
		}
		else {
			$(".chkCre").each(function () {
				var _dataSort = parseInt($(this).attr("data-sort"));
				if (_dataSort != 9999) {
					if (_dataSort <= _sort) {
						$(this).prop("checked", true);
					} else {
						$(this).prop("checked", false);
					}
				}
			});
		}
		if (_reset == ".chkTarMin" || _reset == ".chkTarTot") { $(".otro_monto").val(""); }

		if ($(".samImporte").val() != undefined) {
			$(".samImporte").css("background-color", "white");
			$(".samImporte").each(function () {
				_rec = "";
				var _samMin = parseInt($(this).attr("min"));
				var _samMax = parseInt($(this).attr("max"));
				var _samImporte = parseInt($(this).val());
				_color = "lightgreen";
				if (_samImporte != "" && (_samImporte < _samMin || _samImporte > _samMax)) {
					alert("Solo puede pagar un mínimo de $ " + _samMin + " o un máximo de $ " + _samMax);
					$(this).val(0);
					_color = "pink";
				} else {
					_rec = JSON.parse(_API.b64_to_string($(this).attr("data-record")));
					_rec.Importe = _samImporte.toFixed(2).toString();
					$(this).attr("data-record", _API.string_to_b64(JSON.stringify(_rec)));
					_total += _samImporte;
					if (_samImporte != 0) { _F._itemsPagos.push(_rec); }
				}
				$(this).css("background-color", _color);
			});
		}
		if ($(".otro_monto").val() != undefined) {
			$(".otro_monto").css("background-color", "white");
			_rec = "";
			var _otro_monto = parseFloat($(".otro_monto").val().replaceAll(".", "").replaceAll(",", "."));
			if (isNaN(_otro_monto)) {
				$(".otro_monto").val("");
				_otro_monto = 0;
			} else {
				var _tar_min = parseFloat($(".chkTarMin").val());
				var _tar_tot = parseFloat($(".chkTarTot").val());
				_rec = JSON.parse(_API.b64_to_string($(".otro_monto").attr("data-record")));
				if (_otro_monto != 0) {
					if (isNaN(_tar_min)) { _tar_min = 0; }
					if (isNaN(_tar_tot)) { _tar_tot = 0; }
					_color = "lightgreen";
					if (_otro_monto < _tar_min || _otro_monto > _tar_tot) { _color = "pink"; }
					$(".otro_monto").css("background-color", _color);
					$(".chkTar").prop("checked", false);
					_total += _otro_monto;
				}
				if (_otro_monto == null || _otro_monto == "") { _otro_monto = 0; }
				_rec.Importe = _otro_monto.toFixed(2).toString();
				if (_tar_tot != 0) { _pagoTarjeta = 1; }
			}
			if (_otro_monto != 0) { _F._itemsPagos.push(_rec); }
		}
		$(".chkPay").each(function () {
			var _rec = JSON.parse(_API.b64_to_string($(this).attr("data-record")));
			if ($(this).prop("checked")) {
				if (_rec.Importe == null || _rec.Importe == "") { _rec.Importe = 0; }
				if (parseFloat(_rec.Importe) != 0) {
					_rec.Importe = parseInt(_rec.Importe).toFixed(2).toString();
					_F._itemsPagos.push(_rec);
					_total += parseFloat(this.value);
				}
			}
		});
		/*consolidar total contra los items registrados! */
		var _total_consolidado = 0;
		for (var item of _F._itemsPagos) { _total_consolidado += (item.Importe * 1); }
		_total = _total_consolidado;
		$(".coinTotal").html(_API.tools.formatMoney(_total, 2));
		if (_total.toString().indexOf(".") == -1) { _total += ".00"; }
		var chargetotal = _API.tools.formatChargeTotal(_total.toString());
		if (_total_consolidado > 0) {
			var data = { "total": _total, "itemsPagos": JSON.stringify(_F._itemsPagos) };
			_F.onBuildFormFiserv(data).then(function (html) {
				$("#comments").val(JSON.stringify(_F._itemsPagos));
				$(".divFormFISERV").html(html).removeClass("d-none");
				$(".divIFrame").removeClass("d-none");
			});
		} else {
			$(".divIFrame").addClass("d-none");
		}
	},
	onBuildFormFiserv: function (values) {
		return new Promise(
			function (resolve, reject) {
				try {
					var hostURI = _API.branchConfiguration.URL_NOTIFY;
					var transactionNotificationURL = _API.branchConfiguration.URL_NOTIFY;
					var txndatetime = _API.getToday();
					var currency = "032";
					var chargetotal = _API.tools.formatChargeTotal(values.total.toString());
					if (values.itemsPagos == undefined || values.itemsPagos == null || values.itemsPagos.length == 0) {
						values.itemsPagos = [];
						var _rec = { "Tipo": "TAR", "Identificacion": (_F.DNI + " Pago tarjeta"), "Importe": chargetotal, "idTransfer": 0 };
						values.itemsPagos.push(_rec);
						values.itemsPagos = JSON.stringify(values.itemsPagos);
					}
					values.itemsPagos = JSON.parse(values.itemsPagos, true);
					/* Todo ocurre una vez resuelto el hashing */
					var stringToHash = (_API.branchConfiguration.FISERV_STOREID + txndatetime + chargetotal + currency + _API.branchConfiguration.FISERV_SHAREDSECRET);
					_API.hash("SHA-256", _API.bin2hex(stringToHash))
						.catch(function (err) {reject(err);})
						.then(function (extendedHash) {
							var html = "";
							html += "<form id='checkoutform' method='post' action='" + (_API.branchConfiguration.FISERV_URL + "?" + _API.uuid()) + "' target='iframe_fiserv'>";
							html += "   <table class='tbl-fiserv d-none'>";
							html += "    <tr><td>hostURI</td><td><input class='dataPost' type='text' id='hostURI' name='hostURI' value='" + _API.branchConfiguration.URL_NOTIFY + "'/></td></tr>";
							html += "    <tr><td>parentUri</td><td><input class='dataPost' type='text' id='parentUri' name='parentUri' value='" + window.location.href + "'/></td></tr>";
							html += "    <tr><td>responseFailURL</td><td><input class='dataPost' type='text' id='responseFailURL' name='responseFailURL' value='" + _API.branchConfiguration.URL_ERROR + "'/></td></tr>";
							html += "    <tr><td>responseSuccessURL</td><td><input class='dataPost' type='text' id='responseSuccessURL' name='responseSuccessURL' value='" + _API.branchConfiguration.URL_OK + "'/></td></tr>";
							html += "    <tr><td>storename</td><td><input class='dataPost' type='text' id='storename' name='storename' value='" + _API.branchConfiguration.FISERV_STOREID + "'/></td></tr>";
							html += "    <tr><td>txndatetime</td><td><input class='dataPost' type='text' id='txndatetime' name='txndatetime' value='" + txndatetime + "'/></td></tr>";
							html += "    <tr><td>currency</td><td><input class='dataPost' type='text' id='currency' name='currency' value='" + currency + "'/></td></tr>";
							html += "    <tr><td>chargetotal</td><td><input class='dataPost' type='text' id='chargetotal' name='chargetotal' value='" + chargetotal + "'/></td></tr>";
							html += "    <tr><td>customerid</td><td><input sclass='dataPost' tyle='width:100%;' type='text' id='customerid' name='customerid' value='" + values.itemsPagos[0].Identificacion + "'/></td></tr>";
							html += "    <tr><td>hash</td><td><input class='dataPost' type='text' id='hash' name='hash' value='" + extendedHash + "'/></td></tr>";
							html += "    <tr><td>mode</td><td><input class='dataPost' type='text' id='mode' name='mode' value='payonly'/></td></tr>";
							html += "    <tr><td>comments</td><td><input class='dataPost' type='text' id='comments' name='comments' value=''/></td></tr>";
							html += "    <tr><td>numberOfInstallments</td><td><input class='dataPost' type='text' id='numberOfInstallments' name='numberOfInstallments' value='1'/></td></tr>";
							html += "    <tr><td>language</td><td><input class='dataPost' type='text' id='language' name='language' value='es_ES'/></td></tr>";
							html += "    <tr><td>checkoutoption</td><td><input class='dataPost' type='text' id='checkoutoption' name='checkoutoption' value='classic'/></td></tr>";
							html += "    <tr><td>txntype</td><td><input class='dataPost' type='text' id='txntype' name='txntype' value='sale'/></td></tr>";
							html += "    <tr><td>timezone</td><td><input class='dataPost' type='text' id='timezone' name='timezone' value='America/Buenos_Aires'/></td></tr>";
							html += "    <tr><td>hash_algorithm</td><td><input class='dataPost' type='text' id='hash_algorithm' name='hash_algorithm' value='SHA256'/></td></tr>";
							html += "    <tr><td>authenticateTransaction</td><td><input class='dataPost' type='text' id='authenticateTransaction' name='authenticateTransaction' value='false'/></td></tr>";
							html += "    <tr><td>mobileMode</td><td><input class='dataPost' type='text' id='mobileMode' name='mobileMode' value='true'/></td></tr>";
							html += "    <tr><td>referencedMerchantTransactionID</td><td class='dataPost' style='width:100%;'><input type='text' id='referencedMerchantTransactionID' name='referencedMerchantTransactionID' value=''/></td></tr>";
							html += "    <tr><td>paymentMethod</td><td><input class='dataPost paymentMethod' type='text' id='paymentMethod' name='paymentMethod' value=''/></td></tr>";
							html += "    <tr><td>trxOrigin</td><td><input class='dataPost' type='text' id='trxOrigin' name='trxOrigin' value='ECI'/></td></tr>";
							html += "   </table>";
							html += "</form>";
							resolve(html);
						});
				} catch (err) {
					reject(err);
				}
			});
	},
	onPagarFiserv: function (_this) {
		$(".ocultarEnFISERV").hide();
		var data = {
			"Id_type_channel": 1,
			"Identificacion": _F._itemsPagos[0]["Identificacion"],
			"Moneda": $("#currency").val(),
			"NroDocumento": _F.DNI,
			"Monto": $("#chargetotal").val(),
			"Raw_request": JSON.stringify(_API.tools.getFormValues(".dataPost", $(this))),
			"Channel": "FSRV"
		};
		_API.method("credipaz/iniciarTransaccionPago", data).then(function (response) {
			_idTransaction = response.id;
			_F._itemsPagos[0]["idTransfer"] = _idTransaction;
			$("#referencedMerchantTransactionID").val(_idTransaction);
			$("#comments").val(JSON.stringify(_F._itemsPagos));
			$(".divIFrame").removeClass("d-none");
			$(".divDatos").addClass("d-none");
			checkoutform.submit();
			clearInterval(_F._TMR_PAY_BOTONPAGO);
			_F._TMR_PAY_BOTONPAGO = setInterval(function () {
				_F.onCheckStatusPaymentBotonPago(_idTransaction, _F.DNI);
			}, 1000);
		});
	},
	onCheckStatusPaymentBotonPago: function (_idTransaction, _dni) {
		var data = { "IdTransaccion": _idTransaction };
		_API.method("credipaz/consultarEstadoTransaccionPago", data).then(function (response) {
			if (datajson.data[0].status != "INICIADO") {
				clearInterval(_F._TMR_PAY_BOTONPAGO);
				if (datajson.data[0].status == "APROBADO") {
					$(".btn-deuda-fiserv").click();
					$(".id_payment").val(0);
					$(".code_payment").val(_idTransfer_botonpago); //id en mod_payments_transactions
					var response = { "now": _API.getNow(), "apiReference": _idTransfer_botonpago };
					var _fulldata = { "dni": _dni, "MedioPago": datajson.data[0].partial_card_number };
					var _raw_request = JSON.parse(datajson.data[0].raw_request);
					_raw_request = JSON.parse(_raw_request["comments"]);
					_F.onWindowComprobante(response, _fulldata, _raw_request);
				} else {
					alert("Su pago no ha podido ser procesado.  Reintente con otro medio de pago.");
				}
			}
		}).catch(function (error) {
			alert("id:" + _idTransfer_botonpago + " " + error.message);
		});
	},
	onWindowComprobante: function (response, _fulldata, _raw_request) {
		var _identificaciones = "";
		var _html = "<div style='max-width:540px;width:100%;font-family:arial;border:solid 2px black;padding:5px;' class='data-pdf'>";
		_html += "<input type='hidden' id='code' name='code' value='" + _fulldata.dni + "' class='code dbaseComprobante'/>";
		_html += "<input type='hidden' id='description' name='description' value='comprobanteCOIN' class='description dbaseComprobante'/>";
		_html += "<input type='hidden' id='base64' name='base64' value='' class='base64 dbaseComprobante'/>";
		_html += "<input type='hidden' id='filename' name='filename' value='Comprobante de pago " + _API.uuid() + ".pdf' class='filename dbaseComprobante'/>";
		_html += "<input type='hidden' id='extension' name='extension' value='pdf' class='extension dbaseComprobante'/>";
		_html += "<table style='width:100%;font-family:calibri;padding:5px;'>";
		_html += "   <tr>";
		switch (_raw_request[0].Tipo) {
			case "CRDO":
			case "CICR":
				_html += "<td align='center' valign='middle'>";
				_html += "   <img src='https://intranet.credipaz.com/assets/credipaz/img/mediya.png' style='width:75px;'/>";
				_html += "</td>";
				break;
			default:
				_html += "<td align='center' valign='middle' style='border:solid 1px black;background-color:rgb(230,0,150);'>";
				_html += "   <span style='font-weight:bold;font-size:40px;color:yellow;'>CREDIPAZ</span>";
				_html += "</td>";
				break;
		}
		_html += "   </tr>";
		_html += "   <tr>";
		_html += "      <td align='center' valign='middle' style='border-bottom:solid 1px silver;'>";
		_html += "         <span style='font-weight:bold;font-size:24px;'>Comprobante de pago</span>";
		_html += "      </td>";
		_html += "   </tr>";
		for (_item of _raw_request) {
			_html += "<tr><td align='center' valign='middle' style='font-size:24px;'>";
			switch (_item.Tipo) {
				case "TAR":
					_html += "TARJETA CABAL CREDIPAZ";
					break;
				case "CRE":
					_html += "CRÉDITO";
					break;
				case "CICR":
					_html += "MEDIYA Cuota Anticipada";
					break;
				case "CRDO":
					_html += "MEDIYA Cuota";
					break;
				case "ACU":
					_html += "ACUERDO DE PAGO";
					break;
			}
			_html += "</td></tr>";
			_html += "<tr>";
			_html += "   <td align='center' valign='middle' style='font-weight:bold;font-size:24px;'>$ " + _item.Importe + "</td>";
			_html += "   <td align='center' valign='middle' style='font-weight:bold;font-size:12px;'>(Importe sujeto a confirmación de cobro)</td>";
			_html += "</tr>";
			if (_identificaciones != "") { _identificaciones += ", " }
			_identificaciones += _item.Identificacion;
		}
		_html += "      <tr>";
		_html += "         <td align='center' valign='middle'>";
		_html += "            <table align='center' style='width:80%;padding:5px;' cellspacing='0'>";
		_html += "               <tr>";
		_html += "                  <td align='left' valign='top' style='border-top:solid 1px black;'>Identificación</td>";
		_html += "                  <td align='right' valign='top' style='border-top:solid 1px black;'>" + _identificaciones + "</td>";
		_html += "               </tr>";
		_html += "               <tr>";
		_html += "                  <td align='left' valign='top' style='border-top:solid 1px black;'>Medio de pago</td>";
		_html += "                  <td align='right' valign='top' style='border-top:solid 1px black;'>" + _fulldata.MedioPago + "</td>";
		_html += "               </tr>";
		_html += "               <tr>";
		_html += "                  <td align='left' valign='top' style='border-top:solid 1px black;'>Fecha de pago</td>";
		_html += "                  <td align='right' valign='top' style='border-top:solid 1px black;'>" + response.now + "</td>";
		_html += "               </tr>";
		_html += "               <tr>";
		_html += "                  <td align='left' valign='top' style='border-top:solid 1px black;border-bottom:solid 1px black;'>Número de pago</td>";
		_html += "                  <td align='right' valign='top' style='border-top:solid 1px black;border-bottom:solid 1px black;'>" + response.apiReference + "</td>";
		_html += "               </tr>";
		_html += "            </table>";
		_html += "         </td>";
		_html += "      </tr>";
		_html += "   </table>";
		_html += "</div>";
		_API.onShowModal("modalComprobante", "Pago procesado en forma exitosa", _html).then(function () { });
	},
}
