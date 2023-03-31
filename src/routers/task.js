const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');

const Task = require('../models/task');


/**
 * Create Tasks
 */
router.post('/tasks',auth, async (req,res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task);
    } catch(err) {
        res.status(400).send(err);
    }
});

/**
 * List Tasks with filters 
 */
//GET /taks?completed=true
//GET /tasks?limit=10&skip=2 Pagination: limit => to limit the rows in a page ||  skip=> to decide page number ?limit==10&skip=20
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks',auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1

    }
    try {
        await req.user.populate({
            path: 'myTasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        });
        res.status(201).send(req.user.myTasks);
    } catch(err) {
        res.status(400).send(err);
    }
})

/**
 * List task based on ID
 */
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({_id, owner: req.user._id});
        if(!task) {
            return res.send(404).send();
        }
        res.status(201).send(task);
    } catch(err) {
        res.status(500).send(err);
    }
})


/**
 * Update Task based on ID
 */
router.patch('/tasks/:id',auth, async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','completed'];
    const isValidateOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidateOperation) {
        return res.status(400).send({err: 'Invalid operation'});
    }
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true , runValidators: true});
        if(!task) {
            return res.status(400).send();
        }

        // here we are trying to updating the user data which we returned from DB.
        updates.forEach((update) => task[update] = req.body[update]);

        // so we are not updating anything directly to db, instead getting the data and then applying the changes and then saving.
        await task.save();

        res.send(task);
    } catch(err) {
        res.status(500).send();
    }
});


/**
 * Remove task based on ID
 */
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id });
        if(!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch(err) {
        res.status(500).send(err);
    }
})



module.exports = router;