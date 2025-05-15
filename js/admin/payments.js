class PaymentManager {
    constructor() {
        this.payments = [];
        this.initialize();
    }

    async initialize() {
        await this.loadPayments();
        this.setupEventListeners();
    }

    async loadPayments() {
        // In a real app, this would be an API call
        this.payments = JSON.parse(localStorage.getItem('payments')) || [];
        this.renderPayments();
    }

    generateTransactionId() {
        return 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    generateOrderId() {
        return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    }

    async processPayment(orderData) {
        const payment = {
            id: this.generateTransactionId(),
            orderId: this.generateOrderId(),
            amount: orderData.total,
            currency: 'USD',
            method: orderData.paymentMethod,
            status: 'pending',
            timestamp: new Date().toISOString(),
            customerInfo: {
                id: orderData.customerId,
                name: orderData.customerName,
                email: orderData.customerEmail
            },
            billingAddress: orderData.billingAddress,
            items: orderData.items
        };

        try {
            // Simulate payment processing
            const result = await this.processPaymentGateway(payment);
            payment.status = result.success ? 'completed' : 'failed';
            payment.gatewayResponse = result.response;

            this.payments.push(payment);
            localStorage.setItem('payments', JSON.stringify(this.payments));
            
            this.renderPayments();
            return payment;
        } catch (error) {
            payment.status = 'failed';
            payment.error = error.message;
            return payment;
        }
    }

    async processPaymentGateway(payment) {
        // Simulate payment gateway processing
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    response: {
                        transactionId: payment.id,
                        authorizationCode: 'AUTH' + Math.random().toString(36).substr(2, 8),
                        timestamp: new Date().toISOString()
                    }
                });
            }, 1000);
        });
    }

    renderPayments() {
        const paymentTable = document.querySelector('.payment-table tbody');
        if (!paymentTable) return;

        paymentTable.innerHTML = this.payments.map(payment => `
            <tr>
                <td>${payment.id}</td>
                <td>${payment.orderId}</td>
                <td>${payment.customerInfo.name}</td>
                <td>$${payment.amount}</td>
                <td>${payment.method}</td>
                <td>
                    <span class="status-badge ${payment.status}">
                        ${payment.status}
                    </span>
                </td>
                <td>${new Date(payment.timestamp).toLocaleString()}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${payment.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    showPaymentDetails(paymentId) {
        const payment = this.payments.find(p => p.id === paymentId);
        if (!payment) return;

        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Payment Details</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="payment-details">
                    <div class="detail-section">
                        <h3>Transaction Information</h3>
                        <p><strong>Transaction ID:</strong> ${payment.id}</p>
                        <p><strong>Order ID:</strong> ${payment.orderId}</p>
                        <p><strong>Amount:</strong> $${payment.amount}</p>
                        <p><strong>Method:</strong> ${payment.method}</p>
                        <p><strong>Status:</strong> ${payment.status}</p>
                        <p><strong>Date:</strong> ${new Date(payment.timestamp).toLocaleString()}</p>
                    </div>

                    <div class="detail-section">
                        <h3>Customer Information</h3>
                        <p><strong>Name:</strong> ${payment.customerInfo.name}</p>
                        <p><strong>Email:</strong> ${payment.customerInfo.email}</p>
                    </div>

                    <div class="detail-section">
                        <h3>Billing Address</h3>
                        <p>${payment.billingAddress.street}</p>
                        <p>${payment.billingAddress.city}, ${payment.billingAddress.state} ${payment.billingAddress.zipCode}</p>
                        <p>${payment.billingAddress.country}</p>
                    </div>

                    <div class="detail-section">
                        <h3>Items</h3>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${payment.items.map(item => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.quantity}</td>
                                        <td>$${item.price}</td>
                                        <td>$${item.quantity * item.price}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    ${payment.gatewayResponse ? `
                        <div class="detail-section">
                            <h3>Gateway Response</h3>
                            <p><strong>Authorization Code:</strong> ${payment.gatewayResponse.authorizationCode}</p>
                            <p><strong>Timestamp:</strong> ${new Date(payment.gatewayResponse.timestamp).toLocaleString()}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupModalListeners(modal);
    }

    setupModalListeners(modal) {
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('.view-btn');
            if (viewBtn) {
                const paymentId = viewBtn.dataset.id;
                this.showPaymentDetails(paymentId);
            }
        });
    }
}

export const paymentManager = new PaymentManager(); 