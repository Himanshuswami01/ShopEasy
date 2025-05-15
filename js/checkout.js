// Checkout functionality
class Checkout {
    constructor() {
        this.cart = new Cart();
        this.initializeForm();
        this.loadShippingInfo();
        this.loadPaymentInfo();
    }

    initializeForm() {
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Add event listeners for form validation
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
        });
    }

    loadShippingInfo() {
        const savedInfo = JSON.parse(localStorage.getItem('shippingInfo')) || {};
        Object.keys(savedInfo).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = savedInfo[key];
            }
        });
    }

    loadPaymentInfo() {
        const savedInfo = JSON.parse(localStorage.getItem('paymentInfo')) || {};
        Object.keys(savedInfo).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = savedInfo[key];
            }
        });
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (input.id) {
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'phone':
                isValid = /^\d{10}$/.test(value);
                errorMessage = 'Please enter a valid 10-digit phone number';
                break;
            case 'zipcode':
                isValid = /^\d{5}(-\d{4})?$/.test(value);
                errorMessage = 'Please enter a valid ZIP code';
                break;
            case 'cardNumber':
                isValid = /^\d{16}$/.test(value);
                errorMessage = 'Please enter a valid 16-digit card number';
                break;
            case 'expiryDate':
                isValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);
                errorMessage = 'Please enter a valid expiry date (MM/YY)';
                break;
            case 'cvv':
                isValid = /^\d{3,4}$/.test(value);
                errorMessage = 'Please enter a valid CVV';
                break;
        }

        this.updateFieldValidation(input, isValid, errorMessage);
        return isValid;
    }

    updateFieldValidation(input, isValid, errorMessage) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            const errorElement = formGroup.querySelector('.error-message') || 
                               document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;

            if (!isValid) {
                input.classList.add('is-invalid');
                if (!formGroup.querySelector('.error-message')) {
                    formGroup.appendChild(errorElement);
                }
            } else {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
                const errorElement = formGroup.querySelector('.error-message');
                if (errorElement) {
                    errorElement.remove();
                }
            }
        }
    }

    validateForm() {
        const inputs = document.querySelectorAll('input, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        // Save shipping and payment info
        const shippingInfo = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipcode: document.getElementById('zipcode').value,
            country: document.getElementById('country').value
        };

        const paymentInfo = {
            cardNumber: document.getElementById('cardNumber').value,
            cardName: document.getElementById('cardName').value,
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value
        };

        localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
        localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));

        try {
            // Simulate payment processing
            await this.processPayment(paymentInfo);
            
            // Create order
            const order = {
                items: this.cart.items,
                shipping: shippingInfo,
                payment: {
                    ...paymentInfo,
                    cardNumber: '****-****-****-' + paymentInfo.cardNumber.slice(-4)
                },
                total: this.cart.calculateTotals(),
                date: new Date().toISOString(),
                status: 'pending'
            };

            // Save order
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Clear cart
            this.cart.clearCart();

            // Redirect to order confirmation
            window.location.href = 'order-confirmation.html';
        } catch (error) {
            alert('Payment processing failed. Please try again.');
            console.error('Payment error:', error);
        }
    }

    async processPayment(paymentInfo) {
        // Simulate API call to payment processor
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Payment failed'));
                }
            }, 1500);
        });
    }
}

// Initialize checkout when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const checkout = new Checkout();
});

class CheckoutHandler {
    constructor() {
        this.form = document.getElementById('checkout-form');
        this.setupFormValidation();
        this.setupEventListeners();
    }

    setupFormValidation() {
        if (!this.form) return;

        // Add validation rules
        this.form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            if (this.validateForm()) {
                try {
                    await this.processCheckout();
                } catch (error) {
                    this.showError(error.message);
                }
            }
        });

        // Real-time validation
        this.form.querySelectorAll('input, select').forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
        });
    }

    setupEventListeners() {
        // Save shipping address checkbox
        const saveAddressCheckbox = document.getElementById('save-address');
        if (saveAddressCheckbox) {
            saveAddressCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.saveShippingAddress();
                }
            });
        }

        // Load saved address if exists
        this.loadSavedAddress();
    }

    validateForm() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error message
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.name === 'phone' && value) {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid 10-digit phone number';
            }
        }

        // PIN code validation
        if (field.name === 'postal_code' && value) {
            const pinRegex = /^[0-9]{6}$/;
            if (!pinRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid 6-digit PIN code';
            }
        }

        // Show error message if invalid
        if (!isValid) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            field.parentElement.appendChild(errorElement);
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }

        return isValid;
    }

    async processCheckout() {
        try {
            const formData = this.getFormData();
            
            // Save shipping address if checkbox is checked
            if (document.getElementById('save-address')?.checked) {
                this.saveShippingAddress(formData);
            }

            // Proceed to payment
            window.location.href = 'payment.html';
        } catch (error) {
            console.error('Checkout processing error:', error);
            throw new Error('Failed to process checkout');
        }
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value.trim();
        }

        return data;
    }

    saveShippingAddress(data = null) {
        try {
            const addressData = data || this.getFormData();
            localStorage.setItem('shippingAddress', JSON.stringify(addressData));
            this.showSuccess('Shipping address saved successfully');
        } catch (error) {
            console.error('Error saving shipping address:', error);
            this.showError('Failed to save shipping address');
        }
    }

    loadSavedAddress() {
        try {
            const savedAddress = JSON.parse(localStorage.getItem('shippingAddress'));
            if (savedAddress) {
                Object.entries(savedAddress).forEach(([key, value]) => {
                    const field = this.form.querySelector(`[name="${key}"]`);
                    if (field) {
                        field.value = value;
                    }
                });
            }
        } catch (error) {
            console.error('Error loading saved address:', error);
        }
    }

    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'checkout-error';
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        `;
        this.form.insertBefore(errorElement, this.form.firstChild);
        setTimeout(() => errorElement.remove(), 5000);
    }

    showSuccess(message) {
        const successElement = document.createElement('div');
        successElement.className = 'checkout-success';
        successElement.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>${message}</p>
        `;
        this.form.insertBefore(successElement, this.form.firstChild);
        setTimeout(() => successElement.remove(), 5000);
    }
}

// Initialize checkout handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.checkoutHandler = new CheckoutHandler();
});

document.addEventListener('DOMContentLoaded', function() {
    // Load cart data from localStorage
    const cartData = JSON.parse(localStorage.getItem('cartData')) || {};
    
    // Update order summary
    updateOrderSummary(cartData);
    
    // Handle shipping form submission
    const shippingForm = document.getElementById('shipping-form');
    if (shippingForm) {
        shippingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                // Get shipping information
                const shippingInfo = {
                    fullName: document.getElementById('fullname').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    zip: document.getElementById('zip').value
                };
                
                // Save shipping info to backend
                const response = await fetch('/api/checkout/shipping', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(shippingInfo)
                });
                
                if (!response.ok) {
                    throw new Error('Failed to save shipping information');
                }
                
                // Save shipping info to localStorage
                localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
                
                // Navigate to payment page
                window.location.href = 'payment.html';
            } catch (error) {
                console.error('Error during shipping form submission:', error);
                showNotification('Error saving shipping information. Please try again.', 'error');
            }
        });
    }
});

function updateOrderSummary(cartData) {
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl && shippingEl && totalEl) {
        // Calculate totals
        const subtotal = calculateSubtotal(cartData);
        const shipping = calculateShipping(subtotal);
        const total = subtotal + shipping;
        
        // Update display
        subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
        shippingEl.textContent = `₹${shipping.toFixed(2)}`;
        totalEl.textContent = `₹${total.toFixed(2)}`;
    }
}

function calculateSubtotal(cartData) {
    let subtotal = 0;
    for (const item in cartData) {
        subtotal += cartData[item].price * cartData[item].quantity;
    }
    return subtotal;
}

function calculateShipping(subtotal) {
    // Free shipping for orders over ₹50
    return subtotal >= 50 ? 0 : 4.99;
} 