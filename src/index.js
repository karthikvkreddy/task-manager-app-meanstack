const express = require('express');
require('./db/mongoose')
require('dotenv').config({ path: `./config/.env.${process.env.NODE_ENV}` })

const userRouter = require('./routers/users');
const taskRouter = require('./routers/task');

const app = express()
const port = process.env.PORT 

// automatically parses incoming request
app.use(express.json());

// separating the router module
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});