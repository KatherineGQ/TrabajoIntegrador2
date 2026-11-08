document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // ESTADO GLOBAL DEL CARRITO (LOCALSTORAGE)
    // ==========================================
    let carrito = JSON.parse(localStorage.getItem("carrito_aura_neu")) || [];

    const guardarCarritoStorage = () => {
        localStorage.setItem("carrito_aura_neu", JSON.stringify(carrito));
        actualizarBadgeCarrito();
        renderizarContenidoCarrito();
    };

    const actualizarBadgeCarrito = () => {
        const badges = document.querySelectorAll(".badge-carrito");
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        badges.forEach(b => {
            b.textContent = totalItems;
        });
    };

    const formatearPrecio = (valor) => {
        return new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP"
        }).format(valor);
    };

    // ==========================================
    // INTERFAZ DEL CARRITO (DRAWER / MODAL)
    // ==========================================
    const renderizarContenidoCarrito = () => {
        const contenedorItems = document.getElementById("carrito-items-lista");
        const totalElem = document.getElementById("carrito-total-monto");
        if (!contenedorItems || !totalElem) return;

        if (carrito.length === 0) {
            contenedorItems.innerHTML = '<p style="text-align:center; color:#888; margin-top:30px;">Tu carrito está vacío.</p>';
            totalElem.textContent = "$0";
            return;
        }

        let total = 0;
        contenedorItems.innerHTML = "";

        carrito.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            const div = document.createElement("div");
            div.className = "carrito-item";
            div.innerHTML = `
                <img src="${item.foto || 'img/logo.jpeg'}" alt="${item.nombre}">
                <div class="carrito-item-info">
                    <h4>${item.nombre}</h4>
                    <p>${formatearPrecio(item.precio)} x ${item.cantidad} = ${formatearPrecio(subtotal)}</p>
                </div>
                <div class="carrito-item-controles">
                    <button class="btn-menos" data-index="${index}">-</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-mas" data-index="${index}">+</button>
                    <button class="btn-eliminar-item" data-index="${index}" title="Eliminar">🗑️</button>
                </div>
            `;
            contenedorItems.appendChild(div);
        });

        totalElem.textContent = formatearPrecio(total);

        // Listeners para botones dentro del carrito
        contenedorItems.querySelectorAll(".btn-menos").forEach(btn => {
            btn.addEventListener("click", () => {
                const i = parseInt(btn.dataset.index);
                if (carrito[i].cantidad > 1) {
                    carrito[i].cantidad--;
                } else {
                    carrito.splice(i, 1);
                }
                guardarCarritoStorage();
            });
        });

        contenedorItems.querySelectorAll(".btn-mas").forEach(btn => {
            btn.addEventListener("click", () => {
                const i = parseInt(btn.dataset.index);
                carrito[i].cantidad++;
                guardarCarritoStorage();
            });
        });

        contenedorItems.querySelectorAll(".btn-eliminar-item").forEach(btn => {
            btn.addEventListener("click", () => {
                const i = parseInt(btn.dataset.index);
                carrito.splice(i, 1);
                guardarCarritoStorage();
            });
        });
    };

    const abrirCarrito = () => {
        const modal = document.getElementById("modal-carrito");
        if (modal) {
            modal.classList.add("activo");
            renderizarContenidoCarrito();
        }
    };

    const cerrarCarrito = () => {
        const modal = document.getElementById("modal-carrito");
        if (modal) {
            modal.classList.remove("activo");
        }
    };

    // Vincular botones de apertura y cierre de carrito
    const btnsAbrirCarrito = document.querySelectorAll(".btn-abrir-carrito");
    btnsAbrirCarrito.forEach(btn => btn.addEventListener("click", abrirCarrito));

    const btnCerrarCarrito = document.getElementById("btn-cerrar-carrito");
    if (btnCerrarCarrito) btnCerrarCarrito.addEventListener("click", cerrarCarrito);

    const modalCarrito = document.getElementById("modal-carrito");
    if (modalCarrito) {
        modalCarrito.addEventListener("click", (e) => {
            if (e.target === modalCarrito) cerrarCarrito();
        });
    }

    const btnVaciar = document.getElementById("btn-vaciar-carrito");
    if (btnVaciar) {
        btnVaciar.addEventListener("click", () => {
            if (carrito.length === 0) return;
            if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
                carrito = [];
                guardarCarritoStorage();
            }
        });
    }

    // ==========================================
    // ENVÍO DEL PEDIDO AL BACKEND (POST /api/carrito)
    // ==========================================
    const btnCheckout = document.getElementById("btn-checkout");
    if (btnCheckout) {
        btnCheckout.addEventListener("click", async () => {
            if (carrito.length === 0) {
                alert("El carrito está vacío. Agrega productos antes de finalizar la compra.");
                return;
            }

            try {
                btnCheckout.disabled = true;
                btnCheckout.textContent = "Procesando pedido...";

                const res = await fetch("/api/carrito", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(carrito)
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "No se pudo procesar el pedido.");
                }

                const data = await res.json();
                alert("¡Pedido realizado con éxito!\n\nSe ha guardado en el backend y en la base de datos.");

                // Requisito del TP: El carrito deberá vaciarse en el frontend al ser enviada la información
                carrito = [];
                guardarCarritoStorage();
                cerrarCarrito();
            } catch (err) {
                console.error("Error al enviar carrito:", err);
                alert("Hubo un error al procesar el pedido:\n" + err.message);
            } finally {
                btnCheckout.disabled = false;
                btnCheckout.textContent = "Finalizar Compra / Enviar Pedido";
            }
        });
    }

    // Inicializar badge al cargar
    actualizarBadgeCarrito();

    // ==========================================
    // CARGA DINÁMICA DEL CATÁLOGO (index.html)
    // ==========================================
    const contenedorCatalogo = document.querySelector(".contenedor-productos");

    const cargarCatalogoDinamico = async () => {
        if (!contenedorCatalogo) return;

        try {
            const res = await fetch("/api/productos");
            if (!res.ok) throw new Error("No se pudo obtener la lista de productos.");
            const productos = await res.json();

            if (productos.length === 0) {
                contenedorCatalogo.innerHTML = "<p>No hay productos disponibles por el momento.</p>";
                return;
            }

            contenedorCatalogo.innerHTML = "";
            productos.forEach(prod => {
                const card = document.createElement("div");
                card.className = "card-producto";
                card.innerHTML = `
                    <img src="${prod.foto || 'img/logo.jpeg'}" alt="${prod.nombre}">
                    <h2>${prod.nombre}</h2>
                    <p class="precio">${formatearPrecio(prod.precio)}</p>
                    <p class="descripcion-corta">${prod.descCorta || prod.descripcionCorta || ''}</p>
                    <button class="btn-comprar btn-agregar-carrito" data-id="${prod._id}">Agregar al carrito</button>
                `;

                const btnAgregar = card.querySelector(".btn-agregar-carrito");
                btnAgregar.addEventListener("click", () => {
                    const existente = carrito.find(item => item.productoId === prod._id);
                    if (existente) {
                        existente.cantidad++;
                    } else {
                        carrito.push({
                            productoId: prod._id,
                            nombre: prod.nombre,
                            precio: prod.precio,
                            foto: prod.foto,
                            cantidad: 1
                        });
                    }
                    guardarCarritoStorage();
                    abrirCarrito();
                });

                contenedorCatalogo.appendChild(card);
            });
        } catch (error) {
            console.error("Error cargando productos de la API:", error);
            // Si la API aún no está disponible, mantenemos las tarjetas estáticas originales
        }
    };

    if (contenedorCatalogo) {
        cargarCatalogoDinamico();
    }

    // ==========================================
    // FORMULARIO Y CRUD DE ALTA (alta.html)
    // ==========================================
    const formAlta = document.getElementById("form-alta");
    const tablaGestion = document.getElementById("tabla-productos-body");
    let productoEnEdicionId = null;

    const cargarTablaGestion = async () => {
        if (!tablaGestion) return;

        try {
            const res = await fetch("/api/productos");
            if (!res.ok) throw new Error("Error al obtener productos");
            const productos = await res.json();

            tablaGestion.innerHTML = "";
            if (productos.length === 0) {
                tablaGestion.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">No hay productos registrados en la base de datos.</td></tr>`;
                return;
            }

            productos.forEach(prod => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><img src="${prod.foto || 'img/logo.jpeg'}" alt="${prod.nombre}"></td>
                    <td><strong>${prod.nombre}</strong></td>
                    <td>${prod.categoria || '-'}</td>
                    <td>${formatearPrecio(prod.precio)}</td>
                    <td>${prod.stock}</td>
                    <td>
                        <button class="btn-accion-editar" data-id="${prod._id}">Editar</button>
                        <button class="btn-accion-eliminar" data-id="${prod._id}">Eliminar</button>
                    </td>
                `;

                // Botón Editar
                tr.querySelector(".btn-accion-editar").addEventListener("click", () => {
                    cargarProductoEnFormulario(prod);
                });

                // Botón Eliminar
                tr.querySelector(".btn-accion-eliminar").addEventListener("click", async () => {
                    if (confirm(`¿Estás seguro de que deseas eliminar "${prod.nombre}"?`)) {
                        await eliminarProducto(prod._id);
                    }
                });

                tablaGestion.appendChild(tr);
            });
        } catch (err) {
            console.error("Error al cargar tabla de productos:", err);
            tablaGestion.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">No se pudo conectar a la base de datos. Verifica tu conexión de MongoDB Atlas.</td></tr>`;
        }
    };

    const cargarProductoEnFormulario = (prod) => {
        productoEnEdicionId = prod._id;
        document.getElementById("nombre").value = prod.nombre || "";
        document.getElementById("precio").value = prod.precio || "";
        document.getElementById("stock").value = prod.stock || 0;
        document.getElementById("marca").value = prod.marca || "";
        document.getElementById("categoria").value = prod.categoria || "";
        document.getElementById("desc-corta").value = prod.descCorta || prod.descripcionCorta || "";
        document.getElementById("desc-larga").value = prod.descLarga || prod.descripcionLarga || "";
        document.getElementById("envio").value = prod.envio ? "si" : "no";
        document.getElementById("edad-desde").value = prod.edadDesde ?? "";
        document.getElementById("edad-hasta").value = prod.edadHasta ?? "";

        const btnGuardar = formAlta.querySelector(".btn-enviar");
        btnGuardar.textContent = "Actualizar Producto";

        // Botón cancelar edición si no existe
        let btnCancelar = document.getElementById("btn-cancelar-edicion");
        if (!btnCancelar) {
            btnCancelar = document.createElement("button");
            btnCancelar.id = "btn-cancelar-edicion";
            btnCancelar.type = "button";
            btnCancelar.className = "btn-cancelar-edicion";
            btnCancelar.textContent = "Cancelar Edición";
            btnCancelar.addEventListener("click", resetearFormularioAlta);
            btnGuardar.parentNode.insertBefore(btnCancelar, btnGuardar.nextSibling);
        }

        formAlta.scrollIntoView({ behavior: "smooth" });
    };

    const resetearFormularioAlta = () => {
        productoEnEdicionId = null;
        formAlta.reset();
        const btnGuardar = formAlta.querySelector(".btn-enviar");
        btnGuardar.textContent = "Guardar Producto";
        const btnCancelar = document.getElementById("btn-cancelar-edicion");
        if (btnCancelar) btnCancelar.remove();
    };

    const eliminarProducto = async (id) => {
        try {
            const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Error al eliminar el producto");
            alert("Producto eliminado exitosamente");
            cargarTablaGestion();
        } catch (err) {
            console.error("Error al eliminar:", err);
            alert("No se pudo eliminar el producto: " + err.message);
        }
    };

    if (formAlta) {
        formAlta.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombreProd = document.getElementById("nombre").value.trim();
            const precio = parseFloat(document.getElementById("precio").value);
            const stock = parseInt(document.getElementById("stock").value);
            const marca = document.getElementById("marca").value.trim();
            const categoria = document.getElementById("categoria").value.trim();
            const descCorta = document.getElementById("desc-corta").value.trim();
            const descLarga = document.getElementById("desc-larga").value.trim();
            const envio = document.getElementById("envio").value;
            const edadDesde = parseInt(document.getElementById("edad-desde").value) || 0;
            const edadHasta = parseInt(document.getElementById("edad-hasta").value) || 99;

            let erroresAlta = [];
            if (!nombreProd) erroresAlta.push("El nombre del producto es obligatorio.");
            if (isNaN(precio) || precio <= 0) erroresAlta.push("El precio debe ser un número mayor a 0.");
            if (isNaN(stock) || stock < 0) erroresAlta.push("El stock debe ser un número válido (0 o mayor).");
            if (!marca) erroresAlta.push("La marca es obligatoria.");
            if (!categoria) erroresAlta.push("La categoría es obligatoria.");

            if (erroresAlta.length > 0) {
                alert("Por favor, corrige los siguientes errores en el formulario:\n\n- " + erroresAlta.join("\n- "));
                return;
            }

            const productoData = {
                nombre: nombreProd,
                precio,
                stock,
                marca,
                categoria,
                descCorta,
                descLarga,
                envio: envio === "si",
                edadDesde,
                edadHasta,
                foto: "img/logo.jpeg" // Foto por defecto
            };

            try {
                let url = "/api/productos";
                let metodo = "POST";

                if (productoEnEdicionId) {
                    url = `/api/productos/${productoEnEdicionId}`;
                    metodo = "PUT";
                }

                const res = await fetch(url, {
                    method: metodo,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(productoData)
                });

                if (!res.ok) {
                    const errJson = await res.json();
                    throw new Error(errJson.error || "Error al procesar la solicitud");
                }

                alert(productoEnEdicionId ? "¡Producto actualizado exitosamente!" : "¡Producto guardado exitosamente!");
                resetearFormularioAlta();
                cargarTablaGestion();
            } catch (err) {
                console.error("Error al guardar producto:", err);
                alert("Error al guardar en el servidor: " + err.message);
            }
        });

        cargarTablaGestion();
    }

    // ==========================================
    // VALIDACIÓN DE CONTACTO (contacto.html)
    // ==========================================
    const formContacto = document.getElementById("form-contacto");
    if (formContacto) {
        formContacto.addEventListener("submit", (e) => {
            e.preventDefault();

            const nombre = document.getElementById("nombre-contacto").value.trim();
            const email = document.getElementById("email-contacto").value.trim();
            const comentarios = document.getElementById("comentarios").value.trim();

            const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            let errores = [];

            if (nombre === "") errores.push("El campo 'Nombre' no puede estar vacío.");
            if (!regexEmail.test(email)) errores.push("El formato del 'E-mail' no es válido.");
            if (comentarios.length < 5) errores.push("Los 'Comentarios' deben tener al menos 5 caracteres.");

            if (errores.length > 0) {
                alert("Errores encontrados:\n\n- " + errores.join("\n- "));
            } else {
                alert("¡Formulario de contacto validado con éxito!");
                formContacto.reset();
            }
        });
    }

});
