// Script para el formulario de reservación
document.getElementById('reservationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('¡Gracias por tu reservación! Te contactaremos pronto para confirmar los detalles.');
    this.reset();
});

// Script para el menú en dispositivos móviles
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
});

// Cerrar el menú al hacer clic en un enlace
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', function() {
        navLinks.classList.remove('active');
    });
});