const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../src/models/user');
const Product = require('../../src/models/product');
const Cart = require('../../src/models/cart');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    username: 'thessguy97',
    firstName: 'Nikos',
    lastName: 'Papadopoulos',
    password: 'user87on89',
    email: 'nikos.papadopoulos@gmail.com',
    tokens: [{
        token: jwt.sign({_id: userOneId._id }, process.env.JWTSECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    username: 'savvikos99',
    firstName: 'Maria',
    lastName: 'Psicharaki',
    password: 'theBestGirl!967',
    email: 'mariaPsich99@gmail.com',
    tokens: [{
        token: jwt.sign({_id: userTwoId._id }, process.env.JWTSECRET)
    }]
}

const productOne = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Sergal Milk',
    description: 'It is 5% fat milk',
    price: 1.2
}

const productTwo = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Xiaomi Redmi Note 5',
    description: 'The best chinese phone that has ever been',
    price: 150
}

const productThree = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Oral B toothpaste',
    description: 'A toothpaste that helps you combat tooth decay',
    price: 3.5
}

const cartOne = {
    products: [
        productOne._id,
        productThree._id
    ],
    user: userOne._id
}

const cartTwo = {
    products: [
        productTwo._id,
        productThree._id
    ],
    user: userTwo._id
}

const setUpDatabase =  async () => {
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Product(productOne).save();
    await new Product(productTwo).save();
    await new Product(productThree).save();
    await new Cart(cartOne).save();
    await new Cart(cartTwo).save();
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    productOne,
    productTwo,
    productThree,
    cartOne,
    cartTwo,
    setUpDatabase
}


