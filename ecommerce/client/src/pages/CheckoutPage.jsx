import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { FiCreditCard, FiMapPin, FiCheck } from 'react-icons/fi';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CARD_STYLE = {
  style: {
    base: {
      color: 'var(--text-primary)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '15px',
      '::placeholder': { color: 'var(--text-muted)' },
      iconColor: 'var(--brand-primary)',
    },
    invalid: { color: 'var(--status-danger)' },
  },
};

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ street:'', city:'', state:'', zipCode:'', country:'India' });
  const navigate = useNavigate();

  const shipping = cartTotal > 100 ? 0 : 10;
  const tax = cartTotal * 0.15;
  const total = cartTotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const { street, city, state, zipCode, country } = address;
    if (!street || !city || !state || !zipCode) {
      return toast.error('Please fill all address fields');
    }
    setLoading(true);
    try {
      // 1. Create payment intent on backend
      const { data: { clientSecret } } = await api.post('/api/payment/create-payment-intent', { amount: total });

      // 2. Confirm card payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { 
            address: { 
              line1: street, 
              city, 
              state, 
              postal_code: zipCode, 
              country: country === 'India' ? 'IN' : country 
            } 
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      // 3. Create order in DB
      const orderData = {
        items: cartItems.map((i) => ({ product: i._id, name: i.name, image: i.image, price: i.price, quantity: i.qty })),
        shippingAddress: address,
      };
      const { data: order } = await api.post('/api/orders', orderData);

      // 4. Mark order as paid
      await api.put(`/api/orders/${order._id}/pay`, {
        id: result.paymentIntent.id,
        status: result.paymentIntent.status,
      });

      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth:'900px', margin:'0 auto', padding:'2rem 1.5rem' }}>
      <h1 style={{ fontSize:'2rem', fontWeight:900, marginBottom:'2rem' }}>
        <span className="gradient-text">Checkout</span>
      </h1>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'2rem', alignItems:'start' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
          {/* Shipping */}
          <div className="glass" style={{ borderRadius:'1rem', padding:'1.5rem' }}>
            <h3 style={{ fontWeight:800, marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <FiMapPin style={{ color:'var(--brand-primary)' }} /> Shipping Address
            </h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem' }}>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ fontSize:'0.78rem', color:'var(--text-secondary)', fontWeight:600, display:'block', marginBottom:'0.3rem' }}>STREET</label>
                <input className="input-field" value={address.street}
                  onChange={(e) => setAddress({...address, street:e.target.value})}
                  placeholder="123 Main St" required />
              </div>
              {[
                { key:'city', label:'CITY', placeholder:'Mumbai' },
                { key:'state', label:'STATE', placeholder:'Maharashtra' },
                { key:'zipCode', label:'ZIP CODE', placeholder:'400001' },
                { key:'country', label:'COUNTRY', placeholder:'India' },
              ].map((f) => (
                <div key={f.key}>
                  <label style={{ fontSize:'0.78rem', color:'var(--text-secondary)', fontWeight:600, display:'block', marginBottom:'0.3rem' }}>{f.label}</label>
                  <input className="input-field" value={address[f.key]}
                    onChange={(e) => setAddress({...address, [f.key]:e.target.value})}
                    placeholder={f.placeholder} required />
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="glass" style={{ borderRadius:'1rem', padding:'1.5rem' }}>
            <h3 style={{ fontWeight:800, marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <FiCreditCard style={{ color:'var(--brand-primary)' }} /> Payment Details
            </h3>
            <p style={{ color:'var(--text-muted)', fontSize:'0.8rem', marginBottom:'1rem' }}>
              🧪 Test card: <code style={{ background:'rgba(255,255,255,0.06)', padding:'0.1rem 0.4rem', borderRadius:'4px', color:'var(--brand-secondary)' }}>4242 4242 4242 4242</code> · Any future date · Any 3-digit CVC
            </p>
            <div style={{ background:'var(--glass-bg)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'0.5rem', padding:'0.75rem 1rem' }}>
              <CardElement options={{ ...CARD_STYLE, hidePostalCode: true, disableLink: true }} />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="glass" style={{ borderRadius:'1rem', padding:'1.5rem', position:'sticky', top:'80px' }}>
          <h3 style={{ fontWeight:800, marginBottom:'1rem' }}>Order Summary</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem', fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'1rem' }}>
            {cartItems.map((i) => (
              <div key={i._id} style={{ display:'flex', justifyContent:'space-between' }}>
                <span>{i.name} × {i.qty}</span>
                <span style={{ color:'var(--text-primary)' }}>${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:'0.6rem', display:'flex', justifyContent:'space-between' }}>
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? 'var(--status-success)' : 'var(--text-primary)' }}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span>Tax (15%)</span>
              <span style={{ color:'var(--text-primary)' }}>${tax.toFixed(2)}</span>
            </div>
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'0.6rem', display:'flex', justifyContent:'space-between', fontWeight:900, fontSize:'1.1rem', color:'var(--text-primary)' }}>
              <span>Total</span>
              <span className="gradient-text">${total.toFixed(2)}</span>
            </div>
          </div>
          <button type="submit" disabled={!stripe || loading} className="btn-primary"
            style={{ width:'100%', justifyContent:'center', padding:'0.8rem', fontSize:'1rem' }}>
            <FiCheck /> {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </button>
          <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', textAlign:'center', marginTop:'0.7rem' }}>
            🔒 Secured by Stripe
          </p>
        </div>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
