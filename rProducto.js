let productosRegistrados = [];

document
  .getElementById("formRegistrarProducto")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    // Limpiar alertas anteriores
    const alertContainer = document.getElementById("alertContainer");
    alertContainer.innerHTML = ""; // Limpiar el contenido de las alertas anteriores

    // Obtener los valores de los campos
    const nombreProducto = document.getElementById("nombreProducto").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;

    // Arreglo para almacenar los errores
    let errores = [];

    // Validaciones
    if (!nombreProducto) {
      errores.push("El nombre del producto es obligatorio.");
    }
    if (!descripcion) {
      errores.push("La descripción es obligatoria.");
    }
    if (!precio) {
      errores.push("El precio es obligatorio.");
    } else if (precio <= 0) {
      errores.push("El precio debe ser un número mayor que 0.");
    }

    // Verificar si el producto ya está registrado
    if (
      productosRegistrados.some(
        (producto) =>
          producto.nombreProducto.toLowerCase() === nombreProducto.toLowerCase()
      )
    ) {
      errores.push("El producto ya está registrado.");
    }

    // Si hay errores, mostramos las alertas de Bootstrap
    if (errores.length > 0) {
      // Crear las alertas y agregarlas al contenedor de alertas
      errores.forEach((error) => {
        const alert = document.createElement("div");
        alert.classList.add("alert", "alert-danger", "mt-2");
        alert.textContent = error;
        alertContainer.appendChild(alert);
      });
      return; // Detener el proceso si hay errores
    }

    // Crear el objeto JSON con los datos del formulario
    const producto = {
      nombreProducto: nombreProducto,
      descripcion: descripcion,
      precio: parseFloat(precio),
    };

    // Agregar el producto al arreglo de productos registrados
    productosRegistrados.push(producto);

    // Mostrar el objeto JSON en la consola
    console.log("Producto registrado:", JSON.stringify(producto));

    // Mostrar alerta de éxito
    const successAlert = document.createElement("div");
    successAlert.classList.add("alert", "alert-success", "mt-2");
    successAlert.textContent = "Producto registrado correctamente.";
    alertContainer.appendChild(successAlert);

    // Limpiar el formulario al realizar un registro
    document.getElementById("formRegistrarProducto").reset();

    // Limpiar alertas después de unos segundos
    setTimeout(() => {
      alertContainer.innerHTML = "";
    }, 3000);
  });
