// Order confirmation functionality
class OrderConfirmation {
    constructor() {
        this.initializeConfirmation();
        this.setupEventListeners();
    }

    initializeConfirmation() {
        // Get the most recent order
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const latestOrder = orders[orders.length - 1];

        if (!latestOrder) {
            window.location.href = 'index.html';
            return;
        }

        this.displayOrderDetails(latestOrder);
        this.sendConfirmationEmail(latestOrder);
    }

    setupEventListeners() {
        // Add event listener for the continue shopping button
        const continueButton = document.getElementById('continue-shopping');
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        // Add event listener for window resize to adjust layout
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize(); // Initial call
    }

    handleResize() {
        const orderItems = document.querySelectorAll('.order-item');
        const isMobile = window.innerWidth <= 576;
        
        orderItems.forEach(item => {
            if (isMobile) {
                item.classList.add('mobile-view');
            } else {
                item.classList.remove('mobile-view');
            }
        });
    }

    displayOrderDetails(order) {
        // Display order summary
        const orderNumber = document.getElementById('order-number');
        const orderDate = document.getElementById('order-date');
        const shippingDetails = document.getElementById('shipping-details');
        const paymentDetails = document.getElementById('payment-details');
        const orderItemsList = document.getElementById('order-items-list');
        const subtotal = document.getElementById('subtotal');
        const shippingCost = document.getElementById('shipping-cost');
        const total = document.getElementById('total');

        if (orderNumber) {
            orderNumber.textContent = `Order #${this.generateOrderNumber()}`;
        }

        if (orderDate) {
            const date = new Date(order.date);
            orderDate.textContent = `Placed on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
        }

        if (shippingDetails && order.shipping) {
            shippingDetails.innerHTML = `
                <div class="info-details">${order.shipping.firstName} ${order.shipping.lastName}</div>
                <div class="info-details">${order.shipping.address}</div>
                <div class="info-details">${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipcode}</div>
                <div class="info-details">${order.shipping.country}</div>
                <div class="info-details">Email: ${order.shipping.email}</div>
                <div class="info-details">Phone: ${order.shipping.phone}</div>
            `;
        }

        if (paymentDetails && order.payment) {
            paymentDetails.innerHTML = `
                <div class="info-details">Card ending in: <span class="card-number">${order.payment.cardNumber.slice(-4)}</span></div>
                <div class="info-details">Cardholder: ${order.payment.cardName}</div>
                <div class="info-details">Expiry: ${order.payment.expiryDate}</div>
            `;
        }

        if (orderItemsList && order.items) {
            orderItemsList.innerHTML = order.items.map(item => `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}" class="item-image">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>Quantity: ${item.quantity}</p>
                        <p>Price: $${item.price.toFixed(2)}</p>
                        <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                </div>
            `).join('');
        }

        // Calculate and display totals
        const itemsTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = order.shipping && order.shipping.country === 'USA' ? 0 : 10;
        const orderTotal = itemsTotal + shipping;

        if (subtotal) subtotal.textContent = `$${itemsTotal.toFixed(2)}`;
        if (shippingCost) shippingCost.textContent = `$${shipping.toFixed(2)}`;
        if (total) total.textContent = `$${orderTotal.toFixed(2)}`;
    }

    generateOrderNumber() {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        return `ORD-${timestamp}-${random}`;
    }

    async sendConfirmationEmail(order) {
        try {
            // Simulate sending confirmation email
            await this.simulateEmailSending(order);
            console.log('Confirmation email sent successfully');
        } catch (error) {
            console.error('Failed to send confirmation email:', error);
        }
    }

    simulateEmailSending(order) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Email sent to:', order.shipping.email);
                console.log('Email content:', {
                    subject: 'Order Confirmation',
                    orderNumber: this.generateOrderNumber(),
                    items: order.items,
                    total: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    shippingAddress: order.shipping
                });
                resolve();
            }, 1000);
        });
    }
}

// Initialize order confirmation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const orderConfirmation = new OrderConfirmation();
}); 