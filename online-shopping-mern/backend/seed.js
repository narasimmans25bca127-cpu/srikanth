// Run with: npm run seed
// RESETS the database: clears users, products and orders, then adds fresh sample data.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const { products, defaultUsers } = require('./data/seedData');

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing in backend/.env');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
    console.log('Connected to MongoDB');

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // create() runs the password-hashing hook (insertMany would skip it)
    for (const u of defaultUsers) await User.create(u);
    await Product.insertMany(products);

    console.log('Seed complete.');
    console.log('User login:   user@shop.com  / User@123');
    console.log('User login:   priya@shop.com / Priya@123');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
