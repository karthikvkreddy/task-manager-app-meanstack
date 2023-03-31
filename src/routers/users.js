const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');

/**
 * Create users 
 */
router.post('/users', async (req,res) => {
    const user = new User(req.body);
    try {
        const token = await user.generateAuthToken();
        await user.save();
        res.status(201).send({user,token});
    } catch(err) {
        res.status(400).send(err);
    }
    // without async await 
    // user.save().then(() => {
    //     res.send(user);
    // }).catch((e) => {
    //     res.status(400).send(e);
    // });
});


router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCrendentials(req.body.email, req.body.password);
        /// as we see, we are creating an instance of an object User
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch(err) {
        res.status(400).send(err);
    }
})

/**
 * List users
 */
// middleware: auth will allow the next request only if it satifies the condition.
router.get('/users/me', auth, async (req, res) => {
    // coz? auth is already auuthenticated and returned the user data
    res.send(req.user);
})

/**
 * Update user based on ID
 */
router.patch('/users/me', auth, async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','password', 'age'];
    const isValidateOperation = updates.every((update) => allowedUpdates.includes(update));
    
    if (!isValidateOperation) {
        return res.status(400).send({err: 'Invalid operation'});
    }
    
    try {
        updates.forEach((update) => req.user[update] = req.body[update]);

        // so we are not updating anything directly to db, instead getting the data and then applying the changes and then saving.
        await req.user.save();

        // below code is commented as it is directly updating the data directly to DB
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true , runValidators: true});
        
        // if(!user) {
        //     return res.status(400).send();
        // }
        res.send(req.user);
    } catch(err) {
        res.status(500).send(err);
    }
});

/**
 * Remove user based on ID
 */
router.delete('/users/me', auth, async (req, res) => {
    try {
        await User.deleteOne(req.user._id);
        res.send(req.user);
    } catch(err) {
        res.status(500).send(err);
    }
})


router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save();
        res.send();

    } catch(err) {
        res.status(500).send();
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();

    } catch(err) {
        res.status(500).send();
    }
})

module.exports = router;