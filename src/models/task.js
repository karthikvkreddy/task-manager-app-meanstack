const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description:{
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // it creates a reference to the another collection 1:1 relation
        ref: 'User'
    }
},{
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;