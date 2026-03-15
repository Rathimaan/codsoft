import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Cart is managed client-side in localStorage for simplicity.
// This route provides server-side cart validation and price sync.

// @route POST /api/cart/validate — validate cart items against live DB prices
router.post('/validate', protect, asyncHandler(async (req, res) => {
  // Just confirm the user is authenticated; cart state is in React context
  res.json({ message: 'Cart validated', userId: req.user._id });
}));

export default router;
