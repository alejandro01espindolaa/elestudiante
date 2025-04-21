// Script para el formulario de reservación
document.getElementById('reservationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('¡Gracias por tu reservación! Te contactaremos pronto para confirmar los detalles.');
    this.reset();
});

