document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const toolContainers = document.querySelectorAll('.tool-container');
    const searchInput = document.getElementById('search-tools');
    const themeToggle = document.getElementById('theme-toggle');
    const shareButtons = document.querySelectorAll('.share-btn');
    const modal = document.getElementById('share-modal');
    const closeModal = document.querySelector('.close-modal');
    const shareOptions = document.querySelectorAll('.share-option');

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span');
        
        if (document.body.classList.contains('dark-mode')) {
            icon.className = 'fas fa-sun';
            text.textContent = 'מצב יום';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'מצב לילה';
        }
    });

    // Search Functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        navButtons.forEach(button => {
            const toolName = button.querySelector('span').textContent.toLowerCase();
            if (toolName.includes(searchTerm)) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });
    });

    // Lazy Loading
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const loadIframe = (placeholder) => {
        const iframe = document.createElement('iframe');
        iframe.src = placeholder.dataset.src;
        iframe.frameBorder = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        placeholder.parentNode.replaceChild(iframe, placeholder);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadIframe(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.iframe-placeholder').forEach(placeholder => {
        observer.observe(placeholder);
    });

    // Tool Switching
    function switchTool(button) {
        navButtons.forEach(btn => btn.classList.remove('active'));
        toolContainers.forEach(container => {
            container.classList.remove('active');
            container.style.opacity = '0';
            container.style.transform = 'translateX(20px)';
        });

        button.classList.add('active');

        const toolId = button.dataset.tool === 'chatbot' 
            ? 'ai-chatbot'
            : button.dataset.tool === 'refund'
                ? 'tax-refund'
                : `${button.dataset.tool}-calculator`;
        const targetContainer = document.getElementById(toolId);

        void targetContainer.offsetWidth;
        targetContainer.classList.add('active');
        
        setTimeout(() => {
            targetContainer.style.opacity = '1';
            targetContainer.style.transform = 'translateX(0)';
        }, 50);

        // Update view count
        const viewsCount = button.querySelector('.views-count');
        const currentViews = parseInt(viewsCount.textContent.replace(',', ''));
        viewsCount.textContent = (currentViews + 1).toLocaleString();
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => switchTool(button));
    });

    // Share Functionality
    function openShareModal(toolName) {
        modal.style.display = 'block';
        modal.dataset.tool = toolName;
    }

    function closeShareModal() {
        modal.style.display = 'none';
    }

    function shareTool(platform) {
        const toolName = modal.dataset.tool;
        const toolUrl = window.location.href + '#' + toolName;
        
        switch(platform) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(toolUrl)}`);
                break;
            case 'telegram':
                window.open(`https://t.me/share/url?url=${encodeURIComponent(toolUrl)}`);
                break;
            case 'email':
                window.open(`mailto:?subject=Check out this tool&body=${encodeURIComponent(toolUrl)}`);
                break;
            case 'copy':
                navigator.clipboard.writeText(toolUrl).then(() => {
                    alert('הקישור הועתק ללוח!');
                });
                break;
        }
        
        closeShareModal();
    }

    shareButtons.forEach(button => {
        button.addEventListener('click', () => openShareModal(button.dataset.tool));
    });

    closeModal.addEventListener('click', closeShareModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeShareModal();
    });

    shareOptions.forEach(option => {
        option.addEventListener('click', () => shareTool(option.dataset.platform));
    });

    // Handle deep linking
    const hash = window.location.hash.slice(1);
    if (hash) {
        const targetButton = document.querySelector(`[data-tool="${hash}"]`);
        if (targetButton) switchTool(targetButton);
    }
});
