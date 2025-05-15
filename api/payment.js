const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Payment Processing Routes
router.post('/process-payment', async (req, res) => {
    try {
        const { paymentMethodId, amount, currency = 'inr', items } = req.body;

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            payment_method: paymentMethodId,
            confirm: true,
            return_url: `${process.env.FRONTEND_URL}/order-confirmation`
        });

        // Create order in database
        const order = await createOrder({
            userId: req.user.id,
            items,
            amount,
            paymentIntentId: paymentIntent.id,
            status: 'processing'
        });

        res.json({
            success: true,
            orderId: order.id,
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({
            success: false,
            error: 'Payment processing failed'
        });
    }
});

// Save Payment Method
router.post('/save-payment-method', async (req, res) => {
    try {
        const { paymentMethod } = req.body;

        // Save payment method to user profile
        const customer = await stripe.customers.create({
            payment_method: paymentMethod,
            email: req.user.email
        });

        // Update user profile with customer ID
        await updateUserProfile(req.user.id, {
            stripeCustomerId: customer.id
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error saving payment method:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save payment method'
        });
    }
});

// Verify Payment Status
router.get('/verify-payment/:paymentIntentId', async (req, res) => {
    try {
        const { paymentIntentId } = req.params;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        const order = await getOrderByPaymentIntent(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            await updateOrderStatus(order.id, 'completed');
        }

        res.json({
            success: true,
            status: paymentIntent.status,
            orderId: order.id
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify payment'
        });
    }
});

// Database Helper Functions
async function createOrder(orderData) {
    // Implementation for creating order in database
    return {
        id: 'order_id',
        ...orderData
    };
}

async function updateOrderStatus(orderId, status) {
    // Implementation for updating order status
}

async function getOrderByPaymentIntent(paymentIntentId) {
    // Implementation for retrieving order by payment intent ID
    return {
        id: 'order_id',
        status: 'processing'
    };
}

async function updateUserProfile(userId, data) {
    // Implementation for updating user profile
}

module.exports = router; 