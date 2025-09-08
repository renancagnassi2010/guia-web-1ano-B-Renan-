// Gerenciamento de preferências do usuário
const userPreferences = {
    init() {
        // Carregar preferências salvas
        const preferences = this.loadPreferences();
        this.applyPreferences(preferences);
        
        // Inicializar controles
        this.initThemeToggle();
        this.initContrastToggle();
        this.initFontSize();
        this.initAnimationToggle();
    },

    loadPreferences() {
        return JSON.parse(localStorage.getItem('userPreferences')) || {
            theme: 'light',
            contrast: 'normal',
            fontSize: 'normal',
            reducedMotion: false
        };
    },

    savePreferences(preferences) {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
    },

    applyPreferences(preferences) {
        // Aplicar tema
        document.documentElement.setAttribute('data-theme', preferences.theme);
        
        // Aplicar contraste
        document.documentElement.setAttribute('data-contrast', preferences.contrast);
        
        // Aplicar tamanho da fonte
        document.documentElement.setAttribute('data-font-size', preferences.fontSize);
        
        // Aplicar preferência de animação
        document.documentElement.setAttribute('data-reduced-motion', preferences.reducedMotion);
    },

    initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const preferences = this.loadPreferences();
                preferences.theme = preferences.theme === 'light' ? 'dark' : 'light';
                this.applyPreferences(preferences);
                this.savePreferences(preferences);
                this.updateThemeIcon(preferences.theme);
            });
        }
    },

    initContrastToggle() {
        const contrastToggle = document.createElement('button');
        contrastToggle.className = 'contrast-toggle';
        contrastToggle.setAttribute('aria-label', 'Alternar alto contraste');
        contrastToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>';
        
        document.querySelector('.theme-toggle').parentNode.insertBefore(contrastToggle, document.querySelector('.theme-toggle'));
        
        contrastToggle.addEventListener('click', () => {
            const preferences = this.loadPreferences();
            preferences.contrast = preferences.contrast === 'normal' ? 'high' : 'normal';
            this.applyPreferences(preferences);
            this.savePreferences(preferences);
        });
    },

    initFontSize() {
        const fontSizeControl = document.createElement('div');
        fontSizeControl.className = 'font-size-control';
        fontSizeControl.innerHTML = `
            <button class="decrease-font" aria-label="Diminuir fonte">A-</button>
            <button class="increase-font" aria-label="Aumentar fonte">A+</button>
        `;
        
        document.querySelector('.theme-toggle').parentNode.insertBefore(fontSizeControl, document.querySelector('.theme-toggle'));
        
        const sizes = ['small', 'normal', 'large'];
        
        fontSizeControl.querySelector('.decrease-font').addEventListener('click', () => {
            const preferences = this.loadPreferences();
            const currentIndex = sizes.indexOf(preferences.fontSize);
            if (currentIndex > 0) {
                preferences.fontSize = sizes[currentIndex - 1];
                this.applyPreferences(preferences);
                this.savePreferences(preferences);
            }
        });
        
        fontSizeControl.querySelector('.increase-font').addEventListener('click', () => {
            const preferences = this.loadPreferences();
            const currentIndex = sizes.indexOf(preferences.fontSize);
            if (currentIndex < sizes.length - 1) {
                preferences.fontSize = sizes[currentIndex + 1];
                this.applyPreferences(preferences);
                this.savePreferences(preferences);
            }
        });
    },

    initAnimationToggle() {
        const animationToggle = document.createElement('button');
        animationToggle.className = 'animation-toggle';
        animationToggle.setAttribute('aria-label', 'Alternar animações');
        animationToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v16h16"/><path d="m5 19 6-6 4 4 6-6"/></svg>';
        
        document.querySelector('.theme-toggle').parentNode.insertBefore(animationToggle, document.querySelector('.theme-toggle'));
        
        animationToggle.addEventListener('click', () => {
            const preferences = this.loadPreferences();
            preferences.reducedMotion = !preferences.reducedMotion;
            this.applyPreferences(preferences);
            this.savePreferences(preferences);
        });
    },

    updateThemeIcon(theme) {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark' ? 
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' :
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        }
    }
};

// Menu responsivo
const menuManager = {
    init() {
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav');
        
        if (menuToggle && nav) {
            menuToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
                menuToggle.classList.toggle('active');
                const isExpanded = nav.classList.contains('active');
                menuToggle.setAttribute('aria-expanded', isExpanded);
                
                // Prevenir scroll quando menu está aberto
                document.body.style.overflow = isExpanded ? 'hidden' : '';
            });

            // Fechar menu ao clicar em links
            const navLinks = nav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });

            // Fechar menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (nav.classList.contains('active') && 
                    !nav.contains(e.target) && 
                    !menuToggle.contains(e.target)) {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        }
    }
};

// Atalhos de teclado
const keyboardManager = {
    init() {
        document.addEventListener('keydown', (e) => {
            // Atalho para busca: "/"
            if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            // Atalho para menu: "Alt+M"
            if (e.key === 'm' && e.altKey) {
                e.preventDefault();
                const nav = document.querySelector('nav');
                if (nav) {
                    const firstLink = nav.querySelector('a');
                    firstLink?.focus();
                }
            }

            // Atalho para topo: "Home"
            if (e.key === 'Home' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
};

// Utilitários
const utils = {
    // Debounce para otimização de performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Exportar para CSV
    exportToCSV(data, filename) {
        const csvContent = this.convertToCSV(data);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    },

    convertToCSV(data) {
        const headers = Object.keys(data[0]);
        const rows = data.map(item => 
            headers.map(header => 
                JSON.stringify(item[header] || '')
            ).join(',')
        );
        return [headers.join(','), ...rows].join('\n');
    },

    // Calcular contraste entre cores
    calculateContrast(color1, color2) {
        const getLuminance = (r, g, b) => {
            const [rs, gs, bs] = [r, g, b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };

        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };

        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);

        if (!rgb1 || !rgb2) return null;

        const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
        const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);

        return (lighter + 0.05) / (darker + 0.05);
    }
};

// Controle do header no scroll
const headerManager = {
    init() {
        const header = document.querySelector('header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    themeManager.init();
    menuManager.init();
    keyboardManager.init();
    headerManager.init();
});
