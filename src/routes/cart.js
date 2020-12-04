const express = require('express')
const router = new express.Router();
const Cart = require('../models/cart');
const auth = require("../middleware/auth");

router.post('/carts', auth, async (req, res) => {
    const cart = new Cart({
        ...req.body,
        user: req.user._id
    });

    try {
        await cart.save();

        res.status(201).send(cart)
    } catch(e) {
        res.status(500).send(e);
    }
});

module.exports = router;