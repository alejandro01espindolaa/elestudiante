// Elementos DOM
const chatButton = document.getElementById('chat-button');
const chatWindow = document.getElementById('chat-window');
const minimizeButton = document.getElementById('minimize-chat');
const restartButton = document.getElementById('restart-chat');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const chatBody = document.getElementById('chat-body');

// Variable para seguir el estado actual del menú
let currentMenu = 'main';
let cartItems = [];

// Función para reiniciar el chat
function restartChat() {
    // Eliminar historial del localStorage
    localStorage.removeItem('elEstudiante_chatHistory');
    
    // Eliminar todos los mensajes excepto el primero (mensaje de bienvenida)
    while (chatBody.children.length > 1) {
        chatBody.removeChild(chatBody.lastChild);
    }
    
    // Animación para el botón
    restartButton.classList.add('spinning');
    setTimeout(() => {
        restartButton.classList.remove('spinning');
    }, 600);
    
    // Añadir mensaje de reinicio y mostrar el menú principal
    addMessage('Chat reiniciado. ¿En qué puedo ayudarte hoy?');
    currentMenu = 'main';
    showMainMenu();
}

// Función para mostrar el chatbot
function showChatWindow() {
    chatButton.style.display = 'none';
    chatWindow.classList.remove('hidden');
    chatWindow.classList.add('fade-in');
    setTimeout(() => {
        userInput.focus();
    }, 300);
    
    // Cargar el historial cuando se abre el chat
    loadChatHistory();
    
    // Si no hay historial, mostrar el menú principal
    if (chatBody.children.length <= 1) {
        showMainMenu();
    }
}

// Función para ocultar el chatbot
function hideChatWindow() {
    chatWindow.classList.remove('fade-in');
    chatWindow.classList.add('fade-out');
    
    setTimeout(() => {
        chatWindow.classList.add('hidden');
        chatWindow.classList.remove('fade-out');
        chatButton.style.display = 'flex';
    }, 300);
}

// Función para agregar un mensaje al chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user' : 'bot');
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = text;
    
    messageContent.appendChild(messageParagraph);
    messageDiv.appendChild(messageContent);
    chatBody.appendChild(messageDiv);
    
    // Scroll al final de la conversación
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Guardar mensaje en el historial
    saveChatMessage(text, isUser);
}

// Función para guardar un mensaje en localStorage
function saveChatMessage(text, isUser) {
    // Obtener el historial existente o crear uno nuevo
    let chatHistory = JSON.parse(localStorage.getItem('elEstudiante_chatHistory')) || [];
    
    // Agregar el nuevo mensaje
    chatHistory.push({
        text: text,
        isUser: isUser,
        timestamp: new Date().getTime()
    });
    
    // Guardar en localStorage
    localStorage.setItem('elEstudiante_chatHistory', JSON.stringify(chatHistory));
}

// Función para cargar el historial desde localStorage
function loadChatHistory() {
    // Limpiar el chatBody excepto el mensaje de bienvenida
    while (chatBody.children.length > 1) {
        chatBody.removeChild(chatBody.lastChild);
    }
    
    // Obtener el historial
    const chatHistory = JSON.parse(localStorage.getItem('elEstudiante_chatHistory')) || [];
    
    // Si no hay historial, no hacer nada más
    if (chatHistory.length === 0) return;
    
    // Mostrar los mensajes del historial
    chatHistory.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(message.isUser ? 'user' : 'bot');
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = message.text;
        
        messageContent.appendChild(messageParagraph);
        messageDiv.appendChild(messageContent);
        
        // Agregar al final del chatBody
        chatBody.appendChild(messageDiv);
    });
    
    // Scroll al final de la conversación
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Función para mostrar el menú principal
function showMainMenu() {
    currentMenu = 'main';
    const menuText = `¿En qué puedo ayudarte? Selecciona una opción:
a) Información general
b) Acerca de nosotros
c) Reservaciones
d) Lista de productos
e) Realizar orden
f) Contactos
g) Reseñas
i) Próximos eventos`;
    
    addMessage(menuText);
}

// Función para mostrar el menú de reservaciones
function showReservationMenu() {
    currentMenu = 'reservation';
    const menuText = `Menú de Reservaciones:
a) Realizar reservación
b) Mirar próximos eventos
c) Validar reservación
d) Volver al menú principal`;
    
    addMessage(menuText);
}

// Función para mostrar el menú de productos
function showProductsMenu() {
    currentMenu = 'products';
    const menuText = `Lista de Productos:
a) Visualizar menú alimentos
b) Visualizar menú bebidas no alcohólicas
c) Visualizar menú bebidas alcohólicas
d) Visualizar menú de postres
e) Miscelánea
f) Volver al menú principal`;
    
    addMessage(menuText);
}

// Función para mostrar el menú de contactos
function showContactMenu() {
    currentMenu = 'contact';
    const menuText = `Contactos:
a) Contacto WhatsApp
b) Contacto Facebook
c) Contacto TikTok
d) Contacto correo electrónico
e) Contacto Instagram
f) Volver al menú principal`;
    
    addMessage(menuText);
}

// Función para mostrar el menú de eventos
function showEventsMenu() {
    currentMenu = 'events';
    const menuText = `Próximos Eventos:
a) Visualizar eventos
b) Realizar acción de eventos
c) Volver al menú principal`;
    
    addMessage(menuText);
}

// Función para manejar la pregunta de agregar al carrito
function askAddToCart() {
    addMessage("¿Deseas agregar un producto al carrito? (sí/no)");
    currentMenu = 'add_to_cart';
}

// Función para preguntar dónde volver
function askWhereToReturn() {
    addMessage("¿Deseas ver el menú anterior o el menú principal? (anterior/principal)");
    currentMenu = 'return_menu';
}

// Función para procesar la respuesta del bot
function processBotResponse(userMessage) {
    const lowercaseMessage = userMessage.toLowerCase().trim();
    
    // Si el usuario escribe "menu" en cualquier momento, mostrar el menú principal
    if (lowercaseMessage === 'menu' || lowercaseMessage === 'menú') {
        showMainMenu();
        return;
    }
    
    // Procesar respuesta según el menú actual
    switch (currentMenu) {
        case 'main':
            processMainMenu(lowercaseMessage);
            break;
        case 'reservation':
            processReservationMenu(lowercaseMessage);
            break;
        case 'products':
            processProductsMenu(lowercaseMessage);
            break;
        case 'contact':
            processContactMenu(lowercaseMessage);
            break;
        case 'events':
            processEventsMenu(lowercaseMessage);
            break;
        case 'add_to_cart':
            processAddToCart(lowercaseMessage);
            break;
        case 'return_menu':
            processReturnMenu(lowercaseMessage);
            break;
        case 'product_detail':
            processProductDetail(lowercaseMessage);
            break;
        default:
            // Si no estamos en un menú reconocido, volver al menú principal
            addMessage("No entendí tu solicitud. Te muestro el menú principal.");
            showMainMenu();
            break;
    }
}

// Procesar selección del menú principal
function processMainMenu(message) {
    switch (message) {
        case 'a':
            addMessage("Aquí tienes información general sobre nuestro restaurante. Somos un lugar especializado en comida tradicional, con un ambiente acogedor y excelente servicio.");
            setTimeout(showMainMenu, 1500);
            break;
        case 'b':
            addMessage("Acerca de nosotros: Somos un restaurante con más de 10 años de experiencia, dedicados a ofrecer la mejor experiencia gastronómica con ingredientes frescos y de calidad.");
            setTimeout(showMainMenu, 1500);
            break;
        case 'c':
            showReservationMenu();
            break;
        case 'd':
            showProductsMenu();
            break;
        case 'e':
            if (cartItems.length > 0) {
                addMessage(`Tu orden actual contiene ${cartItems.length} productos. ¿Deseas finalizar tu pedido? (sí/no)`);
                currentMenu = 'finish_order';
            } else {
                addMessage("Tu carrito está vacío. Primero debes agregar productos desde el menú de productos.");
                setTimeout(showMainMenu, 1500);
            }
            break;
        case 'f':
            showContactMenu();
            break;
        case 'g':
            addMessage("¡Nos encantaría conocer tu opinión! Por favor, comparte tu experiencia con nosotros (calificación de 1-5 estrellas y comentario).");
            currentMenu = 'review';
            break;
        case 'i':
            showEventsMenu();
            break;
        default:
            addMessage("No entendí tu selección. Por favor, elige una opción del menú (a-i).");
            showMainMenu();
            break;
    }
}

// Procesar selección del menú de reservaciones
function processReservationMenu(message) {
    switch (message) {
        case 'a':
            addMessage("Para realizar una reservación, necesitamos los siguientes datos: nombre, fecha, hora y número de personas. ¿Podrías proporcionarnos esta información?");
            currentMenu = 'make_reservation';
            break;
        case 'b':
            addMessage("Próximamente tendremos: Noche de música en vivo (viernes), Degustación de vinos (sábado), Buffet dominical (domingo). ¿Te gustaría hacer una reservación para alguno de estos eventos?");
            currentMenu = 'reserve_event';
            break;
        case 'c':
            addMessage("Para validar tu reservación, por favor proporciónanos el código de confirmación que recibiste.");
            currentMenu = 'validate_reservation';
            break;
        case 'd':
            showMainMenu();
            break;
        default:
            addMessage("No entendí tu selección. Por favor, elige una opción del menú de reservaciones (a-d).");
            showReservationMenu();
            break;
    }
}

// Procesar selección del menú de productos
function processProductsMenu(message) {
    let menuType = "";
    
    switch (message) {
        case 'a':
            menuType = "alimentos";
            addMessage("Nuestro menú de alimentos incluye: Entradas, Platos fuertes, Ensaladas y Especialidades del chef.");
            break;
        case 'b':
            menuType = "bebidas no alcohólicas";
            addMessage("Nuestras bebidas no alcohólicas incluyen: Aguas frescas, Refrescos, Café, Té y Jugos naturales.");
            break;
        case 'c':
            menuType = "bebidas alcohólicas";
            addMessage("Nuestras bebidas alcohólicas incluyen: Vinos, Cervezas artesanales, Cócteles clásicos y Especialidades de la casa.");
            break;
        case 'd':
            menuType = "postres";
            addMessage("Nuestros postres incluyen: Pasteles, Helados artesanales, Frutas de temporada y Especialidades tradicionales.");
            break;
        case 'e':
            menuType = "miscelánea";
            addMessage("En nuestra sección de miscelánea encontrarás: Souvenirs, Productos para llevar, Salsas caseras y Artículos promocionales.");
            break;
        case 'f':
            showMainMenu();
            return;
        default:
            addMessage("No entendí tu selección. Por favor, elige una opción del menú de productos (a-f).");
            showProductsMenu();
            return;
    }
    
    if (menuType) {
        currentMenu = 'product_detail';
        setTimeout(() => {
            askAddToCart();
        }, 1000);
    }
}

// Procesar selección del menú de contactos
function processContactMenu(message) {
    switch (message) {
        case 'a':
            addMessage("Nuestro WhatsApp: +52 123 456 7890. Horario de atención: Lunes a Domingo de 9:00 a 22:00 hrs.");
            setTimeout(showContactMenu, 1500);
            break;
        case 'b':
            addMessage("Encuéntranos en Facebook como: @ElRestaurante. No olvides seguirnos para ver nuestras promociones.");
            setTimeout(showContactMenu, 1500);
            break;
        case 'c':
            addMessage("Síguenos en TikTok: @ElRestauranteTikTok. Compartimos videos de nuestros platillos y eventos.");
            setTimeout(showContactMenu, 1500);
            break;
        case 'd':
            addMessage("Nuestro correo electrónico: contacto@elrestaurante.com. Te responderemos a la brevedad.");
            setTimeout(showContactMenu, 1500);
            break;
        case 'e':
            addMessage("Encuéntranos en Instagram como: @ElRestauranteIG. Comparte tus fotos y etiquétanos.");
            setTimeout(showContactMenu, 1500);
            break;
        case 'f':
            showMainMenu();
            break;
        default:
            addMessage("No entendí tu selección. Por favor, elige una opción del menú de contactos (a-f).");
            showContactMenu();
            break;
    }
}

// Procesar selección del menú de eventos
function processEventsMenu(message) {
    switch (message) {
        case 'a':
            addMessage("Próximos eventos: \n- Viernes: Noche de música en vivo (19:00 hrs) \n- Sábado: Degustación de vinos (18:00 hrs) \n- Domingo: Buffet dominical (13:00 hrs)");
            setTimeout(showEventsMenu, 2000);
            break;
        case 'b':
            addMessage("¿Qué acción te gustaría realizar con nuestros eventos? \n1) Reservar un lugar \n2) Solicitar más información");
            currentMenu = 'event_action';
            break;
        case 'c':
            showMainMenu();
            break;
        default:
            addMessage("No entendí tu selección. Por favor, elige una opción del menú de eventos (a-c).");
            showEventsMenu();
            break;
    }
}

// Procesar respuesta a la pregunta de agregar al carrito
function processAddToCart(message) {
    if (message === 'si' || message === 'sí' || message === 's') {
        addMessage("Producto agregado al carrito exitosamente.");
        cartItems.push({
            id: cartItems.length + 1,
            name: "Producto " + (cartItems.length + 1),
            price: Math.floor(Math.random() * 200) + 50
        });
        askWhereToReturn();
    } else if (message === 'no' || message === 'n') {
        askWhereToReturn();
    } else {
        addMessage("Por favor responde 'sí' o 'no'.");
    }
}

// Procesar respuesta a la pregunta de dónde volver
function processReturnMenu(message) {
    if (message === 'anterior' || message === 'a') {
        showProductsMenu();
    } else if (message === 'principal' || message === 'p') {
        showMainMenu();
    } else {
        addMessage("No entendí tu respuesta. Por favor, indica si deseas volver al menú 'anterior' o al 'principal'.");
    }
}

// Procesar detalle de producto
function processProductDetail(message) {
    // Esta función podría ampliarse para mostrar productos específicos
    askAddToCart();
}

// Función para enviar mensaje
function sendMessage() {
    const message = userInput.value.trim();
    
    if (message) {
        // Agregar mensaje del usuario
        addMessage(message, true);
        
        // Limpiar input
        userInput.value = '';
        
        // Procesar respuesta
        setTimeout(() => {
            processBotResponse(message);
        }, 500);
    }
}

// Event Listeners
chatButton.addEventListener('click', showChatWindow);
minimizeButton.addEventListener('click', hideChatWindow);
restartButton.addEventListener('click', restartChat);
sendButton.addEventListener('click', sendMessage);

// Enviar mensaje con Enter
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Inicializar - asegurarse de que el chatbot esté oculto al cargar
document.addEventListener('DOMContentLoaded', () => {
    const chatWasOpen = localStorage.getItem('elEstudiante_chatOpen') === 'true';
    
    if (chatWasOpen) {
        showChatWindow();
    } else {
        chatWindow.classList.add('hidden');
    }
});

// Guardar el estado del chat al cerrar/recargar la página
window.addEventListener('beforeunload', () => {
    localStorage.setItem('elEstudiante_chatOpen', chatWindow.classList.contains('hidden') ? 'false' : 'true');
});