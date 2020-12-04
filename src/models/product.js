const mongoose = require('mongoose');
const validator = require('validator')

const productSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0)
                throw new Error('Only positive values are allowed');
        }
    },
    image: {
        type: Buffer
    },
    ratings: [{
        comment: {
            type: String
        },
        star: {
            type: Number,
            min: 0,
            max: 5
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
});

productSchema.virtual('cart', {
    ref: 'Cart',
    localField: '_id',
    foreignField: 'products.product'
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;