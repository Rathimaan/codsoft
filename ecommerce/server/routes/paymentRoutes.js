import express from 'express';
import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route POST /api/payment/create-payment-intent
router.post('/create-payment-intent', protect, asyncHandler(async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { amount } = req.body; // amount in cents

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // convert to cents
    currency: 'usd',
    payment_method_types: ['card'],
  });

  res.json({ clientSecret: paymentIntent.client_secret });
}));

// @route GET /api/payment/config
router.get('/config', (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

export default router;
