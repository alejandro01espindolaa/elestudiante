/*Carrucel de fotos*/
document.addEventListener('DOMContentLoaded', function () {
    // Common Swiper configuration
    const swiperConfig = {
        loop: true,
        effect: 'cube', // Cambiar entre 'flip', 'cube', 'cards', 'coverflow'
        grabCursor: true, // Permite arrastrar como en una galería
        centeredSlides: true, // Centra las imágenes
        slidesPerView: 1, // Se ajusta automáticamente
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
    const carouselIds = ['lunch-carousel', 'bebidas-carousel', 'desayunos-carousel', 'platos-carousel'];
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
/*Carrucel de fotos*/

/*trancision de paginas*/
document.addEventListener("DOMContentLoaded", () => {
    // Detectar cuando se hace clic en enlaces internos
    document.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", event => {
        const href = link.getAttribute("href");

        // Ignorar enlaces externos o que no naveguen
        if (href.startsWith("#") || href.includes("javascript")) return;

        event.preventDefault(); // Evita la navegación inmediata

        // Agregar clase para iniciar la transición
        document.body.classList.add("fade-out");

        // Esperar el fin de la animación antes de cambiar la página
        setTimeout(() => {
          window.location.href = href;
        }, 500); // Duración de la animación (coincide con CSS)
      });
    });

    // Restaurar opacidad al cargar la nueva página
    window.addEventListener("pageshow", () => {
      document.body.classList.remove("fade-out");
    });
  });
/*trancision de paginas*/
