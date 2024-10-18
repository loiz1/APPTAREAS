const tareasAlmacenadas = JSON.parse(localStorage.getItem('tareas')) || [];
const lista = document.getElementById('lista');
const tareaInput = document.getElementById('tareaInput');
const taskForm = document.getElementById('taskForm');

// Función para mostrar las tareas en la lista
function mostrarTareas() {
    lista.innerHTML = ''; // Limpiar la lista antes de mostrar
    tareasAlmacenadas.forEach((tarea, index) => {
        const li = document.createElement('li');
        li.className = "flex justify-between items-center"; // Estilo para alinear el contenido
        li.innerHTML = `
            <span>${tarea.text}</span>
            <input type="checkbox" id="checkbox-${index}" ${tarea.completed ? 'checked' : ''}>
        `;
        lista.appendChild(li);

        // Agregar un evento al checkbox
        const checkbox = li.querySelector(`input[type="checkbox"]`);
        checkbox.addEventListener('change', function() {
            const confirmacion = confirm("¿Seguro que completo esta tarea?");
            if (confirmacion) {
                // Mover la tarea a completadas
                const tareaCompletada = tareasAlmacenadas.splice(index, 1)[0];
                tareaCompletada.completed = true; // Marcar como completada
                const tareasCompletadas = JSON.parse(localStorage.getItem('tareasCompletadas')) || [];
                tareasCompletadas.push(tareaCompletada);
                localStorage.setItem('tareasCompletadas', JSON.stringify(tareasCompletadas)); // Almacenar en localStorage
                localStorage.setItem('tareas', JSON.stringify(tareasAlmacenadas)); // Actualizar el almacenamiento local
                mostrarTareas(); // Actualizar la lista mostrada
            } else {
                checkbox.checked = false; // Desmarcar si no se confirma
            }
        });
    });
}

// Manejar el evento de envío del formulario
taskForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío del formulario
    const nuevaTarea = tareaInput.value.trim();
    if (nuevaTarea) {
        tareasAlmacenadas.push({ text: nuevaTarea, completed: false }); // Agregar la tarea al arreglo
        localStorage.setItem('tareas', JSON.stringify(tareasAlmacenadas)); // Almacenar en localStorage
        tareaInput.value = ''; // Limpiar el campo de entrada
        mostrarTareas(); // Actualizar la lista mostrada
    }
});

// Cargar las tareas al cargar la página
document.addEventListener('DOMContentLoaded', mostrarTareas);

