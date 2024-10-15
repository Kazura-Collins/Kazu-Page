document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');

    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        nav.classList.remove('active');
      });
    });

    // Cerrar el menú si se hace clic fuera de él
    document.addEventListener('click', function(event) {
      const isClickInsideNav = nav.contains(event.target);
      const isClickOnMenuToggle = menuToggle.contains(event.target);
      
      if (!isClickInsideNav && !isClickOnMenuToggle && nav.classList.contains('active')) {
        nav.classList.remove('active');
      }
    });

    const projectTitles = document.querySelectorAll('.project-title');
    const currentProjectTitle = document.querySelector('.current-project-title');
    const projectImage = document.querySelector('.image');
    const projectDescription = document.querySelector('.project-description');
    const behanceButton = document.querySelector('.behance-button');
    let currentIndex = 0;

    const projects = [
      { 
        id: 'CloudTrack',
        image: 'assets/images/CloudTrack.png', 
        behanceUrl: 'https://www.behance.net/gallery/200259979/CloudTrack-GDO'
      },
      { 
        id: 'RitualOfMadness',
        image: 'assets/images/RitualOfMadness.gif', 
        behanceUrl: 'https://www.behance.net/gallery/193558463/Ritual-of-madness-Card-Game'
      },
      { 
        id: 'EditorialDesign',
        image: 'assets/images/editorial.png', 
        behanceUrl: 'https://www.behance.net/gallery/140643145/Editorial-design-Interview-with-Shigeru-Miyamoto'
      },
      { 
        id: 'Fitmate',
        image: 'assets/images/fitmate.png', 
        behanceUrl: 'https://www.behance.net/gallery/169200729/FitMate-UXUI'
      },
      { 
        id: 'SignalChase',
        image: 'assets/images/signal.png', 
        behanceUrl: 'https://www.behance.net/gallery/187551597/Signal-Chase'
      },
      { 
        id: 'IntuRedesign',
        image: 'assets/images/intu.png', 
        behanceUrl: 'https://www.behance.net/gallery/186202987/INTU-Makeover'
      },
      { 
        id: 'UruguayBranding',
        image: 'assets/images/uruguay.png', 
        behanceUrl: 'https://www.behance.net/gallery/139613811/Uruguay-Country-brand'
      }
    ];


    let autoChangeInterval;
    const normalInterval = 10000;
    const extendedInterval = 40000;

    function startAutoChange(interval) {
      clearInterval(autoChangeInterval);
      autoChangeInterval = setInterval(() => {
        nextProject();
      }, interval);
    }

    function updateProject(index, shouldScroll = false) {
      const projectContent = document.querySelector('.flex-column');
      const currentLang = localStorage.getItem('language') || 'en';
      
      // Fade out
      projectContent.classList.add('fade-out');
      
      setTimeout(() => {
        const project = projects[index];
        const projectTranslation = translations[currentLang].projects[project.id];
        
        if (projectTranslation) {
          currentProjectTitle.textContent = projectTranslation.title;
          projectImage.style.backgroundImage = `url(${project.image})`;
          projectDescription.textContent = projectTranslation.description;
          behanceButton.href = project.behanceUrl;
        } else {
          console.error(`Translation not found for project: ${project.id}`);
        }
        
        // Actualizar clase activa
        projectTitles.forEach((title, i) => {
          if (i === index) {
            title.classList.add('active');
          } else {
            title.classList.remove('active');
          }
        });

        // Fade in
        setTimeout(() => {
          projectContent.classList.remove('fade-out');
          projectContent.classList.add('fade-in');
        }, 50);

        // Scroll suave a la sección de proyectos en dispositivos móviles solo si se hizo clic
        if (shouldScroll && window.innerWidth <= 768) {
          setTimeout(() => {
            const projectsSection = document.getElementById('projects');
            const yOffset = -50; // Ajusta este valor para subir más o menos
            const y = projectsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({top: y, behavior: 'smooth'});
          }, 100);
        }

        clearInterval(autoChangeInterval);
        startAutoChange(shouldScroll ? extendedInterval : normalInterval);
      }, 500); // Este tiempo debe coincidir con la duración de la transición en CSS
    }

    function nextProject() {
      currentIndex = (currentIndex + 1) % projects.length;
      updateProject(currentIndex, false);
    }

    // Iniciar con el primer proyecto
    updateProject(0);

    // Iniciar el cambio automático con el intervalo normal
    startAutoChange(normalInterval);

    // Permitir clic en los títulos para cambiar manualmente
    projectTitles.forEach((title, index) => {
      title.addEventListener('click', () => {
        currentIndex = index;
        updateProject(currentIndex, true);
      });
    });

     // Cargar traducciones
     let translations;
    fetch('./translations.json')
      .then(response => response.json())
      .then(data => {
        translations = data;
        const lang = localStorage.getItem('language') || 'en';
        changeLanguage(lang);
        document.getElementById('languageSelector').value = lang;
      })
      .catch(error => console.error('Error cargando las traducciones:', error));

    // Función para cambiar el idioma
    function changeLanguage(lang) {
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
          element.textContent = translations[lang][key];
        }
      });
      document.documentElement.lang = lang;
      localStorage.setItem('language', lang);
      
      // Actualizar el proyecto actual con el nuevo idioma
      updateProject(currentIndex);
    }

    // Evento para cambiar el idioma
    document.getElementById('languageSelector').addEventListener('change', function() {
      changeLanguage(this.value);
      if (window.innerWidth <= 768) {
        // Cerrar el menú móvil después de cambiar el idioma
        document.querySelector('nav').classList.remove('active');
      }
    });
  });
