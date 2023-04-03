const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,  // trim the space before and after
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive number');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password doesnt meet the requirement');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

// virtual properties (to create a relationship between 2 document) 1: M relation
userSchema.virtual('myTasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// .methods accessed on the instance
userSchema.methods.generateAuthToken = async function() {
    const user = this

    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token})
    await user.save();

    return token;
}

// to hide private data
// toJSON => default method this applies to all response we sending json
userSchema.methods.toJSON = function() {
    const user = this

    // to get user object
    const userObject = user.toObject();
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject;
}

// creating our own methods
// .statics => accessed on the models
userSchema.statics.findByCrendentials = async (email, password) => {
    const user = await User.findOne({email: email});
   
    if(!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
}


// this will let to do some opeartion before the data is being saved.
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

// delete user tasks when user is removed
userSchema.pre('deleteOne', {document: false, query: true},async function (next) {
    const user = this;
    await Task.deleteMany({owner: user.getFilter()["_id"]})
    next();

})

const User = mongoose.model('User', userSchema)

module.exports = User;