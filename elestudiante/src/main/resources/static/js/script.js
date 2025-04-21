/*Carrucel de fotos*/
document.addEventListener('DOMContentLoaded', function() {
    // Swiper Initialization
    const swiper = new Swiper('.swiper', {
        loop: true,
        effect: 'coverflow',  // Efecto de galería 'flip' 'cube' 'cards' 'coverflow'
        grabCursor: true, // Permite arrastrar como en una galería
        centeredSlides: true, // Centra las imágenes
        slidesPerView: 'auto', // Se ajusta automáticamente
        coverflowEffect: {
            rotate: 30, // Rotación de las imágenes
            stretch: 0, // No se estiran
            depth: 300, // Profundidad del efecto 3D
            modifier: 1, // Modificador de velocidad
            slideShadows: true, // Sombras en los lados
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        speed: 800, // Velocidad de transición
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.remove('-translate-x-full');
        mobileMenu.classList.add('translate-x-0');
    });

    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('-translate-x-full');
    });

    // Close mobile menu when clicking outside
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove('translate-x-0');
            mobileMenu.classList.add('-translate-x-full');
        }
    });
});
/*Carrucel de fotos*/

/*Funcion Carrito y Arrastee con mouse y dedo*/
document.addEventListener("DOMContentLoaded", () => {
    const carritoContenido = document.getElementById("carrito-contenido");
    const botonFinalizar = document.getElementById("finalizar-compra");
    const carrito = document.getElementById("carrito-lateral");
    const iconoCarrito = document.getElementById("icono-carrito");

    let pedidos = JSON.parse(localStorage.getItem("carrito")) || [];
    let isDragging = false, offsetX, offsetY;

    function actualizarCarrito() {
        if (!carritoContenido) return;
        
        // Guardamos el título y el botón para restaurarlos después
        const tituloCarrito = document.createElement("h3");
        tituloCarrito.textContent = "Carrito de Compras";
        
        // Limpiamos el contenido
        carritoContenido.innerHTML = "";
        
        // Añadimos el título
        carritoContenido.appendChild(tituloCarrito);

        if (pedidos.length === 0) {
            const parrafoVacio = document.createElement("p");
            parrafoVacio.textContent = "El carrito está vacío.";
            carritoContenido.appendChild(parrafoVacio);
            
            if (botonFinalizar) botonFinalizar.style.display = "none";
            return;
        }

        const lista = document.createElement("ul");
        lista.classList.add("list-group");

        pedidos.forEach((pedido, index) => {
            const pedidoItem = document.createElement("li");
            pedidoItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            pedidoItem.innerHTML = `
                <span><strong>${pedido.producto}</strong> - ${pedido.ingredientes.join(", ")} - <strong>${pedido.precioTotal}</strong></span>
                <button class="btn btn-danger btn-sm" data-index="${index}">Eliminar</button>
            `;
            
            // Añadir el manejador de eventos al botón después de crearlo
            const deleteButton = pedidoItem.querySelector('.btn-danger');
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Evita que el clic llegue al carrito
                eliminarPedido(index);
            });
            
            lista.appendChild(pedidoItem);
        });

        carritoContenido.appendChild(lista);
        
        // Asegurarnos de que el botón esté visible y dentro del carritoContenido
        if (botonFinalizar) {
            // Removemos el botón de su posición actual (si existe) para añadirlo al final
            if (botonFinalizar.parentNode) {
                botonFinalizar.parentNode.removeChild(botonFinalizar);
            }
            
            carritoContenido.appendChild(botonFinalizar);
            botonFinalizar.style.display = "block";
            botonFinalizar.classList.add("mt-3", "w-100"); // Añade margen superior y ancho completo
        }
    }

    window.eliminarPedido = (index) => {
        pedidos.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(pedidos));
        actualizarCarrito();
    };

    // Evitar que los clics en el contenido del carrito cierren el carrito
    if (carritoContenido) {
        carritoContenido.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    actualizarCarrito();

    if (botonFinalizar) {
        botonFinalizar.addEventListener("click", async (event) => {
            event.stopPropagation();
        
            if (pedidos.length === 0) {
                alert("No hay pedidos en el carrito.");
                return;
            }
        
            // Pedir datos del cliente
            const nombre = prompt("Ingrese su nombre:");
            const telefono = prompt("Ingrese su número de teléfono:");
            const direccion = prompt("Ingrese su dirección:");
        
            if (!nombre || !telefono || !direccion) {
                alert("Debe ingresar nombre, teléfono y dirección.");
                return;
            }
        
            // Obtener la fecha actual
            const fechaActual = new Date();
            const fechaFormateada = fechaActual.toLocaleString();
        
            // Agregar estos datos a cada pedido
            const pedidosConDatos = pedidos.map(pedido => ({
                id: pedido.id,
                producto: pedido.producto,
                ingredientes: pedido.ingredientes,
                precioTotal: pedido.precioTotal,
                nombre: nombre,
                direccion: direccion, // Se guarda la dirección
                telefono: telefono,
                fecha: fechaFormateada
            }));
        
            try {
                const response = await fetch("http://localhost:3000/ordenes/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(pedidosConDatos),
                });
        
                if (!response.ok) {
                    throw new Error("Error al enviar los pedidos al servidor");
                }
        
                const result = await response.json();
                console.log("Pedidos guardados:", result);
                alert("¡Compra finalizada! Tus pedidos han sido enviados.");
        
                pedidos = [];
                localStorage.setItem("carrito", JSON.stringify(pedidos));
                actualizarCarrito();
            } catch (error) {
                console.error("Error al guardar los pedidos:", error);
            }
        });               
    }

    // Evento para expandir/colapsar el carrito
    carrito.addEventListener("click", (e) => {
        if (!isDragging) {
            carrito.classList.toggle("expanded");
            iconoCarrito.style.display = carrito.classList.contains("expanded") ? "none" : "block";
        }
    });

    document.addEventListener("click", (e) => {
        // Verifica si el clic ocurrió fuera del carrito
        if (!carrito.contains(e.target) && !e.target.matches("#carrito, #carrito *")) {
            carrito.classList.remove("expanded");
            iconoCarrito.style.display = "block"; // Asegúrate de que el ícono se muestre cuando se cierre el carrito
        }
    });
});
/*Funcion Carrito y Arrastee con mouse y dedo*/

/*Boton ofertas*/
document.getElementById("ofertas-btn").addEventListener("click", function (event) {
    // Detener la propagación del evento para evitar que el clic cierre el panel inmediatamente
    event.stopPropagation();
    document.getElementById("ofertas-panel").classList.toggle("activo");
});

// Escuchar clics en todo el documento
document.addEventListener("click", function (event) {
    const ofertasPanel = document.getElementById("ofertas-panel");

    // Si el panel está activo y el clic no ocurrió dentro del panel, lo cerramos
    if (ofertasPanel.classList.contains("activo") && !ofertasPanel.contains(event.target)) {
        ofertasPanel.classList.remove("activo");
    }
});
/*Boton ofertas*/

/*Mensaje desliza*/
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar y ocultar el mensaje "Desliza" solo una vez
    function toggleSwiperMessage() {
        const message = document.getElementById('swiper-message');

        // Mostrar el mensaje
        message.classList.add('visible');

        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
            message.classList.remove('visible');
        }, 3000);
    }

    // Llama a la función una sola vez después de que se carga el DOM
    toggleSwiperMessage();
});
/*Mensaje desliza*/
