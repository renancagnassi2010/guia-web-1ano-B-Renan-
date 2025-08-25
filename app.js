// app.js - Módulo principal da aplicação

// Gerenciamento de tema claro/escuro
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Aplicar tema salvo
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Atualizar texto do botão
    updateThemeToggleText(themeToggle, savedTheme);
    
    // Adicionar evento de clique
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Aplicar novo tema
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Salvar preferência
    localStorage.setItem('theme', newTheme);
    
    // Atualizar texto do botão
    updateThemeToggleText(themeToggle, newTheme);
}

function updateThemeToggleText(button, theme) {
    const icon = button.querySelector('svg');
    if (theme === 'dark') {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0)';
    }
}

// Menu responsivo
function initMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        
        // Alternar estado do menu
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('active');
        
        // Prevenir scroll do corpo quando menu está aberto
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMenu();
    
    // Adicionar ano atual no footer
    const yearElement = document.querySelector('footer p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2023', currentYear);
    }
});

// Funções utilitárias para serem usadas em outras páginas
const utils = {
    // Debounce para melhorar performance em eventos como input
    debounce: (func, wait) => {
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
    
    // Formatar dados para CSV
    formatToCSV: (data) => {
        if (!data.length) return '';
        
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(item => 
            Object.values(item).map(value => 
                `"${String(value).replace(/"/g, '""')}"`
            ).join(',')
        );
        
        return [headers, ...rows].join('\n');
    },
    
    // Download de arquivo
    downloadFile: (content, fileName, contentType) => {
        const a = document.createElement('a');
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
    },
    
    // Verificar contraste de cores (para funcionalidade extra)
    checkContrast: (color1, color2) => {
        // Implementação simplificada - em produção usar uma lib ou algoritmo completo
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };
        
        const getLuminance = (r, g, b) => {
            const [rs, gs, bs] = [r, g, b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };
        
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        
        if (!rgb1 || !rgb2) return 0;
        
        const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
        const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
        
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        
        return (brightest + 0.05) / (darkest + 0.05);
    }
};

// Exportar utilitários para uso em outros scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}