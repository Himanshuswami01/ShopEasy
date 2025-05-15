class RefundManager {
    constructor() {
        this.refunds = [];
        this.initialize();
    }

    async initialize() {
        await this.loadRefunds();
        this.setupEventListeners();
    }

    generateRefundId() {
        return 'REF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    }

    async processRefund(payment, refundData) {
        const refund = {
            id: this.generateRefundId(),
            paymentId: payment.id,
            orderId: payment.orderId,
            amount: refundData.amount,
            reason: refundData.reason,
            status: 'processing',
            timestamp: new Date().toISOString(),
            customerInfo: payment.customerInfo,
            notes: refundData.notes
        };

        try {
            // Simulate refund processing
            const result = await this.processRefundGateway(refund);
            refund.status = result.success ? 'completed' : 'failed';
            refund.gatewayResponse = result.response;

            this.refunds.push(refund);
            localStorage.setItem('refunds', JSON.stringify(this.refunds));
            
            // Update payment status
            payment.refundStatus = 'refunded';
            payment.refundId = refund.id;
            
            this.renderRefunds();
            return refund;
        } catch (error) {
            refund.status = 'failed';
            refund.error = error.message;
            return refund;
        }
    }

    showRefundModal(paymentId) {
        const payment = paymentManager.payments.find(p => p.id === paymentId);
        if (!payment) return;

        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Process Refund</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <form class="refund-form">
                    <div class="form-group">
                        <label>Original Amount: $${payment.amount}</label>
                    </div>
                    <div class="form-group">
                        <label for="refundAmount">Refund Amount</label>
                        <input type="number" id="refundAmount" max="${payment.amount}" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="refundReason">Reason</label>
                        <select id="refundReason" required>
                            <option value="">Select Reason</option>
                            <option value="customer_request">Customer Request</option>
                            <option value="damaged">Item Damaged</option>
                            <option value="wrong_item">Wrong Item</option>
                            <option value="not_received">Item Not Received</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="refundNotes">Notes</label>
                        <textarea id="refundNotes" rows="3"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="cancel-btn">Cancel</button>
                        <button type="submit" class="process-btn">Process Refund</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupRefundModalListeners(modal, payment);
    }
}

export const refundManager = new RefundManager(); 