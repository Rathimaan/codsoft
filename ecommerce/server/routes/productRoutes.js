import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route GET /api/products  — with search, category, price filter, pagination
router.get('/', asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 8;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.search
    ? { name: { $regex: req.query.search, $options: 'i' } }
    : {};
  const categoryFilter = req.query.category ? { category: req.query.category } : {};
  const minPrice = Number(req.query.minPrice) || 0;
  const maxPrice = Number(req.query.maxPrice) || 999999;
  const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

  const filter = { ...keyword, ...categoryFilter, ...priceFilter };
  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
}));

// @route GET /api/products/featured
router.get('/featured', asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(6);
  res.json(products);
}));

// @route GET /api/products/categories
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
}));

// @route GET /api/products/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
}));

// @route POST /api/products/:id/reviews  (protected)
router.post('/:id/reviews', protect, asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }
  const review = { user: req.user._id, name: req.user.name, rating: Number(rating), comment };
  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ message: 'Review added' });
}));

// @route POST /api/products — admin add product
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
}));

// @route PUT /api/products/:id — admin update
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json(product);
}));

// @route DELETE /api/products/:id — admin delete
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ message: 'Product removed' });
}));

export default router;
