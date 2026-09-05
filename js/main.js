document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. VALIDACIÓN PARA EL FORMULARIO DE CONTACTO ---
    const formContacto = document.getElementById("form-contacto");
    
    if (formContacto) {
        formContacto.addEventListener("submit", (e) => {
            // Prevenimos el envío automático por defecto
            e.preventDefault();

            const nombre = document.getElementById("nombre-contacto").value.trim();
            const email = document.getElementById("email-contacto").value.trim();
            const comentarios = document.getElementById("comentarios").value.trim();

            // Expresión regular para validar formato de e-mail estándar
            const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            let errores = [];

            if (nombre === "") {
                errores.push("El campo 'Nombre' no puede estar vacío.");
            }

            if (!regexEmail.test(email)) {
                errores.push("El formato del 'E-mail' no es válido.");
            }

            if (comentarios.length < 5) {
                errores.push("Los 'Comentarios' deben tener al menos 5 caracteres.");
            }

            // Si hay errores, los mostramos y detenemos el envío
            if (errores.length > 0) {
                alert("Errores encontrados:\n\n- " + errores.join("\n- "));
            } else {
                alert("¡Formulario de contacto enviado con éxito!");
                formContacto.submit(); // O envía los datos mediante lógica propia
            }
        });
    }

    // --- 2. VALIDACIÓN PARA EL FORMULARIO DE ALTA DE PRODUCTOS ---
    const formAlta = document.getElementById("form-alta");

    if (formAlta) {
        formAlta.addEventListener("submit", (e) => {
            e.preventDefault();

            const nombreProd = document.getElementById("nombre").value.trim();
            const precio = parseFloat(document.getElementById("precio").value);
            const stock = parseInt(document.getElementById("stock").value);

            let erroresAlta = [];

            if (nombreProd === "") {
                erroresAlta.push("El nombre del producto es obligatorio.");
            }

            if (isNaN(precio) || precio <= 0) {
                erroresAlta.push("El precio debe ser un número mayor a 0.");
            }

            if (isNaN(stock) || stock < 0) {
                erroresAlta.push("El stock debe ser un número válido (0 o mayor).");
            }

            if (erroresAlta.length > 0) {
                alert("Por favor, corrige los siguientes errores en el alta:\n\n- " + erroresAlta.join("\n- "));
            } else {
                alert("¡Producto registrado con éxito!");
                formAlta.submit();
            }
        });
    }

});