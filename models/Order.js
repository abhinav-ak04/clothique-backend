import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1,
            },
            size: {
                type: String,
                required: true,
            },
            priceAtPurchase: {
                type: Number,
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: [
            'pending',
            'processing',
            'shipped',
            'out for delivery',
            'delivered',
            'cancelled',
            'refund credited',
        ],
        default: 'pending',
    },
    placedAt: {
        type: Date,
        default: Date.now,
    },
    expectedDeliveryDate: {
        type: Date,
    },
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;
