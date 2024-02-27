const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const SSLCommerzPayment = require("sslcommerz-lts");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

//MIADLEWERE
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://etranslator.netlify.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 5000;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@robiul.13vbdvd.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@robiul.13vbdvd.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = false; //true for live, false for sandbox
async function run() {
  try {
    const usersInfocollection = client.db("E-Translator").collection("usersInfo");
    const blogsInfocollection = client.db("E-Translator").collection("blogsInfo");
    const commentsInfocollection = client.db("E-Translator").collection("commentsInfo");
    const productCollection = client.db("E-Translator").collection("products");
    const orderCollection = client.db("E-Translator").collection("orders");
    const translationCollection = client
      .db("E-Translator")
      .collection("translations");
    const ratingCollection = client.db("E-Translator").collection("rating");
    const feedbackCollection = client.db("E-Translator").collection("feedback");
    const translationsuggestion = client.db("E-Translator").collection("suggestions");
    const tran_id = new ObjectId().toString();

   

    // auth api
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      console.log(user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        secure: true,
        sameSite: "none",
      });
      res.send({ success: true });
      // res.send(user)
    });
    app.post("/logout", async (req, res) => {
      const user = req.body;
      console.log("loging out", user);
      res.clearCookie("token", { maxAge: 0 }).send({ success: true });
    });
    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);
      socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
      });
      socket.on("send_message", (data) => {
        console.log(data);
        socket.to(data.room).emit("receive_message", data);
      });
      socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
      });
    });
    server.listen(5001, () => {
      console.log("SOCKET.IO SERVER RUNNING");
    });
    
    //-----------------------------------------------------------------------
    //                        users info part
    //-----------------------------------------------------------------------
    app.post("/users", async (req, res) => {
      const data = req.body;
      const result = await usersInfocollection.insertOne(data);
      res.send(result);
    });

    app.post("/rating", async (req, res) => {
      const data = req.body;
      const result = await ratingCollection.insertOne(data);
      res.send(result);
    });

    app.get("/rating", async (req, res) => {
      const result = await ratingCollection.find().toArray();
      res.send(result);
    });

    app.post("/feedback", async (req, res) => {
      const data = req.body;
      const result = await feedbackCollection.insertOne(data);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await usersInfocollection.find().toArray();
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await usersInfocollection.deleteOne(filter);
      res.send(result);
    });

    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedoc = {
        $set: {
          admin: true,
        },
      };
      const result = await usersInfocollection.updateOne(filter, updatedoc);
      res.send(result);
    });

    app.post("/rating", async (req, res) => {
      const data = req.body;
      const result = await ratingCollection.insertOne(data);
      res.send(result);
    });

    app.post("/feedback", async (req, res) => {
      const data = req.body;
      const result = await feedbackCollection.insertOne(data);
      res.send(result);
    });

    //------------------------------------------------------------------------
    //                        blogs info part
    //-----------------------------------------------------------------------

    app.post("/blogs", async (req, res) => {
      const data = req.body;
      const result = await blogsInfocollection.insertOne(data);
      res.send(result);
    });

    app.get("/blogs", async (req, res) => {
      const result = await blogsInfocollection.find().toArray();
      res.send(result);
    });

    app.get("/feedback", async (req, res) => {
      const result = await feedbackCollection.find().toArray();
      res.send(result);
    });

    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await blogsInfocollection.findOne(filter);
      res.send(result);
    });

    app.patch("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatedoc = {
        $set: {
          title: body.title,
          description: body.description,
        },
      };
      const result = await blogsInfocollection.updateOne(filter, updatedoc);
      res.send(result);
    });

    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await blogsInfocollection.deleteOne(filter);
      res.send(result);
    });

    //---------------------------------------------------------
     // suggestions api
     //---------------------------------------------------
    
     app.get('/api/suggestions', async (req, res) => {
      try {
        const data = await translationsuggestion.findOne({});
        const suggestions = data.translation_suggestions;
        const formattedSuggestions = suggestions.map(({ letter, words }) => ({ letter, words }));
        res.json(formattedSuggestions);
      } catch (error) {
        console.error('Error fetching translation suggestions:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });


    //------------------------------------------------------
    //------------------comment part------------------------
    //-------------------------------------------------------
    app.post("/blogComment", async (req, res) => {
      const data = req.body;
      const result = await commentsInfocollection.insertOne(data);
      res.send(result);
    });

    app.get("/blogComment", async (req, res) => {
      const result = await commentsInfocollection.find().toArray();
      res.send(result);
    });
  
    app.get('/blogComment/get/:id',async(req,res)=>{
      const id=req.params.id
      const filter={id:id}
        const result=await commentsInfocollection.find(filter).toArray()
        res.send(result)
    })


    //------------------------------------------------------------------------
    //                        translation history part
    //------------------------------------------------------------------------
    app.post("/api/history", async (req, res) => {
      try {
        await client.connect();
        const translation = req.body;
        const result = await translationCollection.insertOne(translation);
        res.status(201).json(result.ops[0]);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      } finally {
        await client.close();
      }
    });
    app.get("/api/history", async (req, res) => {
      try {
        await client.connect();
        const translations = await translationCollection
          .find()
          .sort({ createdAt: -1 })
          .toArray();
        res.json(translations);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      } finally {
        await client.close();
      }
    });
    
    app.delete("/api/history/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await translationCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error deleting translation history:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    //--------------------------------------------
    //                ssl commerz
    //------------------------------------------------

    //sslcommerz integration
    app.post("/order/:id", async (req, res) => {
      // console.log(req.body);
      const product = await productCollection.findOne({
        _id: new ObjectId(req.body.productId),
      });
      const order = req.body;
    
    
      const data = {
        total_amount: order.price,
        currency: "BDT",
        tran_id: tran_id, // use unique tran_id for each api call
        success_url: `http://localhost:5000/payment/success/${tran_id}`,
        fail_url: `http://localhost:5000/payment/fail/${tran_id}`,
        cancel_url: "http://localhost:3030/cancel",
        ipn_url: "http://localhost:3030/ipn",
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: order.name,
        cus_email: "customer@example.com",
        cus_add1: order.address,
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: order.postcode,
        cus_country: "Bangladesh",
        cus_phone: order.phonenumber,
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };
      console.log(data);
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      sslcz.init(data).then((apiResponse) => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL;
        res.send({ url: GatewayPageURL });
        const finalOrder = {
          product,
          paidStatus: false,
          tranjectionId: tran_id,
        };
        const result = orderCollection.insertOne(finalOrder);
        console.log("Redirecting to: ", GatewayPageURL);
      });
      app.post("/payment/success/:tranId", async (req, res) => {
        // console.log(req.params.tranId);
        const result = await orderCollection.updateOne(
          { tranjectionId: req.params.tranId },
          {
            $set: {
              paidStatus: true,
            },
          }
        );

        if (result.modifiedCount > 0) {
          res.redirect(
            `http://localhost:5173/payment/success/${req.params.tranId}`
          );
        }
      });

      app.post("/payment/fail/:tranId", async (req, res) => {
        const result = await orderCollection.deleteOne(
          { tranjectionId: req.params.tranId },
          {
            $set: {
              paidStatus: true,
            },
          }
        );

        if (result.deletedCount) {
          res.redirect(
            `http://localhost:5173/payment/fail/${req.params.tranId}`
          );
        }
      });
    });

    

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
   
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello translator");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//----------------------------------------------------------------
//                    mongoose code
//----------------------------------------------------------------

// const express = require("express");
// const cors = require("cors");
// const mongoose = require('mongoose');
// require("dotenv").config();
// const bodyParser = require('body-parser');
// const SSLCommerzPayment = require("sslcommerz-lts");
// const { ObjectId } = require("mongodb");
// const http = require("http");
// const socketIo = require("socket.io");
// const { User, Blog, Product, Order, Translation, Rating, Feedback, Message, Admin, Payment } = require('./model/Model');

// const app = express();
// app.use(bodyParser.json());
// const server = http.createServer(app);
// const io = socketIo(server);

// // Middleware
// app.use(cors());
// app.use(express.json());

// const port = process.env.PORT || 5000;

// // // MongoDB connection URI
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@robiul.13vbdvd.mongodb.net`;

// // // mongoose.connect(uri);

// mongoose.connect(uri);
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// // Socket.io implementation
// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("chat message", async (msg) => {
//     const message = {
//       text: msg.text,
//       type: msg.type,
//       user: msg.user,
//       createdAt: new Date(),
//     };

//     try {
//       await Message.create(message);
//       io.emit("chat message", message);
//     } catch (error) {
//       console.error("Error storing message in MongoDB:", error);
//     }
//   });

//   socket.on("admin message", async (msg) => {
//     const message = {
//       text: msg.text,
//       type: msg.type,
//       user: msg.user,
//       createdAt: new Date(),
//     };

//     try {
//       await Message.create(message);
//       io.to(adminSocketId).emit("admin message", message); // Send to a specific admin
//     } catch (error) {
//       console.error("Error storing admin message in MongoDB:", error);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });

//   socket.on("admin connected", () => {
//     // Store the admin socket id when connected
//     adminSocketId = socket.id;
//     console.log("Admin connected");
//   });
// });

// // Routes
// app.post("/api/history", async (req, res) => {
//   try {
//     const translation = req.body;
//     const result = await Translation.create(translation);
//     res.status(201).json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get("/api/history", async (req, res) => {
//   try {
//     const translations = await Translation.find().sort({ createdAt: -1 }).exec();
//     res.json(translations);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Messages Routes
// app.post("/messages", async (req, res) => {
//   try {
//     const message = req.body;
//     const result = await Message.create(message);
//     res.status(201).json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get("/messages", async (req, res) => {
//   try {
//     const messages = await Message.find().sort({ createdAt: 1 }).exec();
//     res.json(messages);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Users Routes
// app.post("/users", async(req, res) => {
//   try {
//     const user = await User.create(req.body);
//     res.status(201).json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get("/users", async(req, res) => {
//   try {
//     const users = await User.find().exec();
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Blogs Routes
// app.post("/blogs", async(req, res) => {
//   try {
//     const blog = await Blog.create(req.body);
//     res.status(201).json(blog);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get("/blogs", async(req, res) => {
//   try {
//     const blogs = await Blog.find().exec();
//     res.json(blogs);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Products Routes
// app.post("/products", async(req, res) => {
//   try {
//     const product = await Product.create(req.body);
//     res.status(201).json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get("/products", async(req, res) => {
//   try {
//     const products = await Product.find().exec();
//     res.json(products);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Orders Routes
// app.post("/orders", async(req, res) => {
//   try {
//     const order = await Order.create(req.body);
//     res.status(201).json(order);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get("/orders", async(req, res) => {
//   try {
//     const orders = await Order.find().exec();
//     res.json(orders);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // SSLCommerz Integration
// app.post("/orders/:id", async (req, res) => {
//   try {
//     const productId = req.params.id;
//     console.log(productId);
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     const tran_id = new ObjectId().toString();
//     const data = {
//       total_amount: product.price,
//       currency: "BDT",
//       tran_id: tran_id,
//       success_url: `http://localhost:5173/payment/success/${tran_id}`,
//       fail_url: `http://localhost:5173/payment/fail/${tran_id}`,
//       cancel_url: 'http://localhost:3030/cancel',
//       ipn_url: 'http://localhost:3030/ipn',
//       shipping_method: 'Courier',
//       product_name: product.name,
//       product_category: 'Electronic',
//       product_profile: 'general',
//       cus_name: req.body.name,
//       cus_email: req.body.email,
//       cus_add1: req.body.address,
//       cus_add2: "Dhaka",
//       cus_city: "Dhaka",
//       cus_state: "Dhaka",
//       cus_postcode: req.body.postcode,
//       cus_country: "Bangladesh",
//       cus_phone: req.body.phonenumber,
//       cus_fax: "01711111111",
//       ship_name: "Customer Name",
//       ship_add1: "Dhaka",
//       ship_add2: "Dhaka",
//       ship_city: "Dhaka",
//       ship_state: "Dhaka",
//       ship_postcode: 1000,
//       ship_country: "Bangladesh",
//     };
//     const sslcz = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASS, process.env.IS_LIVE);
//     sslcz.init(data).then(async (apiResponse) => {
//       let GatewayPageURL = apiResponse.GatewayPageURL;
//       res.send({ url: GatewayPageURL });
//       const finalOrder = new Order({
//         product: product._id,
//         paidStatus: false,
//         transactionId: tran_id,
//       });
//       await finalOrder.save();
//       console.log("Redirecting to: ", GatewayPageURL);
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Payment Success Route
// app.post("/payment/success/:tranId", async (req, res) => {
//   try {
//     const tranId = req.params.tranId;
//     const result = await Order.updateOne(
//       { transactionId: tranId },
//       { paidStatus: true }
//     );
//     if (result.modifiedCount > 0) {
//       res.redirect(`http://localhost:5173/payment/success/${tranId}`);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Payment Fail Route
// app.post("/payment/fail/:tranId", async (req, res) => {
//   try {
//     const tranId = req.params.tranId;
//     const result = await Order.deleteOne({ transactionId: tranId });
//     if (result.deletedCount) {
//       res.redirect(`http://localhost:5173/payment/fail/${tranId}`);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Define other routes and logic here...

// // Start the server
// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
