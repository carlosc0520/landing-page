$(document).ready(function () {

    let step1 = $("#step1");
    let step2 = $("#step2");
    let step3 = $("#step3");

    let hoy = new Date();
    // hora 00
    hoy.setHours(0, 0, 0, 0);
    $("#FCHASERVICIO").attr("min", hoy.toISOString().split("T")[0]);
    let iconCheck = '<i class="fa-solid fa-check resaltado-text fs-3 lh-1 mb-0"></i>';

    let abogados = [];
    let Sucursales = [];
    // let ENDPOINT = "http://localhost:7001/";
    let ENDPOINT = "https://caroasociados.pe/";

    $("#signup-form").steps({
        headerTag: "h3",
        bodyTag: "fieldset",
        transitionEffect: "fade",
        labels: {
            previous: "Anterior",
            next: "Siguiente",
            finish: "Enviar",
            current: "",
        },
        titleTemplate: '<h3 class="title">#title#</h3>',
        onFinished: function () {
            let GDSUCRSLS = $("#GDSUCRSLS").val();
            let GDESPCLDD = $("#GDESPCLDD").val();
            let ABOGADO = $("#ABOGADO").val();
            let FCHASERVICIO = $("#FCHASERVICIO").val();
            let DATA_HORA = $("#container-horarios .card.bg-orange").attr("data-id");
            let NMBRES = $("#NMBRES").val();
            let APLLDS = $("#APLLDS").val();
            let CORREO = $("#CORREO").val();
            let CELULAR = $("#CELULAR").val();
            let COMENTARIOS = $("#COMENTARIOS").val();
            let files = $("#fileInput")[0].files;

            let formData = new FormData();
            formData.append("GDSUCRSLS", GDSUCRSLS);
            formData.append("GDESPCLDD", GDESPCLDD);
            formData.append("ABOGADO", ABOGADO);
            formData.append("FCHASERVICIO", FCHASERVICIO);
            formData.append("DATA_HORA", DATA_HORA);
            formData.append("NMBRES", NMBRES);
            formData.append("APLLDS", APLLDS);
            formData.append("CORREO", CORREO);
            formData.append("CELULAR", CELULAR);
            formData.append("COMENTARIOS", COMENTARIOS);

            let DIRCCN = $("#GDSUCRSLS").val();
            let abogado_d = abogados.find((item) => item.id == ABOGADO);
            let horario_d = JSON.parse(abogado_d.horarios).find((item) => item.ID == DATA_HORA);
            let HRAINIT = horario_d.HRAINIT.split(":");
            let HRAFN = horario_d.HRAFN.split(":");
            HRAINIT = parseInt(HRAINIT[0]) >= 12 ? [HRAINIT[0], HRAINIT[1], "PM"] : [HRAINIT[0], HRAINIT[1], "AM"];
            HRAFN = parseInt(HRAFN[0]) >= 12 ? [HRAFN[0], HRAFN[1], "PM"] : [HRAFN[0], HRAFN[1], "AM"];
            let formattedHRAINIT = `${HRAINIT[0]}:${HRAINIT[1]} ${HRAINIT[2]} - ${HRAFN[0]}:${HRAFN[1]} ${HRAFN[2]}`;
            let direccion = Sucursales.find((item) => item.vlR1 == DIRCCN).vlR2;

            formData.append("NAME_SUCURSAL", Sucursales.find((item) => item.vlR1 == GDSUCRSLS).dtlle);
            formData.append("NAME_DRCCN", direccion.replace(/,/g, ", "));
            formData.append("NAME_ABGDO", abogado_d.nmbrs);
            formData.append("NAME_ESPCDD", abogado_d.dgdespcldd);
            formData.append("NAME_HORA", formattedHRAINIT);
            for (let i = 0; i < files.length; i++) {
                formData.append("FILES", files[i]);
            }

            Swal.fire({
                title: "",
                html: `<div>
                            <img src="https://ccfirma.com/wp-content/uploads/2025/02/logo-caro.png" alt="Logo" class="logo" width="150" />
                            <div class="spinner">
                                <div class="rect1"></div>
                                <div class="rect2"></div>
                                <div class="rect3"></div>
                                <div class="rect4"></div>
                                <div class="rect5"></div>
                            </div>
                        </div>`,
                buttonsStyling: false,
                showConfirmButton: false,
                background: 'rgba(0,0,0,0)',
                allowOutsideClick: false,
                didOpen: () => {
                    // Swal.showLoading();
                },
            });

            $.ajax({
                url: `${ENDPOINT}Legal/Abogados/Index?handler=AddSolicitud`,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('XSRF-TOKEN', "XXXXXXXXXXXXXXXXXXXXX");
                },
                type: 'POST',
                dataType: 'json',
                contentType: false,
                processData: false,
                data: formData,
                success: function (data) {
                    if (data.esSatisfactoria) {
                        $("#step3 p").addClass("d-none");
                        step3.html(iconCheck);

                        Swal.fire({
                            icon: "success",
                            title: "Solicitud enviada",
                            text: "",
                        });

                        resetJQuerySteps("#signup-form", 4);
                        $('#signup-form-p-0 .actions').show();
                        $("#signup-form")[0].reset();
                        $("#fileList").html("");

                        $("#signup-form input, #signup-form select, #signup-form textarea").removeClass("is-valid is-invalid");
                        $("#signup-form input, #signup-form select, #signup-form textarea").siblings("label").css("color", "#888");

                        $(".card-active").removeClass("card-active");
                        $("#ABOGADO").html("<option value=''>-- Seleccione</option>");
                        $("#container-horarios").html("");

                        step1.html("");
                        step2.html("");
                        step3.html("");
                        step2.removeClass("fs-3 lh-1 mb-0");
                        step3.removeClass("fs-3 lh-1 mb-0");
                        step1.html("<p class='resaltado-text fs-3 lh-1 mb-0'>1</p>");
                        step2.html("<p>2</p>");
                        step3.html("<p>3</p>");

                        return;
                    }

                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Ocurrió un error al enviar la solicitud.",
                    });

                },
                error: (jqXHR, textStatus, errorThrown) => {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Ocurrió un error al enviar la solicitud.",
                    });
                }
            });

        },
        onStepChanging: function (event, currentIndex, newIndex) {

            if(newIndex < currentIndex) return true;

            if (currentIndex === 0) {
                let sucursal = $("#GDSUCRSLS");
                let especialidad = $("#GDESPCLDD");
                let abogado = $("#ABOGADO");
                let fecha = $("#FCHASERVICIO");
                let horario = $("#container-horarios .card.bg-orange").attr("data-id");
                let errores = 0;

                errores = validateForm(sucursal, /^.+$/, "Seleccione una sucursal");
                errores += validateForm(especialidad, /^.+$/, "Seleccione una especialidad");
                errores += validateForm(abogado, /^.+$/, "Seleccione un abogado");
                errores += validateForm(fecha, /^\d{4}-\d{2}-\d{2}$/, "Ingrese una fecha válida")

                if (errores > 0) return false;

                if (!horario) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Debe seleccionar un horario antes de continuar.",
                    });
                    return false;
                }

                $("#step1 p").addClass("d-none");
                step1.html(iconCheck);
                step2.addClass("fs-3 lh-1 mb-0");
                $("#step2 p").addClass("resaltado-text");
            }

            if (currentIndex === 1) {
                let nombres = $("#NMBRES");
                let apellidos = $("#APLLDS");
                let correo = $("#CORREO");
                let celular = $("#CELULAR");
                let comentarios = $("#COMENTARIOS");
                let errores = 0;

                errores = validateForm(nombres, /^.+$/, "Ingrese su nombre");
                errores += validateForm(apellidos, /^.+$/, "Ingrese sus apellidos");
                errores += validateForm(correo, /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, "Ingrese un correo válido");
                errores += validateForm(celular, /^(?:[67]\d{8}|9\d{8})$/, "Ingrese un número de celular válido");
                errores += validateForm(comentarios, /^.{1,500}$/, "Debe tener entre 1 y 500 caracteres");

                if (errores > 0) {
                    return false;
                } else {
                    $("#step2 p").addClass("d-none");
                    step2.html(iconCheck);
                    step3.addClass("resaltado-text fs-3 lh-1 mb-0");
                    $("#step3 p").addClass("resaltado-text");
                }
            }

            if (newIndex === 2) {
                let DIRCCN = $("#GDSUCRSLS").val();
                let GDESPCLDD = $("#GDESPCLDD").val();
                let ABOGADO = $("#ABOGADO").val();
                let FCHASERVICIO = $("#FCHASERVICIO").val();
                let DATA_HORA = $("#container-horarios .card.bg-orange").attr("data-id");
                let NMBRES = $("#NMBRES").val();
                let APLLDS = $("#APLLDS").val();
                let CORREO = $("#CORREO").val();
                let CELULAR = $("#CELULAR").val();
                let COMENTARIOS = $("#COMENTARIOS").val();
                let files = $("#fileInput")[0].files;

                let abogado_d = abogados.find((item) => item.id == ABOGADO);
                let horario_d = JSON.parse(abogado_d.horarios).find((item) => item.ID == DATA_HORA);
                let HRAINIT = horario_d.HRAINIT.split(":");
                let HRAFN = horario_d.HRAFN.split(":");
                HRAINIT = parseInt(HRAINIT[0]) >= 12 ? [HRAINIT[0], HRAINIT[1], "PM"] : [HRAINIT[0], HRAINIT[1], "AM"];
                HRAFN = parseInt(HRAFN[0]) >= 12 ? [HRAFN[0], HRAFN[1], "PM"] : [HRAFN[0], HRAFN[1], "AM"];
                let formattedHRAINIT = `${HRAINIT[0]}:${HRAINIT[1]} ${HRAINIT[2]} - ${HRAFN[0]}:${HRAFN[1]} ${HRAFN[2]}`;
                let direccion = Sucursales.find((item) => item.vlR1 == DIRCCN).vlR2;

                $("#foto-abogado").attr("src", abogado_d.rtafto);
                $("#name_abogado").text(" " + abogado_d.nmbrs);
                $("#especialidad_abogado").text(" " + abogado_d.dgdespcldd);
                $("#name_cliente").text(` ${NMBRES} ${APLLDS}`);
                $("#fecha_cliente").text(" " + FCHASERVICIO);
                $("#hora_cliente").text(" " + formattedHRAINIT);
                $("#direccion_cliente").text(" " + direccion.replace(/,/g, ", "));


                return true;
            }

            return true;
        },
    });


    const getGrupoDato = () => {
        return new Promise((resolve, reject) => {
            let api = `${ENDPOINT}Seguridad/GrupoDato/Index?handler=ObtenerAll&GDTOS=GDESPCLDD,GDSCRSLS`;
            $.ajax({
                url: api,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("XSRF-TOKEN", "XXXXXXXXXXXXXXXXXXXXX");
                },
                type: "GET",
                success: function (response) {
                    if (response?.data && response.data.length > 0) {
                        resolve(response.data);
                    } else {
                        reject("No se encontraron datos.");
                    }
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    };

    const getAbogados = (grupoDatoValue) => {
        if (!grupoDatoValue) {
            return Promise.reject([]);
        }

        return new Promise((resolve, reject) => {
            let api = `${ENDPOINT}Legal/Abogados/Index?handler=Buscar&GDESPCLDD=${grupoDatoValue}&start=0&length=1000`;
            $.ajax({
                url: api,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("XSRF-TOKEN", "XXXXXXXXXXXXXXXXXXXXX");
                },
                type: "GET",
                success: function (response2) {
                    if (response2?.data && response2.data.length > 0) {
                        abogados = response2.data;
                        resolve(response2.data);
                    } else {
                        reject([]);
                    }
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    };

    const updateGrupoDato = (data) => {
        $("#GDESPCLDD").html("<option value=''>-- Seleccione</option>");
        data.forEach(function (item) {
            $("#GDESPCLDD").append($("<option>").val(item.vlR1).text(item.dtlle));
        });
    };

    const updateAbogados = (data) => {
        try {
            $("#ABOGADO").html("");

            data.forEach(function (rowData) {
                let option = $("<option>").val(rowData.id).text(rowData.nmbrs);
                option.attr("data-rtafto", rowData.rtafto);
                $("#ABOGADO").append(option);
            });

            $("#ABOGADO").select2({
                templateResult: function (state) {
                    if (!state.id) { return state.text; }
                    var $state = $('<span><img src="' + $(state.element).data('rtafto') + '" class="img-option " /> ' + state.text + '</span>');
                    return $state;
                },
                templateSelection: function (state) {
                    return state.text;
                }
            });

        } catch (error) {

        }
    };

    getGrupoDato()
        .then((grupoDatoData) => {
            updateGrupoDato(grupoDatoData.filter((item) => item.gdpdre === "GDESPCLDD"));

            let GDSCRSLS = grupoDatoData.filter((item) => item.gdpdre === "GDSCRSLS");
            Sucursales = GDSCRSLS;
            let GDSUCRSLS_SELECT = $("#GDSUCRSLS")
            GDSUCRSLS_SELECT.html("<option value=''>-- Seleccione</option>");
            GDSCRSLS.forEach((item) => {
                GDSUCRSLS_SELECT.append($("<option>").val(item.vlR1).text(item.dtlle));
            });

            cargarSucursales();

            $(".direccion").on("click", function () {
                $(".direccion").removeClass("card-active");
                $(this).addClass("card-active");
            });

            $("#GDESPCLDD").on("change", function () {
                let grupoDatoValue = $(this).val();
                $("#ABOGADO").html("<option value=''>-- Seleccione</option>");
                $("#FCHASERVICIO").val("");
                $("#container-horarios").html("");

                getAbogados(grupoDatoValue)
                    .then((abogadosData) => {
                        updateAbogados(abogadosData);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            });

            $("#ABOGADO").off("change");
            $("#ABOGADO").on("change", function () {
                $("#FCHASERVICIO").val("");
                $("#container-horarios").html("");
            });

        })
        .catch((error) => {
            console.error(error);
        });

    let validateForm = (referencia, regex = /^[a-zA-Z\s]*$/, errorMsg = "Campo inválido") => {
        let input = $(referencia);
        let value = input.val();
        value = value ? value.toString() : "";
        let isValid = regex.test(value);

        input.removeClass("error-input");
        input.siblings(".error-message").remove();

        if (!isValid) {
            input.addClass("error-input");
            input.after(`<span class="error-message" style="color: red; font-size: 12px;">${errorMsg}</span>`);
        }

        return isValid ? 0 : 1;
    };

    const cargarSucursales = () => {
        let filteredData = Sucursales.filter(item => item.gdpdre === "GDSCRSLS" && item.vlR2);        
        filteredData.forEach(location => {
            var address = encodeURIComponent(location.vlR2 || "");
            var card = `<div class="card border-0" style="height: 350px; min-width: 200px; max-width: 350px;">
                            <div class="card-body">
                                <h6>${location?.dtlle}</h6>
                                <span>${location?.vlR2}</span>
                                <iframe loading="lazy" width="100%" height="250px" 
                                    src="https://maps.google.com/maps?q=${address}&t=m&z=10&output=embed&iwloc=near" 
                                    title="${location?.vlR2}" aria-label="${location?.vlR2}">
                                    </iframe>
                            </div>
                          </div>`;
            $("#container-sucursales").append(card);
        });
    };

    const mjsArraySwal = (array) => {
        let cant = array.length;
        var html = `<div class='slide-vertical m-0 p-0 elements-${cant}'><ul>`;
        for (var i = 0; i < array.length; i++) {
            html += "<li class='text-lg'>" + array[i] + "</li>";
        }
        html += "</ul></div>";
        return html;
    }

    function resetJQuerySteps(elementTarget, noOfSteps) {
        var noOfSteps = noOfSteps - 1;

        var currentIndex = $(elementTarget).steps("getCurrentIndex");
        if (currentIndex >= 1) {
            for (var x = 0; x < currentIndex; x++) {
                $(elementTarget).steps("previous");
            }
        }

        setTimeout(function resetHeaderCall() {
            var y, steps;
            for (y = 0, steps = 2; y < noOfSteps; y++) {
                //console.log(steps);
                try {
                    $(`${elementTarget} > .steps > ul > li:nth-child(${steps})`).removeClass("done");
                    $(`${elementTarget} > .steps > ul > li:nth-child(${steps})`).removeClass("current");
                    $(`${elementTarget} > .steps > ul > li:nth-child(${steps})`).addClass("disabled");

                }
                catch (err) { }
                steps++;
            }
        }, 50);

    }


    $(".toggle-password").on("click", function () {
        $(this).toggleClass("zmdi-eye zmdi-eye-off");
        var input = $($(this).attr("toggle"));
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

    $("#FCHASERVICIO").on("input", function () {
        let fecha = $(this).val();
        $("#container-horarios").html("");

        let abogado = $("#ABOGADO").val();
        let abogadoSelected = abogados.find((item) => item.id == abogado);
        if (abogadoSelected) {
            let horarios = JSON.parse(abogadoSelected.horarios) || [];
            let horario = horarios.filter((item) => item.FCHA.includes(fecha));
            if (horario) {
                $("#container-horarios").html("");
                $("#container-horarios").append("<p class='text-muted mb-2'>Seleccione un horario</p>");

                horario.forEach((item) => {
                    let card = $("<div>")
                        .addClass("col-4 mb-3 card-horario animation-in")
                        .attr("data-id", item.ID);

                    let cardInner = $("<div>")
                        .addClass("card shadow-sm border-orange cursor-pointer")
                        .attr("data-id", item.ID);

                    let cardBody = $("<div>").addClass("card-body text-center");

                    let cardTitle = $("<h5>")
                        .addClass("card-title text-primary fw-bold")
                        .text(item.HRIO);

                    let HRAINIT = item.HRAINIT.split(":");
                    let HRAFN = item.HRAFN.split(":");

                    HRAINIT = parseInt(HRAINIT[0]) >= 12 ? [HRAINIT[0], HRAINIT[1], "PM"] : [HRAINIT[0], HRAINIT[1], "AM"];
                    HRAFN = parseInt(HRAFN[0]) >= 12 ? [HRAFN[0], HRAFN[1], "PM"] : [HRAFN[0], HRAFN[1], "AM"];

                    let formattedHRAINIT = `${HRAINIT[0]}:${HRAINIT[1]} ${HRAINIT[2]}`;
                    let formattedHRAFN = `${HRAFN[0]}:${HRAFN[1]} ${HRAFN[2]}`;

                    let cardText = $("<p>")
                        .addClass("card-text text-muted")
                        .text(`${formattedHRAINIT} - ${formattedHRAFN}`);

                    // Estructura de la tarjeta
                    cardBody.append(cardTitle, cardText);
                    cardInner.append(cardBody);
                    card.append(cardInner);

                    $("#container-horarios").append(card);
                });

                // Evento para seleccionar una tarjeta y deseleccionar la anterior
                $("#container-horarios").on("click", ".card", function () {
                    let cardHorarios = $(".card");

                    // Quitar selección previa en todas las tarjetas
                    cardHorarios.removeClass("bg-orange text-white").addClass("bg-light");
                    cardHorarios.find("p").removeClass("text-white").addClass("text-muted");

                    // Aplicar selección en la tarjeta actual
                    $(this).removeClass("bg-light").addClass("bg-orange text-white");
                    $(this).find("p").removeClass("text-muted").addClass("text-white");
                });



            } else {
                console.log("No hay horario disponible para la fecha seleccionada.");
            }
        }
    });
});
