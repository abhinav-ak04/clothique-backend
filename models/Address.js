import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    addressLine: {
        type: String,
        required: true,
    },
    locality: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    addressType: {
        type: String,
        enum: ['Home', 'Work'],
        default: 'Home',
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Address = mongoose.model('Address', AddressSchema);
export default Address;
