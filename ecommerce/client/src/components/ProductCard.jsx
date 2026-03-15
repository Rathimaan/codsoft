import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiStar } from 'react-icons/fi';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
        <div style={{ height: '200px', overflow: 'hidden', background: 'var(--bg-tertiary)' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          />
        </div>
      </Link>

      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span style={{
          fontSize: '0.7rem', color: 'var(--brand-secondary)', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem'
        }}>
          {product.category}
        </span>
        <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3, marginBottom: '0.5rem' }}>
            {product.name}
          </h3>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.8rem' }}>
          <FiStar size={13} style={{ color: 'var(--status-warning)', fill: 'var(--status-warning)' }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{product.rating?.toFixed(1)} ({product.numReviews})</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-secondary)' }}>
            ${product.price?.toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(product)}
            disabled={product.countInStock === 0}
            className="btn-primary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
          >
            <FiShoppingCart size={14} />
            {product.countInStock === 0 ? 'Out of Stock' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
