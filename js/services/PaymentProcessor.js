export class PaymentProcessor {
    static async processPayment(paymentData) {
        try {
            // Simulate payment processing
            const response = await fetch('/api/payment/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData)
            });

            if (!response.ok) throw new Error('Payment failed');
            
            const result = await response.json();
            if (result.success) {
                await this.sendOrderConfirmationEmail(paymentData.email, result.orderId);
            }
            return result;
        } catch (error) {
            console.error('Payment processing error:', error);
            throw error;
        }
    }

    static async sendOrderConfirmationEmail(email, orderId) {
        try {
            await fetch('/api/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: email,
                    template: 'order_confirmation',
                    data: { orderId }
                })
            });
        } catch (error) {
            console.error('Email sending error:', error);
        }
    }
} 