document.addEventListener('DOMContentLoaded', function() {
    // Dane o projektach i przypisanych zdjęciach
    const projectData = {
        'Utrecht': {
            folder: 'urtrecht',
            images: ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg']
        },
        'Amsterdam': {
            folder: 'amsterdam',
            images: ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg']
        },
        'Den Haag': {
            folder: 'den haag',
            images: ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg']
        },
        'Amsterdam-Recent': {
            folder: 'amsterdam-2',
            images: ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg']
        }
    };

    // Funkcja do tworzenia elementów galerii
    function createGalleryItem(folder, imagePath, index, total) {
        const figure = document.createElement('figure');
        figure.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = `images/${folder}/${imagePath}`;
        img.alt = 'Project foto';
        img.loading = 'lazy';
        img.classList.add('loading');
        
        // Dodanie numeracji zdjęć
        const counter = document.createElement('div');
        counter.className = 'image-counter';
        counter.textContent = `${index + 1} / ${total}`;
        
        // Obsługa ładowania zdjęcia
        img.onload = () => {
            img.classList.remove('loading');
            figure.style.opacity = '0';
            requestAnimationFrame(() => {
                figure.style.transition = 'opacity 0.5s ease';
                figure.style.opacity = '1';
            });
        };
        
        // Obsługa błędu ładowania
        img.onerror = () => {
            figure.classList.add('error');
            figure.innerHTML = `<p>Nie udało się załadować zdjęcia: ${imagePath}</p>`;
        };
        
        // Dodanie obsługi kliknięcia dla lightboxa
        img.addEventListener('click', () => openLightbox(folder, imagePath, index, projectData[Object.keys(projectData).find(key => projectData[key].folder === folder)].images));
        
        figure.appendChild(img);
        figure.appendChild(counter);
        return figure;
    }

    // Wczytywanie zdjęć do odpowiednich sekcji
    document.querySelectorAll('.project-section').forEach(section => {
        const city = section.getAttribute('data-city');
        const galleryContainer = section.querySelector('.project-gallery');
        
        if (projectData[city]) {
            const { folder, images } = projectData[city];
            
            // Tworzenie kontenera dla przycisków nawigacji
            const navigationContainer = document.createElement('div');
            navigationContainer.className = 'gallery-navigation';
            
            // Dodanie przycisków nawigacji
            const prevButton = document.createElement('button');
            prevButton.className = 'nav-button prev';
            prevButton.innerHTML = '&#10094;';
            
            const nextButton = document.createElement('button');
            nextButton.className = 'nav-button next';
            nextButton.innerHTML = '&#10095;';
            
            // Dodanie kontenera dla zdjęć
            const imageContainer = document.createElement('div');
            imageContainer.className = 'gallery-images';
            
            images.forEach((imagePath, index) => {
                const galleryItem = createGalleryItem(folder, imagePath, index, images.length);
                imageContainer.appendChild(galleryItem);
            });
            
            // Dodanie wszystkich elementów do galerii
            navigationContainer.appendChild(prevButton);
            navigationContainer.appendChild(imageContainer);
            navigationContainer.appendChild(nextButton);
            galleryContainer.appendChild(navigationContainer);
            
            // Obsługa nawigacji
            let currentIndex = 0;
            const totalImages = images.length;
            
            function updateGallery() {
                const offset = -currentIndex * 100;
                imageContainer.style.transform = `translateX(${offset}%)`;
                
                // Aktualizacja stanu przycisków
                prevButton.disabled = currentIndex === 0;
                nextButton.disabled = currentIndex === totalImages - 1;
            }
            
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateGallery();
                }
            });
            
            nextButton.addEventListener('click', () => {
                if (currentIndex < totalImages - 1) {
                    currentIndex++;
                    updateGallery();
                }
            });
            
            // Inicjalizacja stanu przycisków
            updateGallery();
        }
    });

    // Enhanced lightbox functionality with navigation
    function openLightbox(folder, imagePath, currentIndex, allImages) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        
        const content = document.createElement('div');
        content.className = 'lightbox-content';
        
        const img = document.createElement('img');
        img.src = `images/${folder}/${imagePath}`;
        img.alt = 'Project detail';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'close-lightbox';
        closeButton.innerHTML = '&times;';
        
        const prevButton = document.createElement('button');
        prevButton.className = 'lightbox-nav prev';
        prevButton.innerHTML = '&#10094;';
        
        const nextButton = document.createElement('button');
        nextButton.className = 'lightbox-nav next';
        nextButton.innerHTML = '&#10095;';
        
        const counter = document.createElement('div');
        counter.className = 'lightbox-counter';
        counter.textContent = `${currentIndex + 1} / ${allImages.length}`;
        
        content.appendChild(img);
        content.appendChild(closeButton);
        content.appendChild(prevButton);
        content.appendChild(nextButton);
        content.appendChild(counter);
        lightbox.appendChild(content);
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        requestAnimationFrame(() => {
            lightbox.classList.add('active');
        });
        
        function updateImage(newIndex) {
            img.src = `images/${folder}/${allImages[newIndex]}`;
            counter.textContent = `${newIndex + 1} / ${allImages.length}`;
            currentIndex = newIndex;
            
            // Update navigation buttons
            prevButton.style.display = newIndex === 0 ? 'none' : 'block';
            nextButton.style.display = newIndex === allImages.length - 1 ? 'none' : 'block';
        }
        
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = '';
            }, 300);
        };
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        closeButton.addEventListener('click', closeLightbox);
        
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                updateImage(currentIndex - 1);
            }
        });
        
        nextButton.addEventListener('click', () => {
            if (currentIndex < allImages.length - 1) {
                updateImage(currentIndex + 1);
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function escHandler(e) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    document.removeEventListener('keydown', escHandler);
                    break;
                case 'ArrowLeft':
                    if (currentIndex > 0) {
                        updateImage(currentIndex - 1);
                    }
                    break;
                case 'ArrowRight':
                    if (currentIndex < allImages.length - 1) {
                        updateImage(currentIndex + 1);
                    }
                    break;
            }
        });
        
        // Initial update of navigation buttons
        updateImage(currentIndex);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const header = document.querySelector('header');
            const headerHeight = header.offsetHeight;
            
            // Get the target's position relative to the viewport
            const targetPosition = targetSection.getBoundingClientRect().top;
            // Add current scroll position to get absolute position
            const offsetPosition = targetPosition + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in animation to sections
    document.querySelectorAll('.project-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}); 