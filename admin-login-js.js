document.getElementById('toggle-password').addEventListener('click', function() { // Funcionalidad para mostrar/ocultar contraseña

    const passwordInput = document.getElementById('password');
    const eyeOpen = document.getElementById('eye-open');
    const eyeClosed = document.getElementById('eye-closed');
    
    if (passwordInput.type === 'password') { // Cambia el tipo de input entre "password" y "text"

        passwordInput.type = 'text';
        eyeOpen.classList.add('hidden');
        eyeClosed.classList.remove('hidden');
    } else {
        passwordInput.type = 'password';
        eyeOpen.classList.remove('hidden');
        eyeClosed.classList.add('hidden');
    }
});

document.getElementById('login-form').addEventListener('submit', function(e) { // Validación del formulario de login

    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email === 'cesaradmin@estudiante.com' && password === 'cesarpadrote123') {
        window.location.href = 'admin-panel-html.html';
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.classList.remove('hidden');
    }
});