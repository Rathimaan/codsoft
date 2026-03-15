import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { FiShoppingCart, FiUser, FiLogOut, FiPackage, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 1.5rem',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'background-color 0.3s ease',
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <FiShoppingCart size={24} style={{ color: 'var(--brand-primary)' }} />
        <span className="gradient-text" style={{ fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.5px' }}>
          ShopVibe
        </span>
      </Link>

      {/* Desktop Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button onClick={toggleTheme} className="btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.9rem', border: 'none' }} aria-label="Toggle Theme">
          {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
        </button>

        <Link to="/products" className="btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.9rem' }}>
          Products
        </Link>

        {/* Cart */}
        <Link to="/cart" style={{ position: 'relative', textDecoration: 'none' }}>
          <div className="btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.9rem' }}>
            <FiShoppingCart size={17} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-6px',
                background: 'var(--brand-primary)', color: 'white',
                borderRadius: '50%', width: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 700,
              }}>{cartCount}</span>
            )}
          </div>
        </Link>

        {user ? (
          <>
            {user.isAdmin && (
              <Link to="/admin/add-product" className="btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.9rem', borderColor:'var(--status-success)', color:'var(--status-success)' }} title="Add Product">
                + New Product
              </Link>
            )}
            <Link to="/orders" className="btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.9rem' }}>
              <FiPackage size={16} />
            </Link>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.9rem', color: 'var(--status-danger)', borderColor: 'var(--status-danger)' }}>
                <FiLogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.9rem' }}>
              Login
            </Link>
            <Link to="/register" className="btn-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.9rem' }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
