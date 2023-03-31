#### Tech Stack:
- MongoDB
- Mongoose
- JSON Web token
- Email integrations
 
## How to run application:
```
npm install
npm run dev
```
- Import postman collection to play around the APIs 

## Mongoose
- Object Relation Model

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

### Data Validations & Sanitisation

- Validation is defined in the SchemaType
- Validation is middleware. Mongoose registers validation as a pre('save') hook on every schema by default.
- You can disable automatic validation before save by setting the validateBeforeSave option
- You can manually run validation using doc.validate(callback) or doc.validateSync()
- You can manually mark a field as invalid (causing validation to fail) by using doc.invalidate(...)
- Validators are not run on undefined values. The only exception is the required validator.
- Validation is asynchronously recursive; when you call Model#save, sub-document validation is executed as well. If an error - occurs, your Model#save callback receives it
- Validation is customizable

#### Customer Validations 

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



### REST API
- Representational State transfer - application  programming interfaces (REST API or RESTFul API)
- Lets take task scenario
    - CREATE -> POST /tasks
    - READ ->   GET /tasks
                GET /tasks/:id
    - UPDATE -> PATCH /tasks/:id
    - DELETE -> DELETE /tasks/:id 


// explain about : JWT Token
// mongodb -> how to connect
// mongoose -> functions
// expressjs
// routers
// models
// sorting,pagination,filtering
// file upload
