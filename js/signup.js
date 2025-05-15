document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    let generatedOtp = '';

    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Generate OTP
        generatedOtp = generateOTP();
        await sendOTPEmail(email, generatedOtp);

        // Prompt user to enter OTP
        const userOtp = prompt('Enter the OTP sent to your email:');

        if (verifyOTP(userOtp, generatedOtp)) {
            // Proceed with sign-up
            try {
                // Simulate API call (replace with your actual API endpoint)
                const response = await fetch('/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });

                if (response.ok) {
                    // Redirect to account page after successful sign-up
                    window.location.href = '../pages/account.html';
                } else {
                    // Show error message
                    showError('Sign-up failed. Please try again.');
                }
            } catch (error) {
                console.error('Sign-up error:', error);
                showError('An error occurred. Please try again.');
            }
        } else {
            showError('Invalid OTP. Please try again.');
        }
    });

    function showError(message) {
        // Display error message to the user
        alert(message);
    }
}); 