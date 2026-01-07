// ===== JAVASCRIPT RESPONSIVO PARA SISTEMA DE BIENESTAR INSTITUCIONAL =====

// Detectar dispositivo móvil
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroid = /Android/.test(navigator.userAgent);

// Configuración inicial
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupMobileOptimizations();
    setupResponsiveFeatures();
    initializeBootstrapComponents();
    setupFormValidation();
    setupInteractiveFeatures();
});

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
function initializeApp() {
    // Agregar clases de dispositivo al body
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
    if (isIOS) {
        document.body.classList.add('ios-device');
    }
    if (isAndroid) {
        document.body.classList.add('android-device');
    }
    
    // Detectar orientación
    handleOrientationChange();
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);
}

// ===== OPTIMIZACIONES PARA MÓVILES =====
function setupMobileOptimizations() {
    if (isMobile) {
        // Prevenir zoom en inputs en iOS
        if (isIOS) {
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.style.fontSize = '16px';
            });
        }
        
        // Mejorar scroll en móviles
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Prevenir zoom en doble tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Optimizar navegación móvil
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler) {
            navbarToggler.addEventListener('click', function() {
                document.body.classList.toggle('nav-open');
            });
        }
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.navbar')) {
                document.body.classList.remove('nav-open');
            }
        });
    }
}

// ===== CARACTERÍSTICAS RESPONSIVAS =====
function setupResponsiveFeatures() {
    // Lazy loading para imágenes
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Animaciones en scroll
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.card, .alert').forEach(el => {
            animationObserver.observe(el);
        });
    }
}

// ===== COMPONENTES DE BOOTSTRAP =====
function initializeBootstrapComponents() {
    // Inicializar tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Inicializar popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Auto-hide alerts
    setTimeout(function() {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(function(alert) {
            if (alert.classList.contains('alert-success') || alert.classList.contains('alert-info')) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        });
    }, 5000);
}

// ===== VALIDACIÓN DE FORMULARIOS =====
function setupFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    Array.prototype.slice.call(forms).forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                
                // Scroll al primer error en móviles
                if (isMobile) {
                    const firstInvalid = form.querySelector(':invalid');
                    if (firstInvalid) {
                        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        firstInvalid.focus();
                    }
                }
            }
            form.classList.add('was-validated');
        }, false);
    });
    
    // Validación específica para cédula (solo números, 10 dígitos)
    const cedulaInputs = document.querySelectorAll('input[name="cedula"], input[id="cedula"]');
    cedulaInputs.forEach(input => {
        // Solo permitir números
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 10) {
                this.value = this.value.substring(0, 10);
            }
        });
        
        // Validar al perder foco
        input.addEventListener('blur', function() {
            validateCedula(this);
        });
        
        // Validar en tiempo real
        input.addEventListener('input', function() {
            if (this.value.length === 10) {
                validateCedula(this);
            } else if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
            }
        });
    });
    
    // Validación específica para teléfono (solo números, 10 dígitos)
    const telefonoInputs = document.querySelectorAll('input[name="telefono"], input[id="telefono"], input[type="tel"]');
    telefonoInputs.forEach(input => {
        // Solo permitir números
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 10) {
                this.value = this.value.substring(0, 10);
            }
        });
        
        // Validar al perder foco
        input.addEventListener('blur', function() {
            validateTelefono(this);
        });
        
        // Validar en tiempo real
        input.addEventListener('input', function() {
            if (this.value.length === 10) {
                validateTelefono(this);
            } else if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
            }
        });
    });
    
    // Validación en tiempo real para otros campos
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        // Saltar cédula y teléfono que ya tienen validación específica
        if (input.name === 'cedula' || input.id === 'cedula' || 
            input.name === 'telefono' || input.id === 'telefono' || input.type === 'tel') {
            return;
        }
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

// Función para validar cédula (exactamente 10 dígitos numéricos)
function validateCedula(input) {
    const value = input.value.trim();
    const isValid = /^\d{10}$/.test(value);
    
    input.classList.toggle('is-valid', isValid && value.length > 0);
    input.classList.toggle('is-invalid', !isValid && value.length > 0);
    
    if (!isValid && value.length > 0) {
        const feedback = input.parentElement.querySelector('.invalid-feedback') || 
                        input.nextElementSibling?.classList.contains('invalid-feedback') ? 
                        input.nextElementSibling : null;
        if (feedback) {
            feedback.textContent = 'La cédula debe contener exactamente 10 números';
        }
    }
    
    return isValid;
}

// Función para validar teléfono (exactamente 10 dígitos numéricos)
function validateTelefono(input) {
    const value = input.value.trim();
    const isValid = /^\d{10}$/.test(value);
    
    input.classList.toggle('is-valid', isValid && value.length > 0);
    input.classList.toggle('is-invalid', !isValid && value.length > 0);
    
    if (!isValid && value.length > 0) {
        const feedback = input.parentElement.querySelector('.invalid-feedback') || 
                        input.nextElementSibling?.classList.contains('invalid-feedback') ? 
                        input.nextElementSibling : null;
        if (feedback) {
            feedback.textContent = 'El teléfono debe contener exactamente 10 números';
        }
    }
    
    return isValid;
}

// ===== CARACTERÍSTICAS INTERACTIVAS =====
function setupInteractiveFeatures() {
    // Confirmación para acciones destructivas
    const deleteButtons = document.querySelectorAll('[data-confirm]');
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            const message = button.getAttribute('data-confirm');
            if (!confirm(message)) {
                e.preventDefault();
            }
        });
    });
    
    // Mejorar experiencia de botones
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('btn-touch');
        });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('btn-touch');
            }, 150);
        });
    });
    
    // Mejorar experiencia de cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.classList.add('card-touch');
        });
        
        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('card-touch');
            }, 150);
        });
    });
}

// ===== MANEJO DE ORIENTACIÓN Y REDIMENSIONAMIENTO =====
function handleOrientationChange() {
    setTimeout(() => {
        const isLandscape = window.innerWidth > window.innerHeight;
        document.body.classList.toggle('landscape', isLandscape);
        document.body.classList.toggle('portrait', !isLandscape);
        
        // Ajustar viewport height en móviles
        if (isMobile) {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
    }, 100);
}

function handleResize() {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        handleOrientationChange();
        updateResponsiveClasses();
    }, 250);
}

// ===== CLASES RESPONSIVAS DINÁMICAS =====
function updateResponsiveClasses() {
    const width = window.innerWidth;
    
    // Remover clases anteriores
    document.body.classList.remove('xs', 'sm', 'md', 'lg', 'xl');
    
    // Agregar clase actual
    if (width < 576) {
        document.body.classList.add('xs');
    } else if (width < 768) {
        document.body.classList.add('sm');
    } else if (width < 992) {
        document.body.classList.add('md');
    } else if (width < 1200) {
        document.body.classList.add('lg');
    } else {
        document.body.classList.add('xl');
    }
}

// ===== FUNCIONES UTILITARIAS =====

// Función para mostrar loading en botones
function showLoading(button, text = 'Cargando...') {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>' + text;
    button.disabled = true;
    button.classList.add('loading');
    
    return function() {
        button.innerHTML = originalText;
        button.disabled = false;
        button.classList.remove('loading');
    };
}

// Función para validar campos individuales
function validateField(field) {
    const isValid = field.checkValidity();
    field.classList.toggle('is-valid', isValid);
    field.classList.toggle('is-invalid', !isValid);
    return isValid;
}

// Función para formatear fechas
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para formatear horas
function formatTime(timeString) {
    const time = new Date('1970-01-01T' + timeString);
    return time.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Función para detectar conexión
function isOnline() {
    return navigator.onLine;
}

// Función para mostrar notificación offline
function showOfflineNotification() {
    if (!isOnline()) {
        const notification = document.createElement('div');
        notification.className = 'alert alert-warning alert-dismissible fade show position-fixed';
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
        notification.innerHTML = `
            <i class="fas fa-wifi me-2"></i>
            <strong>Sin conexión</strong><br>
            Algunas funciones pueden no estar disponibles.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(notification);
    }
}

// ===== MANEJO DE CONEXIÓN =====
window.addEventListener('online', function() {
    const offlineNotification = document.querySelector('.alert-warning');
    if (offlineNotification) {
        offlineNotification.remove();
    }
});

window.addEventListener('offline', showOfflineNotification);

// ===== OPTIMIZACIONES DE RENDIMIENTO =====

// Throttle para eventos de scroll
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounce para eventos de resize
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// ===== MENÚ DESPLEGABLE MEJORADO =====
function setupDropdownMenu() {
    const dropdownToggle = document.querySelector('#navbarDropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (dropdownToggle && dropdownMenu) {
        // Mejorar la experiencia del dropdown
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle del dropdown
            const isOpen = dropdownMenu.classList.contains('show');
            
            if (isOpen) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });
        
        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                closeDropdown();
            }
        });
        
        // Cerrar dropdown al presionar Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeDropdown();
            }
        });
        
        // Función para abrir dropdown
        function openDropdown() {
            dropdownMenu.classList.add('show');
            dropdownToggle.setAttribute('aria-expanded', 'true');
            
            // Agregar clase para animación
            dropdownMenu.style.animation = 'dropdownFadeIn 0.3s ease-in-out';
            
            // Focus en el primer elemento
            const firstItem = dropdownMenu.querySelector('.dropdown-item');
            if (firstItem) {
                firstItem.focus();
            }
        }
        
        // Función para cerrar dropdown
        function closeDropdown() {
            dropdownMenu.classList.remove('show');
            dropdownToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Mejorar navegación con teclado
        dropdownMenu.addEventListener('keydown', function(e) {
            const items = Array.from(dropdownMenu.querySelectorAll('.dropdown-item'));
            const currentIndex = items.indexOf(document.activeElement);
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % items.length;
                    items[nextIndex].focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
                    items[prevIndex].focus();
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    document.activeElement.click();
                    break;
            }
        });
        
        // Efectos hover mejorados
        const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                // Remover hover de otros elementos
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('hover-effect');
                    }
                });
                // Agregar hover al elemento actual
                item.classList.add('hover-effect');
            });
            
            item.addEventListener('mouseleave', function() {
                item.classList.remove('hover-effect');
            });
        });
    }
}

// ===== MANEJO DE SIDEBAR EN MÓVILES Y TABLETS =====
function setupMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    
    const isMobileOrTablet = window.innerWidth <= 991;
    
    // Crear overlay si no existe
    let sidebarOverlay = document.querySelector('.sidebar-overlay');
    if (!sidebarOverlay) {
        sidebarOverlay = document.createElement('div');
        sidebarOverlay.className = 'sidebar-overlay';
        sidebarOverlay.addEventListener('click', closeSidebar);
        document.body.appendChild(sidebarOverlay);
    }
    
    // Crear botón toggle si no existe y estamos en móvil/tablet
    let sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
    if (!sidebarToggleBtn && isMobileOrTablet) {
        sidebarToggleBtn = document.createElement('button');
        sidebarToggleBtn.className = 'sidebar-toggle-btn';
        sidebarToggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        sidebarToggleBtn.setAttribute('aria-label', 'Abrir menú');
        sidebarToggleBtn.setAttribute('type', 'button');
        sidebarToggleBtn.addEventListener('click', toggleSidebar);
        document.body.appendChild(sidebarToggleBtn);
    }
    
    // Agregar botón de cerrar al sidebar si no existe
    let closeBtn = sidebar.querySelector('.sidebar-close-btn');
    if (!closeBtn) {
        closeBtn = document.createElement('button');
        closeBtn.className = 'sidebar-close-btn';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.setAttribute('aria-label', 'Cerrar menú');
        closeBtn.setAttribute('type', 'button');
        closeBtn.addEventListener('click', closeSidebar);
        const sidebarContent = sidebar.querySelector('.sidebar-content');
        if (sidebarContent) {
            sidebarContent.insertBefore(closeBtn, sidebarContent.firstChild);
        }
    }
    
    // Cerrar sidebar al hacer clic en un enlace (solo en móvil/tablet)
    if (isMobileOrTablet) {
        const sidebarLinks = sidebar.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Pequeño delay para permitir la navegación
                setTimeout(closeSidebar, 150);
            });
        });
    }
    
    // Cerrar sidebar con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('show')) {
            closeSidebar();
        }
    });
    
    // Función para abrir sidebar
    function openSidebar() {
        if (window.innerWidth > 991) return; // No abrir en desktop
        
        sidebar.classList.add('show');
        if (sidebarOverlay) sidebarOverlay.classList.add('show');
        document.body.classList.add('sidebar-open');
        document.body.style.overflow = 'hidden';
        
        // Prevenir scroll del body
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
    }
    
    // Función para cerrar sidebar
    function closeSidebar() {
        sidebar.classList.remove('show');
        if (sidebarOverlay) sidebarOverlay.classList.remove('show');
        document.body.classList.remove('sidebar-open');
        
        // Restaurar scroll del body
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }
    
    // Función para toggle sidebar
    function toggleSidebar() {
        if (sidebar.classList.contains('show')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }
    
    // Exponer funciones globalmente
    window.openSidebar = openSidebar;
    window.closeSidebar = closeSidebar;
    window.toggleSidebar = toggleSidebar;
    
    // Ajustar sidebar en resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (window.innerWidth > 991) {
                // Desktop - cerrar sidebar y ocultar botones
                closeSidebar();
                if (sidebarToggleBtn) sidebarToggleBtn.style.display = 'none';
                if (sidebarOverlay) sidebarOverlay.style.display = 'none';
            } else {
                // Móvil/Tablet - mostrar botón toggle
                if (sidebarToggleBtn) sidebarToggleBtn.style.display = 'flex';
            }
        }, 250);
    });
    
    // Inicializar estado según tamaño de pantalla
    function initializeSidebarState() {
        if (window.innerWidth > 991) {
            // Desktop
            closeSidebar();
            if (sidebarToggleBtn) sidebarToggleBtn.style.display = 'none';
            if (sidebarOverlay) sidebarOverlay.style.display = 'none';
            if (closeBtn) closeBtn.style.display = 'none';
        } else {
            // Móvil/Tablet
            if (sidebarToggleBtn) sidebarToggleBtn.style.display = 'flex';
            if (closeBtn) closeBtn.style.display = 'flex';
        }
    }
    
    // Inicializar al cargar
    initializeSidebarState();
    
    // Re-inicializar en resize
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            initializeSidebarState();
        }, 250);
    });
}

// ===== INICIALIZACIÓN FINAL =====
document.addEventListener('DOMContentLoaded', function() {
    updateResponsiveClasses();
    showOfflineNotification();
    setupDropdownMenu(); // Agregar inicialización del dropdown
    setupMobileSidebar(); // Agregar inicialización del sidebar móvil
    
    // Agregar estilos adicionales para touch
    if (isMobile) {
        const style = document.createElement('style');
        style.textContent = `
            .btn-touch { transform: scale(0.95); }
            .card-touch { transform: scale(0.98); }
            .nav-open { overflow: hidden; }
            .hover-effect { 
                background-color: var(--primary-color) !important; 
                color: white !important; 
                transform: translateX(5px); 
            }
            .sidebar-toggle-btn {
                display: none;
            }
            @media (max-width: 767.98px) {
                .sidebar-toggle-btn {
                    display: flex !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
});
