## Mongoose
- Object Relation Model

## 1. How to define Collection ?
#### Install Mongoose from the command line using npm:
```
npm install mongoose --save
```
####  With Mongoose, everything is derived from a Schema.
```
const userSchema = new mongoose.Schema({
  name: String,
  age: Number
});
```

#### The next step is compiling our schema into a Model.
```
const User = mongoose.model('User', userSchema);
```

#### A model is a class with which we construct documents. 
```
const me = new User({
    name: 'karthik',
    age: 25
})
```

#### Each document can be saved to the database by calling its save method
```
me.save().then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
})
```

## 2. Data Validations & Sanitisation

- Validation is defined in the SchemaType
- Validation is middleware. Mongoose registers validation as a pre('save') hook on every schema by default.
- You can disable automatic validation before save by setting the validateBeforeSave option
- You can manually run validation using doc.validate(callback) or doc.validateSync()
- You can manually mark a field as invalid (causing validation to fail) by using doc.invalidate(...)
- Validators are not run on undefined values. The only exception is the required validator.
- Validation is asynchronously recursive; when you call Model#save, sub-document validation is executed as well. If an error - occurs, your Model#save callback receives it
- Validation is customizable

### Customer Validations 

name is required:
```
const User = mongoose.model('User', {
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    }
})
```

Custom Validations using validate():

```
const User = mongoose.model('User', {
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        validation(value) {
            if (value < 0) {
                throw new Error('Age must be positive number');
            }
        }
    }
})
```

- Use validate npm package to implement more complex validations:   
    - for example validator.isMail()


### 1. Using statics models
- You can also add static functions to your model
- Add a function property to the second argument of the schema-constructor (statics)
- Add a function property to schema.statics
- Call the Schema#static() function

eg: It is a custom function that check if the password shared by user is matching with the one in db
```
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
```
## 2. Virtuals
Virtuals are document properties that you can get and set but that do not get persisted to MongoDB. The getters are useful for formatting or combining fields, while setters are useful for de-composing a single value into multiple values for storage.

### toJSON:
- Exactly the same as the toObject option but only applies when the document's toJSON method is called.
- This includes the output of calling JSON.stringify() on a Mongoose document, because JSON.stringify() calls toJSON()

Eg. showing how user data is shown to users. it applies to by default to all the api calls since we adding toJSON.
```
userSchema.methods.toJSON = function() {
    const user = this

    // to get user object
    const userObject = user.toObject();
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject;
}
```

### Populate

- Mongoose also supports populating virtuals. A populated virtual contains documents from another collection. To define a populated virtual, you need to specify:
    - The ref option, which tells Mongoose which model to populate documents from.
    - The localField and foreignField options. Mongoose will populate documents from the model in ref whose foreignField matches this document's localField.

Eg. here user table is linked to the task table based on owner and user _id field.
```
// virtual properties (to create a relationship between 2 document) 1: M relation
userSchema.virtual('myTasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})
```

To use it in the routes calls in Task API call to show only the tasks created by users.
```
await req.user.populate({
            path: 'myTasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        });
```


### Pre
- Pre middleware functions are executed one after another, when each middleware calls next.

Syntax:
```
const schema = new Schema({ /* ... */ });
schema.pre('save', function(next) {
  // do stuff
  next();
});
```

Eg. This will let to do some opeartion before the data is being saved. below example check if the user supplied password is encrypted, if not encypt.

```
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})
```

### References:
- https://mongoosejs.com/docs

