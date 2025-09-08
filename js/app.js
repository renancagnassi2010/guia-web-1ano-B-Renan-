// Gerenciamento de tema
const themeManager = {
    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
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
