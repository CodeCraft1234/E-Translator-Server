const express = require("express");
const cors = require("cors");
require('dotenv').config();
const SSLCommerzPayment = require('sslcommerz-lts');
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

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = false //true for live, false for sandbox


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

     const usersInfocollection=client.db('E-Translator').collection('usersInfo')
     const blogsInfocollection=client.db('E-Translator').collection('blogsInfo')
     const productCollection = client.db("E-Translator").collection("products");
    const orderCollection = client.db("E-Translator").collection("orders");
    const tran_id = new ObjectId().toString();

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

     app.delete('/users/:id',async(req,res)=>{
      const id=req.params.id 
      console.log(id)
      const filter={_id: new ObjectId(id)}
      console.log(filter)
      const result=await usersInfocollection.deleteOne(filter) 
      res.send(result)
     })

    //------------------------------------------------------------------------
     //                        blogs info part
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

     
     //sslcommerz integration
     app.post("/order/:id", async(req, res) =>{
      // console.log(req.body);
      const product = await productCollection.findOne({
        _id: new ObjectId(req.body.productId),
      });
      const order = req.body;
      // console.log(product);

      const data = {
        total_amount: order.price,
        currency: 'BDT',
        tran_id: tran_id, // use unique tran_id for each api call
        success_url: `http://localhost:5000/payment/success/${tran_id}`,
        fail_url: `http://localhost:5000/payment/fail/${tran_id}`,
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: order.name,
        cus_email: 'customer@example.com',
        cus_add1: order.address,
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: order.postcode,
        cus_country: 'Bangladesh',
        cus_phone: order.phonenumber,
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    console.log(data);
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL;
        res.send({ url: GatewayPageURL });

        const finalOrder = {
          product,
          paidStatus: false,
          tranjectionId: tran_id,
        };

        const result = orderCollection.insertOne(finalOrder);
       

        console.log('Redirecting to: ', GatewayPageURL);
    });

    
  

    app.post("/payment/success/:tranId", async(req, res) =>{
      // console.log(req.params.tranId);
      const result = await orderCollection.updateOne(
        { tranjectionId: req.params.tranId },
        {
          $set:{
          paidStatus: true,
          },
        }
        );

        if(result.modifiedCount > 0){
          res.redirect(`http://localhost:5173/payment/success/${req.params.tranId}`
          );
        }
     });

     app.post("/payment/fail/:tranId", async(req, res) =>{
      // console.log(req.params.tranId);
      const result = await orderCollection.deleteOne(
        { tranjectionId: req.params.tranId },
        {
          $set:{
          paidStatus: true,
          },
        }
        );

        if(result.deletedCount){
          res.redirect(`http://localhost:5173/payment/fail/${req.params.tranId}`
          );
        }
     });

    });
  

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