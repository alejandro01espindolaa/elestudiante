//almacenan info de imagen y promociones
let selectedImageURL = '';
let selectedImageBase64 = '';
let editingPromotionId = null;

document.addEventListener('DOMContentLoaded', () => {
    // se cargan los datos del localstorage 
    loadPromotions();
    loadFiles();
    
    setupFileUpload();
    setupPromotionImageUpload();
    setupMobileMenu();
    setupDefaultPromotions();
    setupFileUploadForm();
    setupPromotionForm();
    
    // eventos para botones de eliminar y editar 

    document.addEventListener('click', e => {
        // Eliminar promociones
        if (e.target.closest('.text-red-500')) {
            const promotionCard = e.target.closest('.promotion-card');
            if (promotionCard && confirm('¿Está seguro de que desea eliminar esta promoción?')) {
                promotionCard.remove();
                savePromotions();
            }
        }

        // Editar promociones
        if (e.target.closest('.text-blue-500')) {
            const promotionCard = e.target.closest('.promotion-card');
            if (promotionCard) {
                const promotionId = promotionCard.getAttribute('data-id');
                editPromotion(promotionId);
            }
        }

        // Eliminar archivos
        if (e.target.closest('.delete-file')) {
            const fileCard = e.target.closest('.file-card');
            if (fileCard && confirm('¿Está seguro de que desea eliminar este archivo?')) {
                fileCard.remove();
                saveFiles();
            }
        }
    });
});

function setupFileUpload() {
    const fileUpload = document.getElementById('file-upload');
    const fileUploadName = document.getElementById('file-upload-name');
    
    if (!fileUpload || !fileUploadName) return;
    
    fileUpload.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            const fileName = this.files[0].name;
            fileUploadName.textContent = fileName;
            
            const fileCategory = document.getElementById('file-category');
            if (!fileCategory) return;
            
            const ext = fileName.toLowerCase().split('.').pop();
            if (['doc', 'docx'].includes(ext)) {
                fileCategory.value = 'word';
            } else if (['xls', 'xlsx'].includes(ext)) {
                fileCategory.value = 'excel';
            } else if (['jpg', 'jpeg', 'png'].includes(ext)) {
                fileCategory.value = 'imagenes';
            }
        } else {
            fileUploadName.textContent = 'Ningún archivo seleccionado';
        }
    });
}

function setupPromotionImageUpload() {
    const promotionImage = document.getElementById('promotion-image');
    if (!promotionImage) return;
    
    promotionImage.addEventListener('change', function() {
        const file = this.files[0];
        const fileName = file?.name || 'Ningún archivo seleccionado';
        const fileNameEl = document.getElementById('file-name');
        if (!fileNameEl) return;
        
        fileNameEl.textContent = fileName;
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                selectedImageBase64 = e.target.result;
                selectedImageURL = URL.createObjectURL(file);
                
                const previewContainer = document.getElementById('image-preview');
                if (previewContainer) {
                    previewContainer.innerHTML = `<img src="${selectedImageURL}" class="h-24 w-auto object-cover rounded" />`;
                    previewContainer.classList.remove('hidden');
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

function setupDefaultPromotions() {
    const defaultPromotions = document.querySelectorAll('#promotions-list .promotion-card:not([data-id])');
    defaultPromotions.forEach((promotion, index) => {
        const promotionId = 'default-' + index;
        promotion.setAttribute('data-id', promotionId);
        
        const imgElement = promotion.querySelector('img');
        if (imgElement) {
            promotion.setAttribute('data-image-base64', imgElement.src);
        }
    });
    
    savePromotions();
}

function setupFileUploadForm() {
    const fileUploadForm = document.getElementById('file-upload-form');
    if (!fileUploadForm) return;
    
    fileUploadForm.addEventListener('submit', e => {
        e.preventDefault();
        
        const fileName = document.getElementById('file-name-input').value;
        const fileCategory = document.getElementById('file-category').value;
        const fileInput = document.getElementById('file-upload');
        
        if (!fileInput || fileInput.files.length === 0) {
            alert('Por favor, selecciona un archivo');
            return;
        }
        
        const file = fileInput.files[0];
        const fileType = getFileTypeFromName(file.name);
        
        if (!validateFileCategory(fileType, fileCategory)) {
            alert('El tipo de archivo no coincide con la categoría seleccionada');
            return;
        }
        
        convertToBase64(file, base64Data => {
            const fileId = 'file-' + Date.now();
            const fileData = {
                id: fileId,
                name: fileName || file.name,
                category: fileCategory,
                type: fileType,
                data: base64Data,
                uploadDate: new Date().toISOString()
            };
            
            const fileCard = createFileCard(fileData);
            const filesContainer = document.getElementById('files-list');
            if (filesContainer) {
                filesContainer.insertBefore(fileCard, filesContainer.firstChild);
                saveFiles();
                fileUploadForm.reset();
                if (document.getElementById('file-upload-name')) {
                    document.getElementById('file-upload-name').textContent = 'Ningún archivo seleccionado';
                }
                
                alert('Archivo subido con éxito!');
            } else {
                alert('Error: No se encontró el contenedor de archivos');
            }
        });
    });
}
//comparativo de tio y categoría, permite un mayor orden y solapacion de documentos
function validateFileCategory(fileType, fileCategory) {
    switch (fileType) {
        case 'word':
            return fileCategory === 'word';
        case 'excel':
            return fileCategory === 'excel';
        case 'image':
            return fileCategory === 'imagenes';
        case 'pdf':
            return fileCategory === 'pdf' || fileCategory === 'word';
        default:
            return false;
    }
}

function setupPromotionForm() {
    const promotionForm = document.getElementById('promotion-form');
    if (!promotionForm) return;
    
    promotionForm.addEventListener('submit', e => {
        e.preventDefault();
        
        const title = document.getElementById('promotion-title').value;
        const description = document.getElementById('promotion-description').value;
        const price = document.getElementById('promotion-price').value;
        const originalPrice = document.getElementById('promotion-original-price').value;
        const discount = document.getElementById('promotion-discount').value;
        
        if (!title || !description || !price || !originalPrice || !discount) {
            alert('Por favor complete todos los campos');
            return;
        }
        
        if (!selectedImageBase64 && !editingPromotionId) {
            alert('Por favor seleccione una imagen para la promoción');
            return;
        }
        
        const imageToUse = selectedImageBase64 || (editingPromotionId ? document.querySelector(`[data-id="${editingPromotionId}"] img`).src : '');
        
        if (editingPromotionId) {
            updateExistingPromotion(editingPromotionId, {
                title, description, price, originalPrice, discount, imageToUse
            });
        } else {
            createNewPromotion({
                title, description, price, originalPrice, discount, imageToUse
            });
        }
        
        savePromotions();
        promotionForm.reset();
        
        const fileNameEl = document.getElementById('file-name');
        if (fileNameEl) {
            fileNameEl.textContent = 'Ningún archivo seleccionado';
        }
        
        const previewContainer = document.getElementById('image-preview');
        if (previewContainer) {
            previewContainer.innerHTML = '';
            previewContainer.classList.add('hidden');
        }
        
        selectedImageURL = '';
        selectedImageBase64 = '';
        
        const submitButton = document.querySelector('#promotion-form button[type="submit"]');
        if (submitButton && editingPromotionId) {
            submitButton.textContent = 'Crear Promoción';
            editingPromotionId = null;
        }
    });
}

function updateExistingPromotion(id, data) {
    const promotionCard = document.querySelector(`[data-id="${id}"]`);
    if (!promotionCard) return;
    
    promotionCard.querySelector('h3').textContent = data.title;
    promotionCard.querySelector('p').textContent = data.description;
    promotionCard.querySelector('.font-bold').textContent = `$${data.price}`;
    promotionCard.querySelector('.line-through').textContent = `$${data.originalPrice}`;
    promotionCard.querySelector('.bg-red-500').textContent = `-${data.discount}%`;
    promotionCard.querySelector('img').src = data.imageToUse;
    promotionCard.setAttribute('data-image-base64', data.imageToUse);
    
    alert('Promoción actualizada con éxito!');
    
    editingPromotionId = null;
    const submitButton = document.querySelector('#promotion-form button[type="submit"]');
    if (submitButton) {
        submitButton.textContent = 'Crear Promoción';
    }
}

function createNewPromotion(data) {
    const promotionId = 'promo-' + Date.now();
    const promotionsContainer = document.getElementById('promotions-list');
    if (!promotionsContainer) return;
    
    const newPromotion = document.createElement('div');
    newPromotion.className = 'promotion-card';
    newPromotion.setAttribute('data-id', promotionId);
    newPromotion.setAttribute('data-image-base64', data.imageToUse);
    newPromotion.innerHTML = `
        <img src="${data.imageToUse}" alt="${data.title}" class="promotion-image">
        <div class="flex-1">
            <div class="flex justify-between">
                <h3 class="text-lg font-bold">${data.title}</h3>
                <span class="bg-red-500 text-white px-2 py-1 rounded-full text-sm">-${data.discount}%</span>
            </div>
            <p class="text-gray-600 text-sm">${data.description}</p>
            <div class="flex justify-between mt-2">
                <div>
                    <span class="font-bold">$${data.price}</span>
                    <span class="text-gray-500 line-through ml-2">$${data.originalPrice}</span>
                </div>
                <div>
                    <button class="text-blue-500 hover:underline mr-2">Editar</button>
                    <button class="text-red-500 hover:underline">Eliminar</button>
                </div>
            </div>
        </div>
    `;
    
    promotionsContainer.prepend(newPromotion);
    alert('Promoción creada con éxito!');
}

function convertToBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = e => callback(e.target.result);
    reader.onerror = () => {
        console.error('Error al convertir archivo a Base64');
        alert('Error al procesar el archivo. Inténtelo de nuevo.');
    };
    reader.readAsDataURL(file);
}

//funciones de guardar y cargar para promociones

function savePromotions() {
    const promotions = [];
    
    document.querySelectorAll('#promotions-list .promotion-card').forEach(card => {
        promotions.push({
            id: card.getAttribute('data-id'),
            title: card.querySelector('h3').textContent,
            description: card.querySelector('p').textContent,
            price: card.querySelector('.font-bold').textContent.replace('$', ''),
            originalPrice: card.querySelector('.line-through').textContent.replace('$', ''),
            discount: card.querySelector('.bg-red-500').textContent.replace('-', '').replace('%', ''),
            imageUrl: card.getAttribute('data-image-base64') || card.querySelector('img').src
        });
    });
    
    localStorage.setItem('promotions', JSON.stringify(promotions));
}

function loadPromotions() {
    const savedPromotions = localStorage.getItem('promotions');
    if (!savedPromotions) return;
    
    const promotions = JSON.parse(savedPromotions);
    const promotionsContainer = document.getElementById('promotions-list');
    if (!promotionsContainer) return;
    
    promotionsContainer.innerHTML = '';
    
    promotions.forEach(promo => {
        const newPromotion = document.createElement('div');
        newPromotion.className = 'promotion-card';
        newPromotion.setAttribute('data-id', promo.id);
        newPromotion.setAttribute('data-image-base64', promo.imageUrl);
        newPromotion.innerHTML = `
            <img src="${promo.imageUrl}" alt="${promo.title}" class="promotion-image">
            <div class="flex-1">
                <div class="flex justify-between">
                    <h3 class="text-lg font-bold">${promo.title}</h3>
                    <span class="bg-red-500 text-white px-2 py-1 rounded-full text-sm">-${promo.discount}%</span>
                </div>
                <p class="text-gray-600 text-sm">${promo.description}</p>
                <div class="flex justify-between mt-2">
                    <div>
                        <span class="font-bold">$${promo.price}</span>
                        <span class="text-gray-500 line-through ml-2">$${promo.originalPrice}</span>
                    </div>
                    <div>
                        <button class="text-blue-500 hover:underline mr-2">Editar</button>
                        <button class="text-red-500 hover:underline">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        
        promotionsContainer.appendChild(newPromotion);
    });
}
//edita promocion
function editPromotion(promotionId) {
    const promotionCard = document.querySelector(`[data-id="${promotionId}"]`);
    if (!promotionCard) return;
    
    const formElements = {
        title: document.getElementById('promotion-title'),
        description: document.getElementById('promotion-description'),
        price: document.getElementById('promotion-price'),
        originalPrice: document.getElementById('promotion-original-price'),
        discount: document.getElementById('promotion-discount')
    };
    
    if (!Object.values(formElements).every(element => element)) return;
    
    formElements.title.value = promotionCard.querySelector('h3').textContent;
    formElements.description.value = promotionCard.querySelector('p').textContent;
    formElements.price.value = promotionCard.querySelector('.font-bold').textContent.replace('$', '');
    formElements.originalPrice.value = promotionCard.querySelector('.line-through').textContent.replace('$', '');
    formElements.discount.value = promotionCard.querySelector('.bg-red-500').textContent.replace('-', '').replace('%', '');
    
    selectedImageURL = promotionCard.querySelector('img').src;
    selectedImageBase64 = promotionCard.getAttribute('data-image-base64') || selectedImageURL;
    
    const previewContainer = document.getElementById('image-preview');
    if (previewContainer) {
        previewContainer.innerHTML = `<img src="${selectedImageURL}" class="h-24 w-auto object-cover rounded" />`;
        previewContainer.classList.remove('hidden');
    }
    
    const submitButton = document.querySelector('#promotion-form button[type="submit"]');
    if (submitButton) {
        submitButton.textContent = 'Actualizar Promoción';
    }
    
    editingPromotionId = promotionId;
    
    const form = document.getElementById('promotion-form');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth' });
    }
}
//determina la extension de larchivo
function getFileTypeFromName(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (['doc', 'docx'].includes(extension)) return 'word';
    if (['xls', 'xlsx'].includes(extension)) return 'excel';
    if (['pdf'].includes(extension)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
    return 'other';
}
//obtiene iconos de archivo, ayuda al usuario a visualizar el tipo
function getFileIcon(fileType) {
    const icons = {
        word: `<svg class="w-6 h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 41H8V7H30L40 17V41Z" fill="#2B579A"/>
            <path d="M30 7V17H40L30 7Z" fill="#1D4F91"/>
            <path d="M15.2 37H12.8L11.3 30.7C11.2 30.3 11.1 29.7 11 29C10.9 28.3 10.8 27.7 10.8 27.2H10.7C10.6 27.7 10.5 28.3 10.3 29C10.2 29.7 10 30.3 9.9 30.7L8.6 37H6.2L4 26.9H6.4L7.5 33.4C7.6 33.9 7.7 34.6 7.8 35.5H7.9C8 34.7 8.2 34 8.3 33.4L9.6 26.9H12L13.3 33.4C13.4 34 13.6 34.7 13.7 35.5H13.8C13.9 34.6 14 33.9 14.1 33.4L15.2 26.9H17.4L15.2 37Z" fill="white"/>
        </svg>`,
        excel: `<svg class="w-6 h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 41H8V7H30L40 17V41Z" fill="#217346"/>
            <path d="M30 7V17H40L30 7Z" fill="#19AB55"/>
            <path d="M15.2 37H12.8L11.3 30.7C11.2 30.3 11.1 29.7 11 29C10.9 28.3 10.8 27.7 10.8 27.2H10.7C10.6 27.7 10.5 28.3 10.3 29C10.2 29.7 10 30.3 9.9 30.7L8.6 37H6.2L4 26.9H6.4L7.5 33.4C7.6 33.9 7.7 34.6 7.8 35.5H7.9C8 34.7 8.2 34 8.3 33.4L9.6 26.9H12L13.3 33.4C13.4 34 13.6 34.7 13.7 35.5H13.8C13.9 34.6 14 33.9 14.1 33.4L15.2 26.9H17.4L15.2 37Z" fill="white"/>
        </svg>`,
        image: `<svg class="w-6 h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 41H8V7H30L40 17V41Z" fill="#31A8E0"/>
            <path d="M30 7V17H40L30 7Z" fill="#1E9AE3"/>
            <path d="M14 37H34V35.6C34 32.6 31.4 30 28.4 30H17.6C14.6 30 12 32.6 12 35.6V37H14Z" fill="white"/>
            <circle cx="24" cy="20" r="5" fill="white"/>
        </svg>`,
        pdf: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>`
    };
    
    return icons[fileType] || icons.pdf;
}
//archivos de localstorage, guarda y carga
function saveFiles() {
    const files = [];
    
    document.querySelectorAll('#files-list .file-card').forEach(card => {
        files.push({
            id: card.getAttribute('data-id'),
            name: card.querySelector('.file-name').textContent,
            category: card.getAttribute('data-category'),
            type: card.getAttribute('data-type'),
            data: card.getAttribute('data-file-content'),
            uploadDate: card.getAttribute('data-upload-date')
        });
    });
    
    if (files.length === 0) {
        localStorage.removeItem('admin_files');
    } else {
        localStorage.setItem('admin_files', JSON.stringify(files));
    }
}

function loadFiles() {
    const savedFiles = localStorage.getItem('admin_files');
    if (!savedFiles) return;
    
    const files = JSON.parse(savedFiles);
    const filesContainer = document.getElementById('files-list');
    if (!filesContainer) return;
    
    files.forEach(file => {
        const fileCard = createFileCard(file);
        filesContainer.appendChild(fileCard);
    });
}
//crea archivos recientes 
function createFileCard(file) {
    const fileCard = document.createElement('div');
    fileCard.className = 'file-card';
    fileCard.setAttribute('data-id', file.id);
    fileCard.setAttribute('data-category', file.category);
    fileCard.setAttribute('data-type', file.type);
    fileCard.setAttribute('data-file-content', file.data);
    fileCard.setAttribute('data-upload-date', file.uploadDate || new Date().toISOString());
    
    fileCard.innerHTML = `
        <div class="flex items-center p-3 border rounded-lg mb-3 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div class="file-icon mr-3 text-gray-600">
                ${getFileIcon(file.type)}
            </div>
            <div class="flex-1">
                <p class="file-name font-medium">${file.name}</p>
                <p class="text-xs text-gray-500">Categoría: ${file.category}</p>
                <p class="text-xs text-gray-500">Subido: ${new Date(file.uploadDate).toLocaleDateString()}</p>
            </div>
            <div class="flex space-x-2">
                <button class="download-file text-blue-500 hover:text-blue-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                </button>
                <button class="delete-file text-red-500 hover:text-red-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    const downloadButton = fileCard.querySelector('.download-file');
    if (downloadButton) {
        downloadButton.addEventListener('click', () => downloadFile(file.id));
    }
    
    return fileCard;
}
//descarga archivo
function downloadFile(fileId) {
    const fileCard = document.querySelector(`[data-id="${fileId}"]`);
    if (!fileCard) return;
    
    const fileName = fileCard.querySelector('.file-name').textContent;
    const fileData = fileCard.getAttribute('data-file-content');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = fileData;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
// Registro de usuarios

document.addEventListener('DOMContentLoaded', function() {
    const userRegistrationForm = document.getElementById('user-registration-form');
    const usersTableBody = document.getElementById('users-table-body');
    const userCount = document.getElementById('user-count');
    const editUserModal = document.getElementById('edit-user-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const editUserForm = document.getElementById('edit-user-form');
    const togglePasswordButton = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('user-password');
    
    const USERS_STORAGE_KEY = 'registeredUsers'; // Usamos una sola clave para ambos sistemas
    
    if (togglePasswordButton && passwordInput) {
        togglePasswordButton.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const eyeIcon = togglePasswordButton.querySelector('svg');
            if (type === 'text') {
                eyeIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                `;
            } else {
                eyeIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                `;
            }
        });
    }
    // Función para generar un ID único
    function generateUserId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    // local storage 
    function saveUsers(users) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
    function getUsers() {
        const users = localStorage.getItem(USERS_STORAGE_KEY);
        return users ? JSON.parse(users) : [];
    }
    //notificacion de confirmacion 
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.zIndex = '1000';
        notification.style.borderRadius = '4px';
        if (document.querySelector('.bg-green-500')) {
            notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white 
                                    ${type === 'success' ? 'bg-green-500' : 
                                    type === 'error' ? 'bg-red-500' : 'bg-blue-500'} 
                                    shadow-lg z-50 transform transition-all duration-500 translate-y-20 opacity-0`;

            setTimeout(() => {
                notification.classList.remove('translate-y-20', 'opacity-0');
            }, 10);
            setTimeout(() => {
                notification.classList.add('translate-y-20', 'opacity-0');
                setTimeout(() => {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 500);
            }, 3000);
        } else {
            notification.className = `notification ${type}`;
            notification.style.top = '20px';
            notification.style.right = '20px';
            notification.style.padding = '10px 20px';
            if (type === 'success') {
                notification.style.backgroundColor = '#4CAF50';
                notification.style.color = 'white';
            } else if (type === 'error') {
                notification.style.backgroundColor = '#F44336';
                notification.style.color = 'white';
            }
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 3000);
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
    }
    
   //validacion de datos de usuarios

function validateUserForm(fullname, email, phone, password, confirmPassword) {
    if (!fullname || !email || !phone || !password || !confirmPassword) {
        showNotification('Por favor complete todos los campos', 'error');
        return false;
    }
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+ [A-Za-zÀ-ÖØ-öø-ÿ ]+$/;
    if (!nameRegex.test(fullname)) {
        showNotification('Por favor ingrese nombre y apellido válidos', 'error');
        return false;
    }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Por favor ingrese un correo electrónico válido', 'error');
        return false;
    }
        const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
        showNotification('El teléfono debe contener solo números (entre 10 y 15 dígitos)', 'error');
        return false;
    }
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        showNotification('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número', 'error');
        return false;
    }
        if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return false;
    }
        const users = getUsers();
        const existingUserByEmail = users.find(user => user.email === email);
    if (existingUserByEmail) {
        showNotification('Este correo electrónico ya está registrado', 'error');
        return false;
    }
        const existingUserByPhone = users.find(user => user.phone === phone);
    if (existingUserByPhone) {
        showNotification('Este número de teléfono ya está registrado', 'error');
        return false;
    }
    return true;
}
    
    // muestra usuarios 

    function displayUsers() {
        if (!usersTableBody) return; 
        
        const users = getUsers();
                if (userCount) {
            userCount.textContent = users.length + (users.length === 1 ? ' usuario' : ' usuarios');
        }
                if (users.length === 0) {
            usersTableBody.innerHTML = `
                <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-4 px-6 text-left" colspan="4">
                        No hay usuarios registrados
                    </td>
                </tr>
            `;
            return;
        }
                usersTableBody.innerHTML = users.map(user => `
            <tr class="border-b border-gray-200 hover:bg-gray-50" data-id="${user.id}">
                <td class="py-3 px-6 text-left whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <span>${user.fullname}</span>
                    </div>
                </td>
                <td class="py-3 px-6 text-left">
                    <div class="flex items-center">
                        <div class="mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span>${user.email}</span>
                    </div>
                </td>
                <td class="py-3 px-6 text-left">
                    <div class="flex items-center">
                        <div class="mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <span>${user.phone}</span>
                    </div>
                </td>
                <td class="py-3 px-6 text-center">
                    <div class="flex item-center justify-center">
                        <button class="edit-user-btn transform hover:text-blue-500 hover:scale-110 transition-all mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button class="delete-user-btn transform hover:text-red-500 hover:scale-110 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
                addUserActionListeners();
    }
    
    // acciones de usuario

    function addUserActionListeners() {
        document.querySelectorAll('.edit-user-btn').forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const userId = row.getAttribute('data-id');
                openEditModal(userId);
            });
        });
        document.querySelectorAll('.delete-user-btn').forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const userId = row.getAttribute('data-id');
                
                if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                    deleteUser(userId);
                }
            });
        });
    }
    function openEditModal(userId) {
        if (!editUserModal) return;
        
        const users = getUsers();
        const user = users.find(u => u.id === userId);
        
        if (user) {
            document.getElementById('edit-user-id').value = user.id;
            document.getElementById('edit-user-fullname').value = user.fullname;
            document.getElementById('edit-user-email').value = user.email;
            document.getElementById('edit-user-phone').value = user.phone;
            editUserModal.classList.remove('hidden');
        }
    } 
    function closeEditModal() {
        if (editUserModal) {
            editUserModal.classList.add('hidden');
        }
    }
    function deleteUser(userId) {
        let users = getUsers();
        users = users.filter(user => user.id !== userId);
        saveUsers(users);
        displayUsers();
        
        showNotification('Usuario eliminado correctamente', 'success');
    }
        displayUsers();
    
    // registro y manejo de usuarios
    if (userRegistrationForm) {
        userRegistrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
                        const fullname = document.getElementById('user-fullname').value.trim();
            const email = document.getElementById('user-email').value.trim();
            const phone = document.getElementById('user-phone').value.trim();
            const password = document.getElementById('user-password').value;
            const confirmPassword = document.getElementById('user-confirm-password').value;
            if (!validateUserForm(fullname, email, phone, password, confirmPassword)) {
                return;
            }
            const user = {
                id: generateUserId(),
                fullname: fullname,
                email: email,
                phone: phone,
                password: password, 
                createdAt: new Date().toISOString()
            };
            
            const users = getUsers();
            
            users.push(user);
            
            saveUsers(users);
            
            displayUsers();
            
            showNotification('Usuario registrado con éxito', 'success');
            
            userRegistrationForm.reset();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeEditModal);
        
        window.addEventListener('click', function(e) {
            if (e.target === editUserModal) {
                closeEditModal();
            }
        });
    }
    //edicion de usuarios
if (editUserForm) {
    editUserForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userId = document.getElementById('edit-user-id').value;
        const fullname = document.getElementById('edit-user-fullname').value;
        const email = document.getElementById('edit-user-email').value;
        const phone = document.getElementById('edit-user-phone').value;
        
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(phone)) {
            showNotification('El teléfono debe contener solo números (entre 10 y 15 dígitos)', 'error');
            return;
        }
        const users = getUsers();
        const phoneExists = users.some(user => user.phone === phone && user.id !== userId);
        
        if (phoneExists) {
            showNotification('Este número de teléfono ya está registrado por otro usuario', 'error');
            return;
        }
        
        const updatedUsers = users.map(user => {
            if (user.id === userId) {
                return {
                    ...user,
                    fullname,
                    email,
                    phone,
                    updatedAt: new Date().toISOString()
                };
            }
            return user;
        });
        saveUsers(updatedUsers);
        displayUsers();
        closeEditModal();
        showNotification('Usuario actualizado correctamente', 'success');
    });
}
});