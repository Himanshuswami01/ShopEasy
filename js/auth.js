// Authentication utility functions
const auth = {
    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    },

    checkAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '/pages/login.html';
            return false;
        }
        return true;
    },

    login(userData) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(userData));
    },

    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        window.location.href = '/pages/login.html';
    },

    getUserData() {
        return JSON.parse(localStorage.getItem('userData'));
    }
};

// Protect pages that require authentication
document.addEventListener('DOMContentLoaded', function() {
    const protectedPages = [
        'account.html',
        'orders.html',
        'wishlist.html',
        'measurements.html',
        'addresses.html',
        'settings.html'
    ];

    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage)) {
        auth.checkAuth();
    }
});

export default auth; 