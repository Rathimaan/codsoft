import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiStar, FiArrowLeft, FiPackage } from 'react-icons/fi';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh', color:'var(--text-muted)' }}>
      Loading product...
    </div>
  );

  if (!product) return (
    <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>
      <p>Product not found.</p>
      <button onClick={() => navigate('/products')} className="btn-primary" style={{ marginTop:'1rem' }}>Back to Products</button>
    </div>
  );

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2rem 1.5rem' }}>
      <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'1.5rem', fontSize:'0.9rem' }}>
        <FiArrowLeft /> Back
      </button>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3rem', alignItems:'start' }}>
        {/* Image */}
        <div style={{ borderRadius:'1rem', overflow:'hidden', background:'var(--bg-tertiary)' }}>
          <img src={product.image} alt={product.name} style={{ width:'100%', aspectRatio:'4/3', objectFit:'cover' }} />
        </div>

        {/* Info */}
        <div>
          <span style={{ color:'var(--brand-secondary)', fontSize:'0.8rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>
            {product.brand} · {product.category}
          </span>
          <h1 style={{ fontSize:'1.9rem', fontWeight:900, lineHeight:1.2, margin:'0.5rem 0 0.8rem' }}>
            {product.name}
          </h1>

          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
            {[1,2,3,4,5].map((s) => (
              <FiStar key={s} size={16} style={{ color: s <= Math.round(product.rating) ? 'var(--status-warning)' : 'var(--text-secondary)', fill: s <= Math.round(product.rating) ? 'var(--status-warning)' : 'none' }} />
            ))}
            <span style={{ color:'var(--text-secondary)', fontSize:'0.85rem' }}>({product.numReviews} reviews)</span>
          </div>

          <div style={{ fontSize:'2.2rem', fontWeight:900, color:'var(--brand-secondary)', marginBottom:'1.2rem' }}>
            ${product.price?.toFixed(2)}
          </div>

          <p style={{ color:'var(--text-secondary)', lineHeight:1.7, marginBottom:'1.5rem' }}>{product.description}</p>

          <div className="glass" style={{ padding:'1rem', borderRadius:'0.75rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.9rem' }}>
            <FiPackage style={{ color: product.countInStock > 0 ? 'var(--status-success)' : 'var(--status-danger)' }} />
            <span style={{ color: product.countInStock > 0 ? 'var(--status-success)' : 'var(--status-danger)', fontWeight:600 }}>
              {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}
            </span>
          </div>

          {product.countInStock > 0 && (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.2rem' }}>
                <label style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>Qty:</label>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))}
                    style={{ background:'var(--glass-border)', border:'none', color:'white', width:'32px', height:'32px', borderRadius:'0.4rem', cursor:'pointer', fontSize:'1.1rem' }}>−</button>
                  <span style={{ minWidth:'2rem', textAlign:'center', fontWeight:700 }}>{qty}</span>
                  <button onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                    style={{ background:'var(--glass-border)', border:'none', color:'white', width:'32px', height:'32px', borderRadius:'0.4rem', cursor:'pointer', fontSize:'1.1rem' }}>+</button>
                </div>
              </div>
              <button
                onClick={() => { 
                  addToCart(product, qty); 
                  // toast is handled in CartContext's addToCart function
                  navigate('/cart'); 
                }}
                className="btn-primary"
                style={{ fontSize:'1rem', padding:'0.8rem 2rem', width:'100%', justifyContent:'center' }}
              >
                <FiShoppingCart /> Add to Cart
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
