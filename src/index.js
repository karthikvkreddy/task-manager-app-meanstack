const express = require('express');
require('./db/mongoose')

const userRouter = require('./routers/users');
const taskRouter = require('./routers/task');

const app = express()
const port = process.env.PORT || 3000

// do something before the route handler
// app.use((req, res, next) => {
//     console.log(req.method, req.path);
//     if ( req.method == 'GET') {
//         res.send('GET request is disabled');
//     } else {
//         next();
//     }
//     // this will make sure it goes to next request
// });

// middleware for maintenance mode
// app.use((req, res, next) => {
//     res.status(503).send('Site is Currently down. check back soon..!!');
// });

// automatically parses incoming request
app.use(express.json());

// separating the router module
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});

// const Task = require('./models/task');
// const User = require('./models/user');

//const main = async () => {
    // find user by the task
    // const task = await Task.findById('64252e663671a95d96bb3a5e');
    // // populate: it will populate all the rows in the relationship
    // await task.populate('owner');
    // // it will returns the object instead of just an id
    // console.log(task.owner);

    // find tasks by user id
    // const user = await User.findById('64252dc065ff5ad1481f65c3')
    // await user.populate('myTasks')
    // console.log(user.myTasks);  

//}
// main()
// const jwt = require('jsonwebtoken');

// 1. create token
// const myFunction = async () => {
//     // params: payload, secret, 
//     const token = jwt.sign({_id:'abc123'},'thisismynewcourse', {expiresIn: '7 days'});
//     console.log(token);
    
//     // 2. verify token:
//     const data = jwt.verify(token, 'thisismynewcourse');
//     console.log(data);
// }
// myFunction();

// Output: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhYmMxMjMiLCJpYXQiOjE2ODAwNTU3MTZ9.F4KLob6xdhndjGkd6K9EOF8ANCPtW6IxNeevKJ8vXpk
// first peace = header(type of token, algorith,)
// second peace = (payload/ body) base64
// third peace = signature to verify the Token


// with middleware:
//  new request -> new route handler

// without middleware:
// new request -> do something -> new route handler



