let nombres = [];

const fechaHoy = new Date();
const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const dia = String(fechaHoy.getDate()).padStart(2, '0');
const mes = meses[fechaHoy.getMonth()];
const anio = fechaHoy.getFullYear();
const diaSemana = dias[fechaHoy.getDay()];
const fechaFormateada = `${diaSemana}, ${dia} ${mes} ${anio}`;
document.getElementById('fechaActual').innerText = fechaFormateada;

function agregarAlumno() {
    const nombreInput = document.getElementById('nombreAlumno');
    const nombre = nombreInput.value.trim();
    if (nombre) {
        nombres.push(nombre);
        nombreInput.value = '';
        nombreInput.focus();
        actualizarTabla();
    } else {
        alert('Por favor, ingrese un nombre.');
        nombreInput.focus();
    }
}

// Permitir agregar alumno presionando Enter
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('nombreAlumno').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            agregarAlumno();
        }
    });
});

function actualizarTabla() {
    const tbody = document.querySelector('#tablaAlumnos tbody');
    const tablaPrimero = document.getElementById('tablaPrimero');
    
    tbody.innerHTML = '';
    
    if (nombres.length === 0) {
        tablaPrimero.style.display = 'block';
        return;
    } else {
        tablaPrimero.style.display = 'none';
    }
    
    nombres.forEach((nombre, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="text-center fw-bold">${index + 1}</td>
            <td>${nombre}</td>
            <td>
                <div class="d-flex gap-2 justify-content-center">
                    <div class="form-check form-check-inline">
                        <input type="radio" class="form-check-input asistencia-radio" 
                               id="asistencia${index + 1}" name="estado${index + 1}" 
                               value="asistio" />
                        <label class="form-check-label" for="asistencia${index + 1}">
                            <i class="fas fa-check text-success me-1"></i>Asistió
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input type="radio" class="form-check-input asistencia-radio" 
                               id="noAsistencia${index + 1}" name="estado${index + 1}" 
                               value="noAsistio" />
                        <label class="form-check-label" for="noAsistencia${index + 1}">
                            <i class="fas fa-times text-danger me-1"></i>No Asistió
                        </label>
                    </div>
                </div>
            </td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarAlumno(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>`;
        tbody.appendChild(row);
    });
}

function marcarTodos(checkBox) {
    const radios = document.querySelectorAll('input[type="radio"][value="asistio"]');
    radios.forEach(radio => {
        radio.checked = checkBox.checked;
    });
}

function eliminarAlumno(index) {
    if (confirm('¿Deseas eliminar este alumno de la lista?')) {
        nombres.splice(index, 1);
        actualizarTabla();
    }
}

function guardarAsistencia() {
    if (nombres.length === 0) {
        alert('Debes agregar al menos un alumno.');
        return;
    }

    const asistencia = [];
    for (let i = 0; i < nombres.length; i++) {
        const asistenciaRadio = document.getElementById('asistencia' + (i + 1));
        const noAsistenciaRadio = document.getElementById('noAsistencia' + (i + 1));
        
        let estado = 'Sin marcar';
        if (asistenciaRadio && asistenciaRadio.checked) {
            estado = 'Asistió';
        } else if (noAsistenciaRadio && noAsistenciaRadio.checked) {
            estado = 'No Asistió';
        }
        
        asistencia.push({
            numero: i + 1,
            nombre: nombres[i],
            estado: estado
        });
    }

    mostrarResultados(asistencia);
}

function mostrarResultados(asistencia) {
    const resultadoDiv = document.getElementById('resultado');
    const resultadoContainer = document.getElementById('resultadoContainer');
    
    resultadoDiv.innerHTML = '';
    
    const table = document.createElement('table');
    table.className = 'table table-striped table-hover';
    
    const thead = document.createElement('thead');
    thead.className = 'table-light';
    thead.innerHTML = `
        <tr>
            <th class="text-center" style="width: 5%">#</th>
            <th>Apellidos y Nombres</th>
            <th class="text-center" style="width: 25%">Estado</th>
        </tr>`;
    table.appendChild(thead);
    
    const tbody = document.createElement('tbody');
    asistencia.forEach(alumno => {
        const row = document.createElement('tr');
        const badgeClass = alumno.estado === 'Asistió' ? 'bg-success' : (alumno.estado === 'No Asistió' ? 'bg-danger' : 'bg-warning');
        const badgeIcon = alumno.estado === 'Asistió' ? 'fa-check' : (alumno.estado === 'No Asistió' ? 'fa-times' : 'fa-question');
        
        row.innerHTML = `
            <td class="text-center fw-bold">${alumno.numero}</td>
            <td>${alumno.nombre}</td>
            <td class="text-center">
                <span class="badge ${badgeClass}">
                    <i class="fas ${badgeIcon} me-1"></i>${alumno.estado}
                </span>
            </td>`;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    
    resultadoDiv.appendChild(table);
    
    // Mostrar estadísticas
    const estadisticas = document.createElement('div');
    estadisticas.className = 'row mt-4';
    
    const asistieron = asistencia.filter(a => a.estado === 'Asistió').length;
    const noAsistieron = asistencia.filter(a => a.estado === 'No Asistió').length;
    const sinMarcar = asistencia.filter(a => a.estado === 'Sin marcar').length;
    const porcentaje = Math.round((asistieron / asistencia.length) * 100);
    
    estadisticas.innerHTML = `
        <div class="col-md-3">
            <div class="card bg-success text-white">
                <div class="card-body">
                    <h5 class="card-title">Asistieron</h5>
                    <p class="card-text fs-3">${asistieron}</p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-danger text-white">
                <div class="card-body">
                    <h5 class="card-title">No Asistieron</h5>
                    <p class="card-text fs-3">${noAsistieron}</p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-warning text-white">
                <div class="card-body">
                    <h5 class="card-title">Sin Marcar</h5>
                    <p class="card-text fs-3">${sinMarcar}</p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-info text-white">
                <div class="card-body">
                    <h5 class="card-title">Porcentaje</h5>
                    <p class="card-text fs-3">${porcentaje}%</p>
                </div>
            </div>
        </div>`;
    
    resultadoDiv.appendChild(estadisticas);
    resultadoContainer.style.display = 'block';
}

function exportarPDF() {
    if (nombres.length === 0) {
        alert('Debes agregar al menos un alumno para exportar.');
        return;
    }

    // Crear un nuevo documento PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configuración del PDF
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;

    // Encabezado
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Sistema de Control de Asistencia', pageWidth / 2, margin + 10, { align: 'center' });

    // Fecha
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Fecha: ${fechaFormateada}`, pageWidth / 2, margin + 20, { align: 'center' });

    // Tabla de asistencia
    const tableData = nombres.map((nombre, index) => {
        const asistenciaRadio = document.getElementById('asistencia' + (index + 1));
        const noAsistenciaRadio = document.getElementById('noAsistencia' + (index + 1));
        
        let estado = 'Sin marcar';
        if (asistenciaRadio && asistenciaRadio.checked) {
            estado = 'Asistió';
        } else if (noAsistenciaRadio && noAsistenciaRadio.checked) {
            estado = 'No Asistió';
        }
        
        return [index + 1, nombre, estado];
    });

    doc.autoTable({
        head: [['#', 'Apellidos y Nombres', 'Estado']],
        body: tableData,
        startY: margin + 30,
        margin: margin,
        headStyles: {
            fillColor: [102, 126, 234],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: {
            textColor: [50, 50, 50]
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240]
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 15 },
            1: { cellWidth: 'auto' },
            2: { halign: 'center', cellWidth: 40 }
        }
    });

    // Estadísticas al final
    const asistieron = nombres.filter((_, i) => {
        const radio = document.getElementById('asistencia' + (i + 1));
        return radio && radio.checked;
    }).length;
    
    const noAsistieron = nombres.filter((_, i) => {
        const radio = document.getElementById('noAsistencia' + (i + 1));
        return radio && radio.checked;
    }).length;
    
    const sinMarcar = nombres.length - asistieron - noAsistieron;
    const porcentaje = Math.round((asistieron / nombres.length) * 100);

    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Resumen de Asistencia:', margin, finalY);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`Total de alumnos: ${nombres.length}`, margin, finalY + 7);
    doc.text(`Asistieron: ${asistieron}`, margin, finalY + 14);
    doc.text(`No asistieron: ${noAsistieron}`, margin, finalY + 21);
    doc.text(`Sin marcar: ${sinMarcar}`, margin, finalY + 28);
    doc.text(`Porcentaje de asistencia: ${porcentaje}%`, margin, finalY + 35);

    // Descargar el PDF
    const nombreArchivo = `Asistencia_${dia}-${mes.substring(0, 3)}-${anio}.pdf`;
    doc.save(nombreArchivo);
}