import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    productId: { type: Number, required: true, unique: true },
    imgs: [{ type: String, required: true }],
    brand: { type: String, required: true },
    desc: { type: String, required: true },
    details: [String],

    mainCategory: { type: String, required: true },
    subCategory: { type: String, required: true },
    individualCategory: { type: String, required: true },
    gender: {
        type: String,
        enum: ['Men', 'Women', 'Boys', 'Girls', 'Unisex'],
        required: true,
    },

    sizeAndFit: [String],
    materialAndCare: [String],
    specs: [
        {
            prop: String,
            value: String,
        },
    ],

    seller: { type: String, required: true },
    deliveryDuration: { type: Number, required: true },

    discountPrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discount: { type: String },

    ratings: [{ type: Number }], // 5-star to 1-star

    sizes: [
        {
            size: String,
            isAvailable: Boolean,
        },
    ],

    color: [String], // even if one color, keep it an array
    createdAt: { type: Date, default: Date.now },
    popularityScore: { type: Number, default: 0 },
});

ProductSchema.index({
    brand: 'text',
    desc: 'text',
    details: 'text',
    mainCategory: 'text',
    subCategory: 'text',
    individualCategory: 'text',
    gender: 'text',
    sizeAndFit: 'text',
    materialAndCare: 'text',
    'specs.prop': 'text',
    'specs.value': 'text',
    seller: 'text',
    color: 'text',
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;
