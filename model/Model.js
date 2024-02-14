
const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

// Define schema for users
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  // Add other fields as needed
});

// Define schema for blogs
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  // Add other fields as needed
});

// Define schema for products
const productSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
        required: true
    },
  name: String,
  price: Number,
  description: String,
  // Add other fields as needed
});

// Define schema for orders
const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: Number,
  // Add other fields as needed
});

// Define schema for translations
const translationSchema = new mongoose.Schema({
  // Define translation schema fields here
});

// Define schema for ratings
const ratingSchema = new mongoose.Schema({
  // Define rating schema fields here
});

// Define schema for feedback
const feedbackSchema = new mongoose.Schema({
  // Define feedback schema fields here
});

// Define schema for messages
const messageSchema = new mongoose.Schema({
  // Define message schema fields here
});

// Define schema for admins
const adminSchema = new mongoose.Schema({
  // Define admin schema fields here
});

// Define schema for payments
const paymentSchema = new mongoose.Schema({
  transactionId: String,
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  amount: Number,
  status: String,
  // Add other fields as needed
});

// Create models
const User = mongoose.model('User', userSchema);
const Blog = mongoose.model('Blog', blogSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Translation = mongoose.model('Translation', translationSchema);
const Rating = mongoose.model('Rating', ratingSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const Message = mongoose.model('Message', messageSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { User, Blog, Product, Order, Translation, Rating, Feedback, Message, Admin, Payment };
