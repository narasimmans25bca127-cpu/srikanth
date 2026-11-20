const mongoose = require('mongoose');

// Connects to MongoDB. Throws an error (instead of killing the process) so that
// server.js can show a clear, friendly message.
const connectDB = async () => {
  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 8000, // give up after 8 seconds if MongoDB is not running
  });
  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

module.exports = connectDB;
