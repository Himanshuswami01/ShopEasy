// Initialize Stripe
const stripe = Stripe('your_publishable_key');
const elements = stripe.elements();

class PaymentHandler {
    constructor() {
        this.form = document.getElementById('payment-form');
        this.cardElement = elements.create('card');
        this.setupStripeElements();
        this.setupEventListeners();
        this.loadOrderSummary();
    }

    setupStripeElements() {
        // Mount the card element
        this.cardElement.mount('#card-element');

        // Handle real-time validation errors
        this.cardElement.on('change', (event) => {
            this.handleValidationError(event);
        });
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', async (event) => {
            event.preventDefault();
            await this.handlePaymentSubmission();
        });

        // Payment method selection
        document.querySelectorAll('input[name="payment-method"]').forEach(input => {
            input.addEventListener('change', (event) => {
                this.togglePaymentFields(event.target.value);
            });
        });
    }

    async handlePaymentSubmission() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        
        try {
            const paymentMethod = this.form.querySelector('input[name="payment-method"]:checked').value;
            
            if (paymentMethod === 'card') {
                await this.processCardPayment();
            } else if (paymentMethod === 'upi') {
                await this.processUPIPayment();
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            submitButton.disabled = false;
        }
    }

    async processCardPayment() {
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: this.cardElement,
            billing_details: this.getBillingDetails()
        });

        if (error) {
            throw new Error(error.message);
        }

        const response = await this.processPayment(paymentMethod.id);
        
        if (response.success) {
            this.handlePaymentSuccess(response);
        } else {
            throw new Error(response.error);
        }
    }

    async processUPIPayment() {
        const upiId = document.getElementById('upi-id').value;
        // Implement UPI payment logic
    }

    async processPayment(paymentMethodId) {
        const response = await fetch('/api/process-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentMethodId,
                amount: this.getOrderTotal(),
                currency: 'inr',
                items: this.getCartItems()
            })
        });

        return await response.json();
    }

    getBillingDetails() {
        return {
            name: document.getElementById('card-name').value,
            address: {
                line1: document.getElementById('billing-address').value,
                city: document.getElementById('billing-city').value,
                state: document.getElementById('billing-state').value,
                postal_code: document.getElementById('billing-postal').value,
                country: document.getElementById('billing-country').value
            }
        };
    }

    handlePaymentSuccess(response) {
        // Save order details
        localStorage.setItem('orderId', response.orderId);
        
        // Clear cart
        localStorage.removeItem('cartItems');
        
        // Show success message
        this.showSuccessMessage();
        
        // Redirect to order confirmation
        setTimeout(() => {
            window.location.href = `/order-confirmation.html?id=${response.orderId}`;
        }, 2000);
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>Payment successful! Redirecting to order confirmation...</p>
        `;
        this.form.insertBefore(message, this.form.firstChild);
    }

    showError(message) {
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    handleValidationError(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    }

    togglePaymentFields(method) {
        const cardDetails = document.querySelector('.card-details');
        const upiDetails = document.querySelector('.upi-details');

        if (method === 'card') {
            cardDetails.style.display = 'block';
            upiDetails.style.display = 'none';
        } else if (method === 'upi') {
            cardDetails.style.display = 'none';
            upiDetails.style.display = 'block';
        }
    }

    loadOrderSummary() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const subtotal = this.calculateSubtotal(cartItems);
        const shipping = this.calculateShipping(subtotal);
        const total = subtotal + shipping;

        document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `₹${shipping.toFixed(2)}`;
        document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
    }

    calculateSubtotal(items) {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    calculateShipping(subtotal) {
        return subtotal >= 500 ? 0 : 40;
    }

    getOrderTotal() {
        const totalElement = document.getElementById('total');
        return parseFloat(totalElement.textContent.replace('₹', ''));
    }

    getCartItems() {
        return JSON.parse(localStorage.getItem('cartItems')) || [];
    }
}

// Initialize payment handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.paymentHandler = new PaymentHandler();
});

document.addEventListener('DOMContentLoaded', function() {
    // Load cart data and shipping info from localStorage
    const cartData = JSON.parse(localStorage.getItem('cartData')) || {};
    const shippingInfo = JSON.parse(localStorage.getItem('shippingInfo')) || {};
    
    // Update order summary
    updateOrderSummary(cartData);
    
    // Handle payment form submission
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                // Get payment information
                const paymentInfo = {
                    method: document.querySelector('input[name="payment-method"]:checked').value,
                    cardNumber: document.getElementById('card-number').value,
                    expiry: document.getElementById('expiry').value,
                    cvv: document.getElementById('cvv').value,
                    cardName: document.getElementById('card-name').value
                };
                
                // Save payment info to backend
                const response = await fetch('/api/checkout/payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(paymentInfo)
                });
                
                if (!response.ok) {
                    throw new Error('Failed to save payment information');
                }
                
                // Complete the order
                const orderResponse = await fetch('/api/checkout/complete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cartData,
                        shippingInfo,
                        paymentInfo
                    })
                });
                
                if (!orderResponse.ok) {
                    throw new Error('Failed to place order');
                }
                
                const orderResult = await orderResponse.json();
                
                // Save order ID to localStorage
                localStorage.setItem('orderId', orderResult.orderId);
                
                // Clear cart
                localStorage.removeItem('cartData');
                
                // Navigate to order confirmation page
                window.location.href = 'order-confirmation.html';
            } catch (error) {
                console.error('Error during payment:', error);
                showNotification('Error processing payment. Please try again.', 'error');
            }
        });
    }
    
    // Handle payment method selection
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            const cardDetails = document.querySelector('.card-details');
            if (this.value === 'upi') {
                cardDetails.style.display = 'none';
            } else {
                cardDetails.style.display = 'block';
            }
        });
    });
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