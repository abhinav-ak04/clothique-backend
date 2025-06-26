import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // ensures one cart per user
    },
    items: [
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
                required: true, // assuming size must be selected
            },
        },
    ],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;
