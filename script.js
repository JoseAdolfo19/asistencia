
let nombres = [];

const fechaHoy = new Date();
const dia = String(fechaHoy.getDate()).padStart(2, '0');
const mes = String(fechaHoy.getMonth() + 1).padStart(2, '0');
const anio = fechaHoy.getFullYear();
const fechaFormateada = `${dia}/${mes}/${anio}`;
document.getElementById('fechaActual').innerText = fechaFormateada;

function agregarAlumno() {
    const nombreInput = document.getElementById('nombreAlumno');
    const nombre = nombreInput.value.trim();
    if (nombre) {
        nombres.push(nombre);
        nombreInput.value = ''; // Limpiar el input
        actualizarTabla();
    } else {
        alert('Por favor, ingrese un nombre.');
    }
}

function actualizarTabla() {
    const tbody = document.querySelector('#tablaAlumnos tbody');
    tbody.innerHTML = ''; // Limpiar la tabla
    nombres.forEach((nombre, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${nombre}</td>
                    <td>
                        <input type="checkbox" id="asistencia${index + 1}" onchange="actualizarCheckboxes(${index + 1})" /> Asistió
                        <input type="checkbox" id="noAsistencia${index + 1}" onchange="actualizarCheckboxes(${index + 1})" /> No Asistió
                    </td>`;
        tbody.appendChild(row);
    });
}

function marcarTodos(checkBox) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.id.startsWith('asistencia') && checkbox !== checkBox) {
            checkbox.checked = checkBox.checked;
        }
    });
}

function actualizarCheckboxes(index) {
    const asistenciaCheckbox = document.getElementById('asistencia' + index);
    const noAsistenciaCheckbox = document.getElementById('noAsistencia' + index);

    if (asistenciaCheckbox.checked) {
        noAsistenciaCheckbox.checked = false;
    } else if (noAsistenciaCheckbox.checked) {
        asistenciaCheckbox.checked = false;
    }
}

function guardarAsistencia() {
    const asistencia = [];
    for (let i = 0; i < nombres.length; i++) {
        const asistenciaCheckbox = document.getElementById('asistencia' + (i + 1));
        const noAsistenciaCheckbox = document.getElementById('noAsistencia' + (i + 1));
        asistencia.push({
            nombre: nombres[i],
            estado: asistenciaCheckbox.checked ? 'Asistió' : (noAsistenciaCheckbox.checked ? 'No asistió' : 'Sin respuesta')
        });
    }

    mostrarResultados(asistencia);
}

function mostrarResultados(asistencia) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '<h2>Resultados de Asistencia</h2>';
    const table = document.createElement('table');
    table.innerHTML = '<tr><th>Nombre</th><th>Estado</th></tr>';
    asistencia.forEach(alumno => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${alumno.nombre}</td><td>${alumno.estado}</td>`;
        table.appendChild(row);
    });
    resultadoDiv.appendChild(table);
}