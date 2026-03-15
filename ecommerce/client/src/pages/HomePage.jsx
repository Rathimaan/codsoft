import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { FiArrowRight, FiShoppingBag, FiShield, FiTruck } from 'react-icons/fi';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/products/featured')
      .then((res) => setFeatured(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 1.5rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.15) 0%, transparent 70%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{
          position:'absolute', width:'400px', height:'400px',
          background:'rgba(108,99,255,0.08)', borderRadius:'50%',
          filter:'blur(80px)', top:'-100px', left:'-100px', pointerEvents:'none',
        }}/>
        <div style={{
          position:'absolute', width:'300px', height:'300px',
          background:'rgba(167,139,250,0.08)', borderRadius:'50%',
          filter:'blur(60px)', bottom:'-50px', right:'-50px', pointerEvents:'none',
        }}/>

        <div style={{ position: 'relative', maxWidth: '700px' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.2rem',
            letterSpacing: '-1px',
          }}>
            Discover Products<br />
            <span className="gradient-text">You'll Love</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Shop thousands of curated products with fast shipping, secure payments, and hassle-free returns.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 1.8rem' }}>
              Shop Now <FiArrowRight />
            </Link>
            <Link to="/register" className="btn-outline" style={{ fontSize: '1rem', padding: '0.75rem 1.8rem' }}>
              Join Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section style={{
        display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap',
        padding: '2rem 1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        {[
          { icon: <FiTruck size={22} />, label: 'Free Shipping over $100' },
          { icon: <FiShield size={22} />, label: 'Secure Payments' },
          { icon: <FiShoppingBag size={22} />, label: 'Easy Returns' },
        ].map((f) => (
          <div key={f.label} style={{ display:'flex', alignItems:'center', gap:'0.6rem', color:'var(--text-secondary)', fontSize:'0.9rem' }}>
            <span style={{ color:'var(--brand-primary)' }}>{f.icon}</span>
            {f.label}
          </div>
        ))}
      </section>

      {/* Featured Products */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Featured <span className="gradient-text">Products</span>
          </h2>
          <Link to="/products" className="btn-outline" style={{ fontSize:'0.85rem', padding:'0.45rem 1rem' }}>
            View All <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'1.5rem' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card" style={{ height:'320px', animation:'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'1.5rem' }}>
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
