import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiArrowRight, FiShoppingBag } from 'react-icons/fi';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();
  const navigate = useNavigate();

  const shipping = cartTotal > 100 ? 0 : (cartTotal > 0 ? 10 : 0);
  const tax = cartTotal * 0.15;
  const total = cartTotal + shipping + tax;

  if (cartItems.length === 0) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:'1rem', color:'var(--text-muted)' }}>
      <FiShoppingBag size={60} style={{ opacity:0.3 }} />
      <h2 style={{ color:'var(--text-primary)', fontSize:'1.5rem' }}>Your cart is empty</h2>
      <p>Add some products to get started!</p>
      <Link to="/products" className="btn-primary">Browse Products</Link>
    </div>
  );

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2rem 1.5rem' }}>
      <h1 style={{ fontSize:'2rem', fontWeight:900, marginBottom:'2rem' }}>
        Shopping <span className="gradient-text">Cart</span>
      </h1>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'2rem', alignItems:'start' }}>
        {/* Items */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {cartItems.map((item) => (
            <div key={item._id} className="glass" style={{ borderRadius:'1rem', padding:'1rem', display:'flex', gap:'1rem', alignItems:'center' }}>
              <img src={item.image} alt={item.name} style={{ width:'80px', height:'80px', objectFit:'cover', borderRadius:'0.5rem', background:'var(--bg-tertiary)' }} />
              <div style={{ flex:1 }}>
                <Link to={`/products/${item._id}`} style={{ textDecoration:'none', color:'var(--text-primary)', fontWeight:700, fontSize:'0.95rem' }}>
                  {item.name}
                </Link>
                <p style={{ color:'var(--text-secondary)', fontSize:'0.8rem', marginTop:'0.2rem' }}>{item.category}</p>
                <p style={{ color:'var(--brand-secondary)', fontWeight:800, marginTop:'0.3rem' }}>${item.price?.toFixed(2)}</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <button onClick={() => updateQty(item._id, item.qty - 1)}
                  style={{ background:'var(--glass-border)', border:'none', color:'white', width:'28px', height:'28px', borderRadius:'0.4rem', cursor:'pointer' }}>−</button>
                <span style={{ minWidth:'1.5rem', textAlign:'center', fontWeight:700 }}>{item.qty}</span>
                <button onClick={() => updateQty(item._id, item.qty + 1)}
                  style={{ background:'var(--glass-border)', border:'none', color:'white', width:'28px', height:'28px', borderRadius:'0.4rem', cursor:'pointer' }}>+</button>
              </div>
              <span style={{ fontWeight:800, color:'var(--text-primary)', minWidth:'60px', textAlign:'right' }}>
                ${(item.price * item.qty).toFixed(2)}
              </span>
              <button onClick={() => removeFromCart(item._id)}
                style={{ background:'none', border:'none', color:'var(--status-danger)', cursor:'pointer', padding:'0.3rem' }}>
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="glass" style={{ borderRadius:'1rem', padding:'1.5rem', position:'sticky', top:'80px' }}>
          <h3 style={{ fontWeight:800, marginBottom:'1.2rem', fontSize:'1.1rem' }}>Order Summary</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.7rem', fontSize:'0.9rem', color:'var(--text-secondary)' }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span>Subtotal</span>
              <span style={{ color:'var(--text-primary)' }}>${cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? 'var(--status-success)' : 'var(--text-primary)' }}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span>Tax (15%)</span>
              <span style={{ color:'var(--text-primary)' }}>${tax.toFixed(2)}</span>
            </div>
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'0.7rem', display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:'1.1rem', color:'var(--text-primary)' }}>
              <span>Total</span>
              <span className="gradient-text">${total.toFixed(2)}</span>
            </div>
          </div>
          {shipping > 0 && (
            <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.8rem' }}>
              Add ${(100 - cartTotal).toFixed(2)} more for free shipping!
            </p>
          )}
          <button
            onClick={() => navigate('/checkout')}
            className="btn-primary"
            style={{ width:'100%', justifyContent:'center', marginTop:'1.2rem', padding:'0.8rem' }}
          >
            Proceed to Checkout <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
