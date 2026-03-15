import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route POST /api/orders
router.post('/', protect, asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;
  if (!items || items.length === 0) {
    res.status(400); throw new Error('No order items');
  }
  // Calculate prices from DB (don't trust client prices)
  let itemsPrice = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) { res.status(404); throw new Error(`Product not found: ${item.product}`); }
    itemsPrice += product.price * item.quantity;
    // Deduct stock
    product.countInStock -= item.quantity;
    await product.save();
  }
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = 0.15 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user._id,
    items: items.map((i) => ({ ...i, price: i.price })),
    shippingAddress,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });
  res.status(201).json(order);
}));

// @route GET /api/orders/myorders
router.get('/myorders', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
}));

// @route GET /api/orders/:id
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  // Only owner or admin can view
  if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403); throw new Error('Not authorized');
  }
  res.json(order);
}));

// @route PUT /api/orders/:id/pay
router.put('/:id/pay', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = req.body;
  order.status = 'processing';
  const updated = await order.save();
  res.json(updated);
}));

// @route PUT /api/orders/:id/status
router.put('/:id/status', protect, admin, asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  
  order.status = status;
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  const updated = await order.save();
  res.json(updated);
}));

// @route GET /api/orders — admin all orders
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
}));

export default router;
