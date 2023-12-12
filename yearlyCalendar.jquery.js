
$(document).ready(function () {
    (function ($) {
        $.fn.yearlyCalendar = function (options) {
            var settings = $.extend(
                {
                    year: new Date().getFullYear(),
                    longitudDias: 37,
                    calendarClass: "calendario",
                    styles: {},
                    daysArray: ["D", "L", "M", "X", "J", "V", "S"],
                    daysArrayOrder: ["L", "M", "X", "J", "V", "S", "D"],
                    forceFirstDay: null,
                    monthTranslation: "Meses",
                    selectable: true,
                    allowSelectedLessThanCurrentDate: false,
                    selectedDaysFormat: "YYYY-MM-DD",
                    daysToHidenInput: null,
                    monthsArray: [
                        "Enero",
                        "Febrero",
                        "Marzo",
                        "Abril",
                        "Mayo",
                        "Junio",
                        "Julio",
                        "Agosto",
                        "Septiembre",
                        "Octubre",
                        "Noviembre",
                        "Diciembre",
                    ]
                },
                options
            );

            var calendarioStyles = `
              /* Estilos para el calendario */
              .${settings.calendarClass} table {
                border-collapse: collapse;
                width: 100%;
                ${settings.styles.calendarioTable || ""}
              }

              .${settings.calendarClass} th,
              .${settings.calendarClass} td {
                border: 1px solid #dddddd;
                text-align: center;
                padding: 8px;
                ${settings.styles.calendarioThTD || ""}
              }

              .${settings.calendarClass} th {
                background-color: #f2f2f2;
                ${settings.styles.calendarioTh || ""}
              }

              .${settings.calendarClass} td.outside-month {
                background-color: #ffcccc; /* Fondo rojo para los días que no pertenecen al mes */
                /* Estilo personalizable para outside-month */
                ${settings.styles.outsideMonth || ""}
              }
              .${settings.calendarClass} td.not-selectable {
                opacity:0.6 !important; /* Fondo rojo para los días que no pertenecen al mes */
                /* Estilo personalizable para not-selectable */
                ${settings.styles.notSelectable || ""}
              }

              .${settings.calendarClass} td.valid-day {
                background-color: #c2f0c2; /* Fondo verde para los días válidos */
                ${settings.selectable ? "cursor: pointer;" : ""} 
                ${settings.styles.validDay || ""}
              }

              .${settings.calendarClass} td.selected-day.valid-day {
                cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.697 4.697a.75.75 0 0 1 1.06 0L8 6.94l2.243-2.243a.75.75 0 0 1 1.06 1.06L9.06 8l2.243 2.243a.75.75 0 0 1-1.06 1.06L8 9.06l-2.243 2.243a.75.75 0 0 1-1.06-1.06L6.94 8 4.697 5.757a.75.75 0 0 1 0-1.06z"/></svg>'),
                  auto;
              }

              .${settings.calendarClass} td.selected-day {
                background-color: #2DC3D6 !important; /* Fondo verde más claro para los días seleccionados */
                ${settings.styles.selectedDay || ""}
              }

              /* Estilos personalizables */
              ${settings.styles.customStyles || ""}
            `;

            // Aplicar estilos al contenedor
            $(this).append(`<style>${calendarioStyles}</style>`);

            function obtenerDiaSemana(numero) {
                const diasSemana = settings.daysArrayOrder;

                if (numero >= 0 && numero <= 6) {
                    return diasSemana[numero];
                } else {
                    return "Número de día no válido. Debe estar en el rango de 0 a 6.";
                }
            }

            function calcularInicioMes(year, month) {
                let inicioMes = new Date(year, month, 1).getDay();
                inicioMes = inicioMes === 0 ? 6 : inicioMes - 1;
                if (inicioMes < 0) {
                    inicioMes += 7;
                }
                return inicioMes;
            }

            function obtenerDiasDelMes(year, month) {
                return new Date(year, month + 1, 0).getDate();
            }

            function generarCalendario(e, year, longitudDias = 37) {
                var longitudDias = longitudDias;


                const tabla = document.createElement("table");
                const encabezado = document.createElement("thead");

                const filaCabecera = document.createElement("tr");
                const thAnio = document.createElement("th");
                thAnio.setAttribute("colspan", longitudDias + 1);
                thAnio.textContent = year;
                filaCabecera.appendChild(thAnio);
                encabezado.appendChild(filaCabecera);

                const filaEncabezado = document.createElement("tr");
                const thMes = document.createElement("th");
                thMes.textContent = settings.monthTranslation;
                filaEncabezado.appendChild(thMes);

                const primerDiaAnio = settings.forceFirstDay - 1 ?? calcularInicioMes(year, 0);
                const diasSemana = settings.daysArray
                    .slice(primerDiaAnio + 1)
                    .concat(
                        settings.daysArray.slice(
                            0,
                            primerDiaAnio + 1
                        )
                    );

                for (let i = 0; i < longitudDias; i++) {
                    const thDia = document.createElement("th");
                    var dia = diasSemana[i % 7];
                    thDia.textContent = dia;
                    if (dia == diasSemana[0]) {
                        thDia.style.color = "black";
                        thDia.style.backgroundColor = "#007468";
                    }
                    filaEncabezado.appendChild(thDia);
                }

                encabezado.appendChild(filaEncabezado);
                tabla.appendChild(encabezado);

                const cuerpo = document.createElement("tbody");

                for (let i = 0; i < settings.monthsArray.length; i++) {
                    const filaMes = document.createElement("tr");
                    const tdMes = document.createElement("td");
                    tdMes.textContent = settings.monthsArray[i];
                    filaMes.appendChild(tdMes);

                    const diasEnMes = obtenerDiasDelMes(year, i);
                    const inicioMes = calcularInicioMes(year, i);
                    const diaSemana = obtenerDiaSemana(inicioMes);
                    const inicioSemana = diasSemana.indexOf(diaSemana);

                    let diasMostrados = 0;

                    for (let j = 0; j < longitudDias; j++) {
                        const tdDia = document.createElement("td");
                        const numeroDia = diasMostrados + 1;
                        if (
                            diasMostrados < diasEnMes &&
                            (j >= inicioSemana || diasMostrados > 0)
                        ) {
                            tdDia.textContent = numeroDia;
                            let fecha = new Date(year, i, numeroDia + 1);
                            let fechaFormato = fecha.toISOString().split("T")[0];
                            //aplica el estilo de fecha almacenado settings.selectedDaysFormat a la fecha
                            //Verifica si moment esta cargado si lo esta aplica el formato de settings.selectedDaysFormat
                            if (typeof moment !== 'undefined' && moment(fecha).isValid() && settings.selectedDaysFormat) {
                                fecha = new Date(year, i, numeroDia);
                                fechaFormato = moment(fecha).format(settings.selectedDaysFormat);

                            }


                            tdDia.setAttribute("data-date", fechaFormato);
                            tdDia.classList.add("valid-day");
                            if (settings.selectable) {
                                if (!settings.allowSelectedLessThanCurrentDate) {
                                    if (fecha < new Date()) {
                                        tdDia.classList.add("not-selectable");
                                    }

                                }

                                tdDia.addEventListener("click", function () {
                                    if (!tdDia.classList.contains("outside-month") && !tdDia.classList.contains("not-selectable")) {
                                        if (tdDia.classList.contains("selected-day")) {
                                            tdDia.classList.remove("selected-day");
                                            diasSeleccionados = diasSeleccionados.filter(
                                                (dia) => dia !== fechaFormato
                                            );
                                        } else {
                                            tdDia.classList.add("selected-day");
                                            diasSeleccionados.push(fechaFormato);
                                        }
                                    }
                                });
                            }
                            // Agrega la lógica de selección de días aquí


                            diasMostrados++;
                        } else {
                            tdDia.classList.add("outside-month");
                        }
                        if (j % 7 == 0) {
                            tdDia.style.color = "black";
                            tdDia.style.backgroundColor = "#007468";
                        }

                        filaMes.appendChild(tdDia);
                    }

                    cuerpo.appendChild(filaMes);
                }

                tabla.appendChild(cuerpo);
                $(e).addClass(`${settings.calendarClass}`).append(tabla);
                if (settings.daysToHidenInput) {
                    //Crea un input oculto con id settings.daysToHidenInput para almacenar los dias seleccionados
                    $(e).after(`<input type="hidden" id="${settings.daysToHidenInput}" name="${settings.daysToHidenInput}">`);
                }

            }

            var diasSeleccionados = [];

            function handleClickDia(element) {
                var $td = $(element);

                if ($td.hasClass("valid-day") && !$td.hasClass("selected-day")) {
                    $td.addClass("selected-day");
                    diasSeleccionados.push($td.attr("data-date"));
                } else if ($td.hasClass("selected-day")) {
                    $td.removeClass("selected-day");
                    var index = diasSeleccionados.indexOf($td.attr("data-date"));
                    if (index !== -1) {
                        diasSeleccionados.splice(index, 1);
                    }
                }

                if (settings.daysToHidenInput) {
                    //Si esta opcion esta habilitada al input con id  settings.daysToHidenInput se le asigna el valor de los dias seleccionados

                    $(`#${settings.daysToHidenInput}`).val(JSON.stringify(diasSeleccionados));

                }
            }


            $.fn.getSelectedDays = function () {
                if (!settings.selectable) {
                    console.warn("Selectable is set to false. You can't get selected days.");
                    return [];
                }
                return diasSeleccionados.sort(function (a, b) {
                    return new Date(a) - new Date(b);
                });
            };

            this.on("click", "td.valid-day", handleClickDia);

            generarCalendario(this, settings.year, settings.longitudDias);

            return this;
        };
    })($);


});
