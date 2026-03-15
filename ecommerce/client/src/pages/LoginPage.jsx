import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', form);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div className="glass" style={{ borderRadius:'1.5rem', padding:'2.5rem', width:'100%', maxWidth:'420px' }}>
        <h1 style={{ fontSize:'1.8rem', fontWeight:900, marginBottom:'0.4rem' }}>
          Welcome <span className="gradient-text">Back</span>
        </h1>
        <p style={{ color:'var(--text-muted)', marginBottom:'2rem', fontSize:'0.9rem' }}>Sign in to your ShopVibe account</p>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div>
            <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>EMAIL</label>
            <div style={{ position:'relative' }}>
              <FiMail style={{ position:'absolute', left:'0.8rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} size={16} />
              <input className="input-field" type="email" value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                placeholder="you@example.com" required
                style={{ paddingLeft:'2.4rem' }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>PASSWORD</label>
            <div style={{ position:'relative' }}>
              <FiLock style={{ position:'absolute', left:'0.8rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} size={16} />
              <input className="input-field" type="password" value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                placeholder="••••••••" required
                style={{ paddingLeft:'2.4rem' }} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary"
            style={{ justifyContent:'center', padding:'0.75rem', marginTop:'0.5rem', fontSize:'1rem' }}>
            <FiLogIn /> {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.5rem', color:'var(--text-muted)', fontSize:'0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color:'var(--brand-secondary)', fontWeight:600, textDecoration:'none' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
