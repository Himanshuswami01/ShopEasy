import auth from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.querySelector('.login-button');
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const email = document.getElementById('email').value;
        const password = passwordInput.value;
        const remember = document.getElementById('remember').checked;

        // Show loading state
        loginButton.classList.add('loading');
        loginButton.disabled = true;

        try {
            // Simulate API call (replace with your actual API endpoint)
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, remember })
            });

            if (response.ok) {
                // Redirect to account page after successful login
                window.location.href = '../pages/account.html';
            } else {
                // Show error message
                showError('Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('An error occurred. Please try again.');
        } finally {
            // Show error state
            loginButton.classList.remove('loading');
            loginButton.classList.add('error');
            loginButton.disabled = false;

            // Remove error state after animation
            setTimeout(() => {
                loginButton.classList.remove('error');
            }, 500);
        }
    });

    function showError(message) {
        // Display error message to the user
        alert(message);
    }
}); 