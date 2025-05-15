const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// Store orders in memory (in a real app, you'd use a database)
let orders = [];

// API Routes
app.post('/api/checkout/shipping', (req, res) => {
    try {
        const shippingInfo = req.body;
        // Validate shipping info
        if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.address) {
            return res.status(400).json({ error: 'Missing required shipping information' });
        }
        
        // Store shipping info in session (in a real app, you'd use a proper session store)
        req.session = req.session || {};
        req.session.shippingInfo = shippingInfo;
        
        res.json({ success: true, message: 'Shipping information saved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save shipping information' });
    }
});

app.post('/api/checkout/payment', (req, res) => {
    try {
        const paymentInfo = req.body;
        // Validate payment info
        if (!paymentInfo.method || !paymentInfo.cardNumber || !paymentInfo.cardName) {
            return res.status(400).json({ error: 'Missing required payment information' });
        }
        
        // Store payment info in session
        req.session = req.session || {};
        req.session.paymentInfo = paymentInfo;
        
        res.json({ success: true, message: 'Payment information saved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save payment information' });
    }
});

app.post('/api/checkout/complete', (req, res) => {
    try {
        const { cartData, shippingInfo, paymentInfo } = req.body;
        
        // Create new order
        const order = {
            id: Date.now().toString(),
            items: cartData,
            shipping: shippingInfo,
            payment: {
                method: paymentInfo.method,
                cardNumber: '****-****-****-' + paymentInfo.cardNumber.slice(-4)
            },
            total: calculateTotal(cartData),
            status: 'pending',
            date: new Date().toISOString()
        };
        
        // Store order
        orders.push(order);
        
        res.json({ 
            success: true, 
            message: 'Order placed successfully',
            orderId: order.id
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to place order' });
    }
});

function calculateTotal(cartData) {
    let subtotal = 0;
    for (const item in cartData) {
        subtotal += cartData[item].price * cartData[item].quantity;
    }
    const shipping = subtotal >= 50 ? 0 : 4.99;
    return subtotal + shipping;
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 