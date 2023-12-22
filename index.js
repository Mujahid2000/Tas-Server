const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5050;

//middleware
app.use(cors());
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mujahid.frqpuda.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const TaskCollection = client.db("New-Task").collection('Task');

    
    app.post('/task', async(req, res) =>{
      const user = req.body;
      const result = await TaskCollection.insertOne(user);
      res.send(result);
    })

    app.get('/task/:id/:username', async(req, res) =>{
        const username = req.params.username;
        const filter = {username : username , _id: new ObjectId(req.params.id)}
        const result = await TaskCollection.findOne(filter);
        res.send(result);
    })

     app.get('/task/:username', async(req, res) =>{
        const username = req.params.username;
        const filter = {username : username}
        const result = await TaskCollection.find(filter).toArray();
        res.send(result);
     })

    app.delete('/task/:id', async(req, res) =>{
        const id = req.params.id;
        const filter = {_id : new ObjectId (id)}
        const result = await TaskCollection.deleteOne(filter)
        res.send(result)
      })

    

    app.patch('/task/:id', async (req, res) => {
      try {
        const body = req.body;
        const result = await TaskCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: {
            taskName: body.taskName,
            time: body.time,
            deadlines: body.deadlines,
            priority: body.priority,
            location: body.location,
            description: body.description
          }}
        );
    
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
      }
    });


    app.patch('/changeStatus/:id', async (req, res) => {
      try {
        
        const updatedTask = await TaskCollection.updateOne(
          {_id: new ObjectId(req.params.id)},
          { $set: { status: req.body.status } }, 
          { upsert: true } 
        );
        res.json(updatedTask);
      } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });


    app.get('/')
    


    // Send a ping to confirm a successful connection
    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('task server is running')
})

app.listen(port, () => {
    console.log(`Task server is sitting on the port ${port}`);
})