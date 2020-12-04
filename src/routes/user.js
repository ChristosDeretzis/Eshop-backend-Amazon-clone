const express = require("express");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

const User = require("../models/user");

// Add a new user to the database
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        // Generate token for the user and add it to tokens list of user
        const token = jwt.sign({_id: user._id.toString() }, process.env.JWTSECRET);
        user.tokens = user.tokens.concat({ "token": token });

        user.password = await bcrypt.hash(user.password, 10);

        await user.save()
        res.status(201).send({ user, token });
    } catch(e) {
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        console.log(req.body);
        const user = await User.findByCredentials(req.body.email, req.body.password);

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWTSECRET);
        user.tokens = user.tokens.concat({ "token": token });

        await user.save()

        res.send({ user, token });
    } catch {
        res.status(400).send()
    }
});

router.post('/users/logout',auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        });

        await req.user.save()

        res.send()
    } catch {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'password', 'firstName', 'lastName'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates' });
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save()
        res.send(req.user);
    } catch(e) {
        res.status(400).send(e)
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
})



module.exports = router;
