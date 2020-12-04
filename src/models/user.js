const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error('You must provide a valid email address');
            }
        }
    },
    dateOfBirth: {
        type: Date,
        default: Date.now()
    },
    tokens: [{
        token: {
            type: String,
            unique: true
        }
    }]
}, {
    timestamps: true
}); 

// Connect user with user comments foreign field
userSchema.virtual('user_comments', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'ratings.user'
});

// Connect user with the owner of the cart
userSchema.virtual('carts', {
    ref: 'Cart',
    localField: '_id',
    foreignField: 'user'
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    return userObject;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ "email": email });

    if(!user) {
        throw new Error("Unable to find user because of wrong email");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error("Unable to find user because of wrong password");
    }

    return user;
}

const User = mongoose.model('User', userSchema);

module.exports = User;

