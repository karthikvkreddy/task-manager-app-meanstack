// CRUD Create Read Update Read

const { MongoClient, ObjectID, ObjectId } = require("mongodb");
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// Create a new MongoClient
const client = new MongoClient(connectionURL);

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
    
    const db = client.db(databaseName);

    // return the results
    const userFindOne = await db.collection('users').findOne({ _id: new ObjectId("640acc1e4f8b3b134826adf9")})
    //console.log(userFindOne);

    // find returns the curser at the data point
    // toArray()
    const userFind = await db.collection('users').find({ _id: new ObjectId("640acc1e4f8b3b134826adf9")}).toArray();
    // count()
    console.log(userFind);


    // TASK
    // Task Task
    const lastTask = await db.collection('tasks').find().sort({_id:-1}).limit(1).toArray();
    console.log(lastTask);

    // not completed Tasks
    const notCompleted = await db.collection('tasks').find({completed: false}).toArray();
    console.log(notCompleted);

    // Update
    // UpdateOne
    // await db.collection('users').updateOne({_id:new ObjectId("640aacf908f2806a69463f70")}, 
    // {
    //     $set: {
    //         name: 'newKarthikReddy'
    //     }
    // }).then((res) => {
    //     console.log(res)
    // }).catch((err) => {
    //     console.log(err)
    // });    

    await db.collection('users').updateOne({_id:new ObjectId("640acc1e4f8b3b134826adf9")}, 
    {
        $inc: {
            age: 30
        }
    }).then((res) => {
        console.log(res)
    }).catch((err) => {
        console.log(err)
    });    

    // updateMany
    await db.collection('users').updateMany(
        {age: {$gt:20}}, 
        {
            $set: {
                name: "newName"
            }
        }
        
        ).then((res) => {
        console.log(res)
    }).catch((err) => {
        console.log(err)
    });   

    // delete

    await db.collection('users').deleteMany(
        {
            age: {$lt:5}
        }
        ).then((res) => {
        console.log(res)
    }).catch((err) => {
        console.log(err)
    });
    // update all matched documents whose age is greater than 20

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

  

  // Update Many 
}
run().catch(console.dir);
