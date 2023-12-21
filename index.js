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