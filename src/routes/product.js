const express = require('express');
const router = new express.Router();
const Product = require('../models/product');
const auth = require("../middleware/auth");

router.post('/products', auth, async (req, res) => {
    const product = new Product({
        ...req.body
    })
    try {
        await product.save()

        res.status(201).send(product)
    } catch(e) {
        res.status(400).send(e)
    }
})

// GET /products?limit=10&skip=20
// GET /products?sortBy=price_desc
// GET /products?sortBy=name_asc
router.get('/products', auth, async (req, res) => {
    const sort = {}

    if(req.query.sortBy){
        const parts = req.query.sortBy.toString().split("_");
        sort[parts[0]] = (parts[1] === 'desc' ? -1 : 1);
    }

    try {
        Product.
            find({}).
            limit(parseInt(req.query.limit)).
            skip(parseInt(req.query.skip)).
            sort(sort).
            then((products) => {
                res.status(200).send(products);
            });
        
    } catch(e){
        res.status(500).send(e);
    }
});

router.get('/products/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const product = await Product.findOne({ _id });

        if(!product) {
            return res.status(404).send()
        }

        res.send(product)
    } catch(e) {
        res.status(500).send(e)
    }
});

router.patch('/products/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['price', 'comment', 'star']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    });

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates'})
    }

    try {
        const product = await Product.findOne({ _id: req.params.id});

        if(!product) {
            return res.status(404).send({error: 'Invalid Updates'})
        }

        if(updates.includes('comment')){
            // find a user by its id in the ratings array of product schema
            const ratings = product['ratings']

            console.log(req.user._id);
            userIndex = ratings.findIndex(el => {
                return el.user.toString() == req.user._id.toString()
            });
            console.log(userIndex)

            if(userIndex !== -1) {
                ratings[userIndex]["comment"] = req.body["comment"],
                ratings[userIndex]["user"] =  req.user._id
            } else {
                ratings.push({
                    "comment": req.body["comment"],
                    "user": req.user._id
                })
            }

            product["ratings"] = ratings
        }

        if(updates.includes('star')){
            // find a user by its id in the ratings array of product schema
            const ratings = product['ratings']

            console.log(req.user._id);
            userIndex = ratings.findIndex(el => {
                return el.user.toString() == req.user._id.toString()
            });
            console.log(userIndex)

            if(userIndex !== -1) {
                ratings[userIndex]["star"] = req.body["star"],
                ratings[userIndex]["user"] =  req.user._id
            } else {
                ratings.push({
                    "star": req.body["star"],
                    "user": req.user._id
                })
            }

            product["ratings"] = ratings
        }

        if(updates.includes('price')){
            product['price'] = req.body['price']
        }

        await product.save()

        res.send(product)
    } catch(e) {
        res.status(500).send(e)
    }
}); 

router.delete('/products/:id', auth, async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id });

        if(!product) {
            return res.status(404).send()
        }

        res.send(product)
    } catch(e) {
        res.status(500).send(e)
    }
});

module.exports = router;
