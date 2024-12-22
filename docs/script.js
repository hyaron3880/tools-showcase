import { showAuthModal, hideAuthModal, signOutUser } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    const themeToggle = document.getElementById('theme-toggle');
    const layoutToggle = document.getElementById('layout-toggle');
    const container = document.querySelector('.container');
    const navButtons = document.querySelectorAll('.nav-btn');
    const toolContainers = document.querySelectorAll('.tool-container');
    const shareButtons = document.querySelectorAll('.share-btn');
    const modal = document.getElementById('share-modal');
    const closeModal = document.querySelector('.close-modal');
    const shareOptions = document.querySelectorAll('.share-option');
    
    // Check if device is mobile
    const isMobile = () => window.innerWidth <= 768;

    // Force list view on mobile
    const checkMobileView = () => {
        if (isMobile()) {
            container.classList.add('sidebar-layout');
            localStorage.setItem('layout', 'sidebar');
        } else {
            // Restore saved layout on desktop
            const savedLayout = localStorage.getItem('layout');
            container.classList.toggle('sidebar-layout', savedLayout === 'sidebar');
            if (savedLayout === 'sidebar') {
                layoutToggle.querySelector('i').className = 'fas fa-table';
                layoutToggle.querySelector('span').textContent = 'תצוגת רשת';
            }
        }
    };

    // Layout toggle functionality (only works on desktop)
    layoutToggle.addEventListener('click', () => {
        if (!isMobile()) {
            container.classList.toggle('sidebar-layout');
            const isSidebar = container.classList.contains('sidebar-layout');
            const icon = layoutToggle.querySelector('i');
            const text = layoutToggle.querySelector('span');
            
            if (isSidebar) {
                icon.className = 'fas fa-table';
                text.textContent = 'תצוגת רשת';
                localStorage.setItem('layout', 'sidebar');
            } else {
                icon.className = 'fas fa-columns';
                text.textContent = 'תצוגת צד';
                localStorage.setItem('layout', 'grid');
            }
        }
    });

    // Check mobile view on load and resize
    checkMobileView();
    window.addEventListener('resize', checkMobileView);

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span');
        
        if (isDarkMode) {
            icon.className = 'fas fa-sun';
            text.textContent = 'מצב יום';
            localStorage.setItem('theme', 'dark');
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'מצב לילה';
            localStorage.setItem('theme', 'light');
        }
    });

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.querySelector('i').className = 'fas fa-sun';
        themeToggle.querySelector('span').textContent = 'מצב יום';
    }

    // Navigation functionality with auth check
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('locked')) {
                showAuthModal();
                return;
            }

            const toolId = button.dataset.tool;
            
            // Update active states
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Hide all tools first
            toolContainers.forEach(container => {
                container.classList.remove('active');
                container.style.display = 'none';
            });
            
            // Show selected tool
            const selectedContainer = document.querySelector(`[id*="${toolId}"]`);
            if (selectedContainer) {
                selectedContainer.style.display = 'block';
                setTimeout(() => {
                    selectedContainer.classList.add('active');
                    loadIframe(selectedContainer);
                }, 0);
            }

            // Update view count
            updateViewCount(button);
        });
    });

    // Iframe loading function
    function loadIframe(container) {
        const placeholder = container.querySelector('.iframe-placeholder');
        if (!placeholder) return;
        
        if (!placeholder.querySelector('iframe')) {
            const iframe = document.createElement('iframe');
            iframe.src = placeholder.dataset.src;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            placeholder.appendChild(iframe);
        }
    }

    // View count functionality
    function updateViewCount(button) {
        const viewsElement = button.querySelector('.views-count');
        let views = parseInt(viewsElement.textContent.replace(',', ''));
        views++;
        viewsElement.textContent = views.toLocaleString();
        
        // Store updated view count
        const toolId = button.dataset.tool;
        localStorage.setItem(`${toolId}_views`, views);
    }

    // Load saved view counts
    navButtons.forEach(button => {
        const toolId = button.dataset.tool;
        const savedViews = localStorage.getItem(`${toolId}_views`);
        if (savedViews) {
            button.querySelector('.views-count').textContent = parseInt(savedViews).toLocaleString();
        }
    });

    // Share functionality
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const toolId = button.dataset.tool;
            const toolContainer = document.querySelector(`[id*="${toolId}"]`);
            if (toolContainer) {
                const iframe = toolContainer.querySelector('.iframe-placeholder');
                if (iframe) {
                    openShareModal(iframe.dataset.src);
                }
            }
        });
    });

    function openShareModal(url) {
        modal.style.display = 'block';
        
        shareOptions.forEach(option => {
            option.onclick = () => {
                const platform = option.dataset.platform;
                shareContent(platform, url);
            };
        });
    }

    function shareContent(platform, url) {
        const text = 'בדוק את הכלי הפיננסי הזה:';
        const encodedText = encodeURIComponent(text);
        const encodedUrl = encodeURIComponent(url);
        
        switch (platform) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodedText} ${encodedUrl}`);
                break;
            case 'telegram':
                window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`);
                break;
            case 'email':
                window.location.href = `mailto:?subject=כלי פיננסי מעניין&body=${encodedText} ${encodedUrl}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(url).then(() => {
                    const option = document.querySelector('[data-platform="copy"]');
                    const originalText = option.querySelector('span').textContent;
                    option.querySelector('span').textContent = 'הועתק!';
                    setTimeout(() => {
                        option.querySelector('span').textContent = originalText;
                    }, 2000);
                });
                break;
        }
        
        modal.style.display = 'none';
    }

    // Close modal functionality
    closeModal.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Load initial tool
    const activeContainer = document.querySelector('.tool-container.active');
    if (activeContainer) {
        loadIframe(activeContainer);
    }
});
