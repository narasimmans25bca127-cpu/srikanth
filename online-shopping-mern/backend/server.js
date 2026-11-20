const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Always read backend/.env, even if the server is started from another folder
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const connectDB = require('./config/database');
const autoSeed = require('./utils/autoSeed');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('Missing MONGO_URI or JWT_SECRET. Create backend/.env from backend/.env.example');
  process.exit(1);
}

const app = express();

// Allow the React app. In development, any localhost port is accepted
// (Vite moves to 5174, 5175... when 5173 is busy).
const allowedOrigin = (origin, callback) => {
  if (!origin) return callback(null, true); // Postman, curl, same-origin
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  if (origin === clientUrl || (process.env.NODE_ENV !== 'production' && isLocal)) {
    return callback(null, true);
  }
  return callback(new Error(`CORS blocked for ${origin}`));
};
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'ShopEase API is running' }));
app.get('/api/health', (req, res) =>
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    await autoSeed();
  } catch (error) {
    console.error('\nCould not connect to MongoDB: ' + error.message);
    console.error('Fix: 1) make sure MongoDB is running (local) or your Atlas details are right,');
    console.error('     2) check MONGO_URI in backend/.env, then run "npm run dev" again.\n');
    process.exit(1);
  }

  const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Close the other program or change PORT in backend/.env`);
    } else {
      console.error(err.message);
    }
    process.exit(1);
  });
};

start();
