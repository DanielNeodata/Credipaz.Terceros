var _T = {
    isValidDate: function (dateString) {
        var timestamp = Date.parse(dateString);
        return !isNaN(timestamp);
    },
    isValidEmail: function (email) {
        var em = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        return em.test(email);
    },
    onlyNumbers: function (_this) {
        _this.val(_this.val().replace(/[^0-9]/g, ''));
    },
    dateCompareGreaterThan: function (_dateGreater, _dateBase) {
        const date1 = new Date(_dateGreater);
        const date2 = new Date(_dateBase);
        if (date1 > date2) {
            return true;
        } else if (date1 < date2) {
            return false;
        } else {
            return true;
        }
    },
    validate: function (_selector, _seeAlert) {
        if (_seeAlert == undefined) { _seeAlert = false; }
        var _ret = true;
        $(_selector).each(function () { _ret = _API.tools.formatValidation($(this)) && _ret; });
        if (!_ret && _seeAlert) { alert("Faltan datos."); }
        return _ret;
    },
    formatValidation: function (_obj) {
        var _ret = true;
        var _value = _obj.val();
        var property = _obj.attr('name');
        switch (_obj.prop("tagName")) {
            case "TEXTAREA":
            case "INPUT":
                var _min = _obj.attr('data-min');
                var _max = _obj.attr('data-max');
                switch (_obj.attr("type")) {
                    case "number":
                        if (_value == "") { _ret = false; }
                        if (isNaN(_value)) { _ret = false; }
                        if (_min !== undefined) {
                            if (isNaN(_min)) {
                                _min = $(_min).val();
                                if (_min != undefined) { if (isNaN(_min)) { _ret = false; } }
                            }
                            if (_ret) { _ret = (parseDouble(_value) > parseDouble(_min)); }
                        }
                        if (_ret) {
                            if (_max !== undefined) {
                                if (isNaN(_max)) {
                                    _max = $(_max).val();
                                    if (_max != undefined) { if (isNaN(_max)) { _ret = false; } }
                                }
                                if (_ret) { _ret = (parseDouble(_value) < parseDouble(_max)); }
                            }
                        }
                        break;
                    case "date":
                    case "datetime-local":
                        if (!_API.tools.isValidDate(_value)) { _ret = false; }
                        if (_min !== undefined) {
                            if (!_API.tools.isValidDate(_min)) {
                                _min = $(_min).val();
                                if (_min != undefined) { if (!_API.tools.isValidDate(_min)) { _ret = false; } }
                            }
                            if (_ret) { _ret = _API.tools.dateCompareGreaterThan(_value, _min); }
                        }
                        if (_ret) {
                            if (_max !== undefined) {
                                if (!_API.tools.isValidDate(_max)) {
                                    _max = $(_max).val();
                                    if (_max != undefined) { if (!_API.tools.isValidDate(_max)) { _ret = false; } }
                                }
                                if (_ret) { _ret = _API.tools.dateCompareGreaterThan(_max, _value); }
                            }
                        }
                        break;
                    case "email":
                        if (!_API.tools.isValidEmail(_value)) { _ret = false; }
                        break;
                    case "radio":
                        _ret = ($("input[name='" + property + "']:checked").val() != undefined);
                        if (!_ret) {
                            _obj.parent().css("border", "solid 1px red");
                        } else {
                            _obj.parent().css("border", "solid 0px transparent");
                        }
                        break;
                    case "checkbox":
                        var _checked = _obj.is(":checked");
                        if (!_checked) { _ret = false; }
                        break;
                    default:
                        if (_obj.hasClass("data-list")) {
                            if (_obj.attr("data-selected-id") == "" || _obj.attr("data-selected-id") == undefined) { _ret = false; }
                        } else {
                            if (_value == "") { _ret = false; }
                        }
                        break;
                }
                break;
            case "SELECT":
                if (_value == "0" || _value == "-1" || _value == undefined || _value == null || _value == "") { _ret = false; }
                break;
        }
        if (_ret) {
            _obj.removeClass("is-invalid").addClass("is-valid");
            $(".invalid-" + _obj.prop("name")).html("").addClass("d-none");
        } else {
            _obj.removeClass("is-valid").addClass("is-invalid");
        }
        if (!_ret) { _API.log("formatValidation, elemento en FALSE", property); }
        return _ret;
    },
    getFormValues: function (_selector, _this) {
        try {
            var _jsonSave = {};
            $(_selector).each(function () {
                var property = $(this).attr('name');
                var value = "";
                switch ($(this).attr("data-type")) {
                    case "select":
                        if ($(this).length == 0) { value = ""; } else { value = $(this).val(); }
                        if (value == null || value == "-1" || value == "0") { value = ""; }
                        break;
                    case "radio":
                        value = $("input[name='" + property + "']:checked").val();
                        if (value == undefined) { value = ""; }
                        break;
                    case "checkbox":
                        if ($(this).prop("checked")) {
                            value = $(this).val();
                            if (parseInt(value) == 0 || value == '') { value = 1; }
                        } else {
                            value = 0;
                        }
                        break;
                    default:
                        value = $(this).val();
                        break;
                }
                _jsonSave[property] = value;
            });
        } catch (rex) { };
        return _jsonSave;
    },
    formatChargeTotal: function (str) {
        var part = str.toString().split(".");
        return (part[0] + "." + part[1].slice(0, 2));
    },
    formatMoney: function (_val, _dec = 2) {
        if (isNaN(_val)) { _val = 0; }
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: _dec, maximumFractionDigits: _dec }).format(_val);
    },
};
