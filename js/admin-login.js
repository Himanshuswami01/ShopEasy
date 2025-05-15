document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');

    adminLoginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        // ... (existing code for admin login)

        if (adminLoginSuccess) {
            // Redirect to admin dashboard after successful login
            window.location.href = '../../pages/admin/dashboard.html';
        } else {
            // Show error message
            showError('Invalid admin credentials');
        }
    });
}); 