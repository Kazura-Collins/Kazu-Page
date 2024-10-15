document.addEventListener('DOMContentLoaded', function() {
    // Datos de ejemplo para los carruseles
    const models3D = [
        { type: 'video', src: 'assets/Additional/ave.mp4', alt: '3D Model Thraupis Palmerum' },
        { type: 'image', src: 'assets/Additional/Inosuke.png', alt: 'Inosuke as Lego minifigure' },
        { type: 'image', src: 'assets/Additional/LegoProcess.png', alt: '3D modeling on Rhinoceros' },
        // Añade más modelos 3D aquí
    ];

    const otherProjects = [
        { type: 'image', src: 'assets/Additional/Nagito.png', alt: 'Nagito Komaeda as text' },
        // Añade más proyectos aquí
    ];

    function createCarousel(data, carouselId) {
        const carousel = document.getElementById(carouselId);
        let currentIndex = 0;

        function createItem(item) {
            const div = document.createElement('div');
            div.className = 'carousel-item';
            
            if (item.type === 'image') {
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.alt;
                div.appendChild(img);
            } else if (item.type === 'video') {
                const video = document.createElement('video');
                video.src = item.src;
                video.controls = true;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                div.appendChild(video);
            }
            
            return div;
        }

        function showItem(index) {
            carousel.innerHTML = '';
            const item = createItem(data[index]);
            carousel.appendChild(item);
            
            if (data[index].type === 'video') {
                const video = item.querySelector('video');
                video.play();
            }
        }

        function nextItem() {
            currentIndex = (currentIndex + 1) % data.length;
            showItem(currentIndex);
        }

        function prevItem() {
            currentIndex = (currentIndex - 1 + data.length) % data.length;
            showItem(currentIndex);
        }

        // Crear botones de navegación
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.className = 'carousel-button prev';
        prevButton.addEventListener('click', prevItem);

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.className = 'carousel-button next';
        nextButton.addEventListener('click', nextItem);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'carousel-button-container';
        buttonContainer.appendChild(prevButton);
        buttonContainer.appendChild(nextButton);

        carousel.parentNode.insertBefore(buttonContainer, carousel.nextSibling);

        // Mostrar el primer item
        showItem(currentIndex);
    }

    createCarousel(models3D, '3d-models-carousel');
    createCarousel(otherProjects, 'other-projects-carousel');

    // Función para manejar el carrusel 3D
    function setupCarousel(carouselId) {
        const carousel = document.getElementById(carouselId);
        const items = carousel.querySelectorAll('.carousel-item');
        const itemCount = items.length;
        let currentIndex = 0;
        let startX, startScrollLeft, isDown = false;

        function updateCarousel() {
            const angle = (360 / itemCount) * currentIndex * -1;
            carousel.style.transform = `translateZ(-300px) rotateY(${angle}deg)`;
            
            // Actualiza las clases de los elementos
            items.forEach((item, index) => {
                item.classList.remove('active', 'prev', 'next');
                if (index === currentIndex) {
                    item.classList.add('active');
                } else if (index === (currentIndex - 1 + itemCount) % itemCount) {
                    item.classList.add('prev');
                } else if (index === (currentIndex + 1) % itemCount) {
                    item.classList.add('next');
                }
                
                // Maneja la reproducción de video
                const video = item.querySelector('video');
                if (video) {
                    if (item.classList.contains('active')) {
                        video.play();
                    } else {
                        video.pause();
                    }
                }
            });
        }

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - carousel.offsetLeft;
            startScrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', () => {
            isDown = false;
        });

        carousel.addEventListener('mouseup', () => {
            isDown = false;
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            if (walk > 100) {
                currentIndex = (currentIndex - 1 + itemCount) % itemCount;
                updateCarousel();
                isDown = false;
            } else if (walk < -100) {
                currentIndex = (currentIndex + 1) % itemCount;
                updateCarousel();
                isDown = false;
            }
        });

        // Inicializar el carrusel
        updateCarousel();
    }

    // Iniciar los carruseles
    setupCarousel('3d-models-carousel');
    setupCarousel('other-projects-carousel');

    // Añada esto al final del archivo

    function loadFigmaPrototype(container) {
        if (container.dataset.loaded === 'true') return;

        const img = document.createElement('img');
        img.src = container.dataset.thumbnail; // Asegúrate de añadir este atributo en tu HTML
        img.alt = 'Figma Prototype Thumbnail';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.cursor = 'pointer';

        img.addEventListener('click', () => {
            window.open(container.dataset.src, '_blank');
        });

        const placeholder = container.querySelector('.figma-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        container.appendChild(img);
        container.dataset.loaded = 'true';
    }

    // Implementar lazy loading mejorado
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadFigmaPrototype(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '100px', threshold: 0.1 });

    document.querySelectorAll('.figma-container').forEach(container => {
        const placeholder = document.createElement('div');
        placeholder.className = 'figma-placeholder';
        placeholder.textContent = 'Click to load Figma prototype';
        container.appendChild(placeholder);

        placeholder.addEventListener('click', () => loadFigmaPrototype(container));
        observer.observe(container);
    });

    // Cargar traducciones
    fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            window.translations = data;
            const currentLang = getCurrentLanguage();
            updateLanguage(currentLang);
            document.getElementById('languageSelector').value = currentLang;
        });

    // Función para obtener el idioma actual
    function getCurrentLanguage() {
        return localStorage.getItem('language') || 'en'; // Cambiado de 'es' a 'en'
    }

    // Función para actualizar el idioma
    function updateLanguage(lang) {
        document.documentElement.lang = lang; // Actualiza el atributo lang del HTML
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = translations[lang][key] || key;
        });

        // Actualizar los botones de navegación del carrusel
        document.querySelectorAll('.carousel-button.prev').forEach(button => {
            button.textContent = translations[lang]['previous'];
        });
        document.querySelectorAll('.carousel-button.next').forEach(button => {
            button.textContent = translations[lang]['next'];
        });
    }

    // Evento para cambiar el idioma
    document.getElementById('languageSelector').addEventListener('change', function() {
        const lang = this.value;
        localStorage.setItem('language', lang);
        updateLanguage(lang);
    });
});
