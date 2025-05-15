import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        color: String,
        size: String,
        price: {
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    couponApplied: {
        code: String,
        discount: Number
    }
}, {
    timestamps: true
});

// Calculate total price before saving
cartSchema.pre('save', function(next) {
    this.totalPrice = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    if (this.couponApplied && this.couponApplied.discount) {
        this.totalPrice = this.totalPrice * (1 - this.couponApplied.discount / 100);
    }

    next();
});

export default mongoose.model('Cart', cartSchema); 