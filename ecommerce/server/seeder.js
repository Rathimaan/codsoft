import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();
await connectDB();

const sampleProducts = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium audio experience with 30-hour battery life, active noise cancellation, and ultra-comfortable ear cushions.',
    price: 79.99,
    category: 'Electronics',
    brand: 'SoundWave',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    countInStock: 25,
    rating: 4.5,
    numReviews: 12,
    isFeatured: true,
  },
  {
    name: 'Running Shoes - Men\'s',
    description: 'Lightweight and breathable running shoes with responsive foam cushioning for all-day comfort.',
    price: 59.99,
    category: 'Sports',
    brand: 'SwiftRun',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    countInStock: 40,
    rating: 4.3,
    numReviews: 8,
    isFeatured: true,
  },
  {
    name: 'Minimalist Leather Watch',
    description: 'Elegant Swiss-movement watch with genuine leather strap, sapphire crystal glass, and water-resistant design.',
    price: 149.99,
    category: 'Accessories',
    brand: 'TimeCraft',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    countInStock: 15,
    rating: 4.7,
    numReviews: 20,
    isFeatured: true,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with tactile blue switches, N-key rollover, and aluminum frame.',
    price: 89.99,
    category: 'Electronics',
    brand: 'KeyMaster',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    countInStock: 20,
    rating: 4.6,
    numReviews: 15,
    isFeatured: false,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip, eco-friendly TPE yoga mat with alignment lines, carrying strap, and 6mm thick cushioning.',
    price: 34.99,
    category: 'Sports',
    brand: 'ZenFlex',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
    countInStock: 50,
    rating: 4.4,
    numReviews: 30,
    isFeatured: false,
  },
  {
    name: 'Smart Water Bottle',
    description: 'Insulated stainless steel bottle with LED temperature display, hydration reminder, and 24hr cold retention.',
    price: 29.99,
    category: 'Accessories',
    brand: 'HydroSmart',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    countInStock: 35,
    rating: 4.2,
    numReviews: 18,
    isFeatured: true,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: '360° surround sound with IPX7 waterproof rating, 20-hour playtime, and USB-C fast charging.',
    price: 49.99,
    category: 'Electronics',
    brand: 'SoundWave',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    countInStock: 30,
    rating: 4.5,
    numReviews: 22,
    isFeatured: false,
  },
  {
    name: 'Classic Denim Jacket',
    description: 'Timeless stone-washed denim jacket with button front, chest pockets, and relaxed modern fit.',
    price: 64.99,
    category: 'Clothing',
    brand: 'UrbanEdge',
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500',
    countInStock: 22,
    rating: 4.1,
    numReviews: 9,
    isFeatured: false,
  },
];

try {
  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);
  console.log('✅ Sample products seeded!');
} catch (err) {
  console.error('❌ Seeding failed:', err.message);
} finally {
  await mongoose.disconnect();
  console.log('Database disconnected.');
}
