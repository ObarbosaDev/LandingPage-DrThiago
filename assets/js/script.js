/* ==========================================================================
   THIAGO PINHEIRO BARBOSA - SITE ADVOCACIA
   JavaScript Principal - Interatividade e Funcionalidades
   ========================================================================== */

// Configurações
const CONFIG = {
    whatsapp: {
        number: '5561981503261',
        defaultMessage: 'Olá! Gostaria de agendar uma consulta com o Dr. Thiago Pinheiro Barbosa.'
    },
    animations: {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    }
};

// Importações necessárias
const bootstrap = window.bootstrap;
const gtag = window.gtag;

/* --------------------------------------------------------------------------
   Inicialização
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todos os módulos
    initNavbar();
    initSmoothScroll();
    initContactForm();
    initPhoneMask();
    initBackToTop();
    initWhatsAppButton();
    initFormValidation();
    
    // Remove loader se existir
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
    }
});

/* --------------------------------------------------------------------------
   Navbar - Efeito de Scroll e Toggle
   -------------------------------------------------------------------------- */
function initNavbar() {
    const navbar = document.getElementById('mainNav');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateNavbar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adiciona classe scrolled quando rolar
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
    
    // Atualiza estado inicial
    updateNavbar();
    
    // Fecha menu mobile ao clicar em link
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .nav-cta');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarCollapse) {
        navbarCollapse.addEventListener('show.bs.collapse', () => navbar.classList.add('menu-open'));
        navbarCollapse.addEventListener('hide.bs.collapse', () => navbar.classList.remove('menu-open'));
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse, { toggle: false });
                bsCollapse.hide();
            }
            
            // Atualiza link ativo apenas nos links de navegação.
            document.querySelectorAll('.navbar-nav .nav-link').forEach(l => l.classList.remove('active'));
            if (this.classList.contains('nav-link')) {
                this.classList.add('active');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   Smooth Scroll - Navegação Suave
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignora links vazios ou com apenas #
            if (href === '#' || href === '#!' || href.startsWith('#!')) return;
            
            const targetElement = document.querySelector(href);
            if (!targetElement) return;
            
            e.preventDefault();
            
            const navbar = document.getElementById('mainNav');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Atualiza URL sem recarregar
            if (history.pushState) {
                history.pushState(null, null, href);
            }
        });
    });
    
    // Destaca link ativo baseado na seção visível
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', debounce(highlightNavLink, 100), { passive: true });
}

/* --------------------------------------------------------------------------
   Animações de Revelação (Scroll)
   -------------------------------------------------------------------------- */
function initRevealAnimations() {
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach((element) => {
        element.classList.add('revealed');
    });
}

/* --------------------------------------------------------------------------
   Máscara de Telefone
   -------------------------------------------------------------------------- */
function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Limita a 11 dígitos
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        // Formata como (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
        } else if (value.length > 0) {
            value = value.replace(/^(\d{0,2})$/, '($1');
        }
        
        e.target.value = value;
    });
    
    // Previne caracteres não numéricos
    phoneInput.addEventListener('keypress', function(e) {
        if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
            e.preventDefault();
        }
    });
}

/* --------------------------------------------------------------------------
   Validação de Formulário
   -------------------------------------------------------------------------- */
function initFormValidation() {
    const form = document.getElementById('consultationForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        // Validação em tempo real ao sair do campo
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Remove erro ao digitar
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remove classes anteriores
    field.classList.remove('is-invalid', 'is-valid');
    
    // Validação por tipo de campo
    switch (field.id) {
        case 'name':
            isValid = value.length >= 3;
            break;
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            break;
        case 'phone':
            isValid = value.replace(/\D/g, '').length >= 10;
            break;
        case 'subject':
            isValid = value !== '';
            break;
        case 'message':
            isValid = value.length >= 10;
            break;
    }
    
    // Aplica classe apropriada
    if (value) {
        field.classList.add(isValid ? 'is-valid' : 'is-invalid');
    }
    
    return isValid;
}

/* --------------------------------------------------------------------------
   Formulário de Contato
   -------------------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('consultationForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Valida todos os campos
        const fields = form.querySelectorAll('.form-control');
        let isFormValid = true;
        
        fields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });
        
        // Verifica checkbox de privacidade
        const privacyCheck = document.getElementById('privacy');
        if (!privacyCheck.checked) {
            privacyCheck.classList.add('is-invalid');
            isFormValid = false;
        } else {
            privacyCheck.classList.remove('is-invalid');
        }
        
        if (!isFormValid) {
            showFormMessage('Revise os campos destacados antes de enviar. Precisamos dessas informações para entender sua demanda com segurança.', 'error');
            return;
        }
        
        // Mostra estado de loading
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Coleta dados do formulário
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim(),
            date: new Date().toLocaleString('pt-BR')
        };
        
        try {
            // Prepara mensagem para WhatsApp
            const whatsappMessage = `*NOVA SOLICITAÇÃO DE CONSULTA*\n\n` +
                `*Nome:* ${formData.name}\n` +
                `*Email:* ${formData.email}\n` +
                `*Telefone:* ${formData.phone}\n` +
                `*Assunto:* ${formData.subject}\n` +
                `*Mensagem:* ${formData.message.substring(0, 300)}${formData.message.length > 300 ? '...' : ''}\n\n` +
                `_Enviado em ${formData.date}_`;
            
            const whatsappUrl = `https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Mostra mensagem de sucesso
            showFormMessage(
                `<i class="fas fa-check-circle me-2"></i>
                <strong>Solicitação preparada com sucesso.</strong><br>
                Vamos abrir o WhatsApp com sua mensagem para concluir o envio com segurança.<br>
                <small>Se a janela não abrir, use o botão de WhatsApp no canto da página.</small>`,
                'success'
            );
            
            // Abre WhatsApp em nova aba
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 1000);
            
            // Limpa formulário
            form.reset();
            fields.forEach(field => {
                field.classList.remove('is-valid', 'is-invalid');
            });
            
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            
            // Mostra mensagem de erro com opção de WhatsApp
            showFormMessage(
                `<i class="fas fa-exclamation-circle me-2"></i>
                <strong>Não foi possível preparar o envio.</strong><br>
                Tente novamente ou fale diretamente pelo 
                <a href="https://wa.me/${CONFIG.whatsapp.number}" target="_blank" class="text-decoration-underline">WhatsApp</a>.`,
                'error'
            );
        } finally {
            // Remove estado de loading
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (!formMessage) return;
    
    formMessage.innerHTML = message;
    formMessage.className = `form-message ${type}`;
    
    // Scroll suave até a mensagem
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Remove mensagem após 10 segundos
    setTimeout(() => {
        formMessage.className = 'form-message';
        formMessage.innerHTML = '';
    }, 10000);
}

/* --------------------------------------------------------------------------
   Botão Voltar ao Topo
   -------------------------------------------------------------------------- */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    let ticking = false;
    
    function toggleBackToTop() {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(toggleBackToTop);
            ticking = true;
        }
    }, { passive: true });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* --------------------------------------------------------------------------
   Botão WhatsApp
   -------------------------------------------------------------------------- */
function initWhatsAppButton() {
    const whatsappBtn = document.querySelector('#btn-whatsapp-final, .whatsapp-btn');
    if (!whatsappBtn) return;
    
    // Atualiza o link do WhatsApp
    const whatsappUrl = `https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(CONFIG.whatsapp.defaultMessage)}`;
    whatsappBtn.href = whatsappUrl;
    
    // Adiciona analytics de clique (opcional)
    whatsappBtn.addEventListener('click', function() {
        // Aqui você pode adicionar tracking do Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'WhatsApp',
                'event_label': 'Botão Flutuante'
            });
        }
    });
}

/* --------------------------------------------------------------------------
   Luxury Effects - Microinteracoes Premium
   -------------------------------------------------------------------------- */
function initLuxuryEffects() {
    return;
}

/* --------------------------------------------------------------------------
   Funções Utilitárias
   -------------------------------------------------------------------------- */

// Debounce - Limita a frequência de execução de uma função
function debounce(func, wait = 100) {
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

// Throttle - Garante que função execute no máximo uma vez por intervalo
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Verifica se elemento está visível na viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/* --------------------------------------------------------------------------
   Lazy Loading de Imagens (Fallback para navegadores antigos)
   -------------------------------------------------------------------------- */
(function() {
    if ('loading' in HTMLImageElement.prototype) {
        // O navegador suporta lazy loading nativo
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback com Intersection Observer
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.removeAttribute('loading');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
})();

/* --------------------------------------------------------------------------
   Prevenção de FOUC (Flash of Unstyled Content)
   -------------------------------------------------------------------------- */
document.documentElement.classList.add('js-loaded');



