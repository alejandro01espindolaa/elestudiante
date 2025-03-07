document.addEventListener('DOMContentLoaded', function () {
    // Common Swiper configuration
    const swiperConfig = {
        loop: true,
        effect: 'coverflow', // Cambiar entre 'flip', 'cube', 'cards', 'coverflow'
        grabCursor: true, // Permite arrastrar como en una galería
        centeredSlides: true, // Centra las imágenes
        slidesPerView: 'auto', // Se ajusta automáticamente
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        speed: 800, // Velocidad de transición
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // Configuración para los efectos
        flipEffect: {
            slideShadows: false, // Quitar sombras en el efecto 'flip'
        },
        cubeEffect: {
            shadow: false, // Quitar sombras detrás del carrusel
            slideShadows: false, // Quitar sombras de los slides
        },
        cardsEffect: {
            slideShadows: false, // Quitar sombras en el efecto 'cards'
        },
        coverflowEffect: {
            slideShadows: false, // Quitar sombras en los lados
        },
    };

    // Initialize all carousels
    const carouselIds = ['comidas-carousel', 'bebidas-carousel', 'postres-carousel'];
    const swipers = carouselIds.map(id => new Swiper(`#${id}`, swiperConfig));

    // Mobile Menu Toggle (only need this once)
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