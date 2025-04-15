// Elementos DOM
const chatButton = document.getElementById('chat-button');
const chatWindow = document.getElementById('chat-window');
const minimizeButton = document.getElementById('minimize-chat');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const chatBody = document.getElementById('chat-body');

// Función para mostrar el chatbot
function showChatWindow() {
    chatButton.style.display = 'none';
    chatWindow.classList.remove('hidden');
    chatWindow.classList.add('fade-in');
    setTimeout(() => {
        userInput.focus();
    }, 300);
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
}

// Función para procesar la respuesta del bot (simulada)
function processBotResponse(userMessage) {
    // Respuestas predefinidas basadas en palabras clave
    const keywords = {
        'hola': '¡Hola! ¿En qué puedo ayudarte hoy?',
        'ayuda': 'Puedo ayudarte con información sobre cursos, materiales de estudio y más. ¿Qué necesitas?',
        'curso': 'Tenemos una amplia variedad de cursos. ¿Sobre qué tema te gustaría saber más?',
        'material': 'Contamos con materiales de estudio en formato PDF, videos y prácticas. ¿Qué tipo de material estás buscando?',
        'profesor': 'Nuestros profesores son expertos en sus áreas. ¿Necesitas información sobre algún profesor en particular?',
        'precio': 'Los precios varían según el curso o material. ¿Te interesa alguno en específico?',
        'gracias': '¡De nada! Estoy aquí para ayudarte cuando lo necesites.'
    };
    
    // Respuesta por defecto
    let response = 'Gracias por tu mensaje. ¿Puedes ser más específico sobre lo que necesitas?';
    
    // Buscar palabras clave en el mensaje del usuario
    const lowercaseMessage = userMessage.toLowerCase();
    
    for (const [keyword, reply] of Object.entries(keywords)) {
        if (lowercaseMessage.includes(keyword)) {
            response = reply;
            break;
        }
    }
    
    // Simular tiempo de respuesta
    setTimeout(() => {
        addMessage(response);
    }, 800);
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
        processBotResponse(message);
    }
}

// Event Listeners
chatButton.addEventListener('click', showChatWindow);
minimizeButton.addEventListener('click', hideChatWindow);
sendButton.addEventListener('click', sendMessage);

// Enviar mensaje con Enter
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Inicializar - asegurarse de que el chatbot esté oculto al cargar
document.addEventListener('DOMContentLoaded', () => {
    chatWindow.classList.add('hidden');
});