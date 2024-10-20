import { createClient } from '@supabase/supabase-js';

// URL y Key de tu proyecto de Supabase
const supabaseUrl = 'https://rpuuislyejuoovdldnss.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwdXVpc2x5ZWp1b292ZGxkbnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzODYyMjgsImV4cCI6MjA0NDk2MjIyOH0.TPtDnn-o-RN0vm69RKvBUEWfgqZUzQAvvKkR5JxFEoM';

// Crear el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const lista = document.getElementById('lista');
const tareaInput = document.getElementById('tareaInput');
const taskForm = document.getElementById('taskForm');

// Función para mostrar las tareas en la lista desde la base de datos
async function mostrarTareas() {
    lista.innerHTML = ''; // Limpiar la lista antes de mostrar

    // Obtener tareas desde la base de datos
    const { data: tareasAlmacenadas, error } = await supabase
        .from('tareas')
        .select('*');
    
    if (error) {
        console.error("Error al cargar tareas:", error.message);
        return;
    }

    tareasAlmacenadas.forEach((tarea, index) => {
        const li = document.createElement('li');
        li.className = "flex justify-between items-center"; // Estilo para alinear el contenido
        li.innerHTML = `
            <span>${tarea.tarea}</span>
            <input type="checkbox" id="checkbox-${index}" ${tarea.completed ? 'checked' : ''}>
        `;
        lista.appendChild(li);

        // Agregar un evento al checkbox
        const checkbox = li.querySelector(`input[type="checkbox"]`);
        checkbox.addEventListener('change', async function () {
            const confirmacion = confirm("¿Seguro que completaste esta tarea?");
            if (confirmacion) {
                // Marcar la tarea como completada en la base de datos
                const { error: updateError } = await supabase
                    .from('tareas')
                    .update({ completed: true })
                    .eq('id', id); // Usar el id de la tarea

                if (updateError) {
                    console.error("Error al actualizar tarea:", updateError.message);
                } else {
                    mostrarTareas(); // Actualizar la lista mostrada
                }
            } else {
                checkbox.checked = false; // Desmarcar si no se confirma
            }
        });
    });
}

// Manejar el evento de envío del formulario
taskForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevenir el envío del formulario
    const nuevaTarea = tareaInput.value.trim();
    if (nuevaTarea) {
        // Agregar la tarea a la base de datos
        const { data, error } = await supabase
            .from('tareas')
            .insert([{ tarea: nuevaTarea, completed: false }]);

        if (error) {
            console.error("Error al agregar tarea:", error.message);
        } else {
            tareaInput.value = ''; // Limpiar el campo de entrada
            mostrarTareas(); // Actualizar la lista mostrada
        }
    }
});

// Cargar las tareas al cargar la página
document.addEventListener('DOMContentLoaded', mostrarTareas);
