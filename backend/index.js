import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import customerRoutes from './routes/customer.route.js';
import productRoutes from './routes/product.route.js';
import wishlistRoutes from './routes/wishlist.route.js';
import cartRoutes from './routes/cart.route.js';
import orderRoutes from './routes/order.route.js';

const app = express();
const PORT = process.env.PORT || 8085;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use('/users', customerRoutes);
app.use('/products', productRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ShopKart API is running',
  });
});

app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'CORS policy does not allow this origin.' });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

const startServer = async () => {
  if (!process.env.dbUrl) {
    console.error('Missing MongoDB connection string: dbUrl');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.dbUrl, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server started successfully on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
