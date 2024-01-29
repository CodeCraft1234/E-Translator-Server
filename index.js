const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();


//MIADLEWERE
app.use(cors());
app.use(express.json());


const port =  process.env.PORT || 5000;

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@robiul.13vbdvd.mongodb.net/?retryWrites=true&w=majority`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@robiul.13vbdvd.mongodb.net/?retryWrites=true&w=majority`;


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
    // await client.connect();
    // Send a ping to confirm a successful connection

     const usersInfocollection=client.db('E-Translator').collection('usersInfo')
     const blogsInfocollection=client.db('E-Translator').collection('blogsInfo')

    //------------------------------------------------------------------------
     //                        users info part
     //-----------------------------------------------------------------------
     app.post('/users',async(req,res)=>{
      const data=req.body;
      const result=await usersInfocollection.insertOne(data)
      res.send(result)
     })
     
     app.get('/users',async(req,res)=>{
      const result=await usersInfocollection.find().toArray()
      res.send(result)
     })
    //------------------------------------------------------------------------
     //                        blogs info
     //-----------------------------------------------------------------------
     app.post('/blogs',async(req,res)=>{
      const data=req.body;
      const result=await blogsInfocollection.insertOne(data)
      res.send(result)
     })
     
     app.get('/blogs',async(req,res)=>{
      const result=await blogsInfocollection.find().toArray()
      res.send(result)
     })
   
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
    run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("hello translator")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })