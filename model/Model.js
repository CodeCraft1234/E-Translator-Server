
const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

// Define schema for users
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  
});

// Define schema for blogs
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
 
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
 
});

// Define schema for orders
const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: Number,
 
});

// Define schema for translations
const translationSchema = new mongoose.Schema({
  originalText: String,
  translatedText: String,
  languageFrom: String,
  languageTo: String,
  
});

// Define schema for ratings
const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  translationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Translation'
  },
  rating: Number,
 
});

// Define schema for feedback
const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  translationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Translation'
  },
  feedbackText: String,

});

// Define schema for messages
const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  // Add other fields as needed
});


const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // Add other fields as needed
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

 
});
 // Define schema for history
const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  translationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Translation',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  originalText: {
    type: String,
    required: true
  },
  translatedText: {
    type: String,
    required: true
  },
  languageFrom: {
    type: String,
    required: true
  },
  languageTo: {
    type: String,
    required: true
  },
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
const History = mongoose.model('History', historySchema);


module.exports = { User, Blog, Product, Order, Translation, Rating, Feedback, Message, Admin, Payment, History };
