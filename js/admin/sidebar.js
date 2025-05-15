class AdminSidebar {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.markActivePage();
        this.setupEventListeners();
        this.loadAdminInfo();
    }

    markActivePage() {
        const currentPage = window.location.pathname.split('/').pop();
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === currentPage);
        });
    }

    setupEventListeners() {
        // Mobile menu toggle
        const toggleBtn = document.querySelector('.sidebar-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                document.querySelector('.sidebar-nav').classList.toggle('active');
            });
        }

        // Logout button
        document.querySelector('.logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });
    }

    async loadAdminInfo() {
        try {
            const response = await fetch('/api/admin/profile');
            const adminData = await response.json();
            
            document.querySelector('.admin-name').textContent = adminData.name;
            document.querySelector('.admin-role').textContent = adminData.role;
            if (adminData.avatar) {
                document.querySelector('.admin-avatar').src = adminData.avatar;
            }
        } catch (error) {
            console.error('Error loading admin info:', error);
        }
    }

    async handleLogout() {
        try {
            const response = await fetch('/api/admin/logout', {
                method: 'POST'
            });

            if (response.ok) {
                window.location.href = '/admin/login';
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }
}

// Initialize the admin sidebar
const adminSidebar = new AdminSidebar(); 