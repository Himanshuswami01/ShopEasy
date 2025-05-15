class UserManager {
    constructor() {
        this.users = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.initialize();
    }

    async initialize() {
        await this.loadUsers();
        this.setupEventListeners();
    }

    async loadUsers() {
        try {
            const response = await fetch('/api/users');
            this.users = await response.json();
            this.renderUsers();
            this.renderPagination();
        } catch (error) {
            console.error('Error loading users:', error);
            this.showNotification('Failed to load users', 'error');
        }
    }

    renderUsers(filteredUsers = null) {
        const users = filteredUsers || this.users;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageUsers = users.slice(startIndex, endIndex);

        const tbody = document.querySelector('.users-table tbody');
        tbody.innerHTML = pageUsers.map(user => `
            <tr>
                <td>#${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <span class="role-badge ${user.role.toLowerCase()}">
                        ${user.role}
                    </span>
                </td>
                <td>
                    <span class="status-badge ${user.status.toLowerCase()}">
                        ${user.status}
                    </span>
                </td>
                <td>${new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                    <div class="user-actions">
                        <button class="action-btn view-btn" onclick="userManager.viewUser(${user.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" onclick="userManager.editUser(${user.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="userManager.deleteUser(${user.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async saveUser(event) {
        event.preventDefault();
        const form = event.target;
        const userId = form.querySelector('input[name="userId"]')?.value;

        const userData = {
            name: form.userName.value,
            email: form.userEmail.value,
            role: form.userRole.value,
            status: form.userStatus.value
        };

        try {
            const url = userId ? `/api/users/${userId}` : '/api/users';
            const method = userId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                await this.loadUsers();
                this.closeUserModal();
                this.showNotification(`User ${userId ? 'updated' : 'created'} successfully!`, 'success');
            } else {
                throw new Error('Failed to save user');
            }
        } catch (error) {
            console.error('Error saving user:', error);
            this.showNotification('Failed to save user', 'error');
        }
    }

    async deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await this.loadUsers();
                this.showNotification('User deleted successfully!', 'success');
            } else {
                throw new Error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            this.showNotification('Failed to delete user', 'error');
        }
    }

    filterUsers() {
        const searchTerm = document.getElementById('userSearch').value.toLowerCase();
        const roleFilter = document.getElementById('roleFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        const filteredUsers = this.users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
                                user.email.toLowerCase().includes(searchTerm);
            const matchesRole = !roleFilter || user.role.toLowerCase() === roleFilter.toLowerCase();
            const matchesStatus = !statusFilter || user.status.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesRole && matchesStatus;
        });

        this.renderUsers(filteredUsers);
        this.renderPagination(filteredUsers.length);
    }

    setupEventListeners() {
        document.getElementById('userSearch').addEventListener('input', () => this.filterUsers());
        document.getElementById('roleFilter').addEventListener('change', () => this.filterUsers());
        document.getElementById('statusFilter').addEventListener('change', () => this.filterUsers());
        document.getElementById('userForm').addEventListener('submit', (e) => this.saveUser(e));
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Initialize the user manager
const userManager = new UserManager(); 