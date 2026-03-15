import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      return toast.error('Passwords do not match');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', {
        name: form.name, email: form.email, password: form.password,
      });
      login(data);
      toast.success(`Welcome to ShopVibe, ${data.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div className="glass" style={{ borderRadius:'1.5rem', padding:'2.5rem', width:'100%', maxWidth:'420px' }}>
        <h1 style={{ fontSize:'1.8rem', fontWeight:900, marginBottom:'0.4rem' }}>
          Create <span className="gradient-text">Account</span>
        </h1>
        <p style={{ color:'var(--text-muted)', marginBottom:'2rem', fontSize:'0.9rem' }}>Join ShopVibe for free</p>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {[
            { key:'name', label:'FULL NAME', icon:<FiUser size={16}/>, type:'text', placeholder:'John Doe' },
            { key:'email', label:'EMAIL', icon:<FiMail size={16}/>, type:'email', placeholder:'you@example.com' },
            { key:'password', label:'PASSWORD', icon:<FiLock size={16}/>, type:'password', placeholder:'Min. 6 characters' },
            { key:'confirm', label:'CONFIRM PASSWORD', icon:<FiLock size={16}/>, type:'password', placeholder:'Repeat password' },
          ].map((f) => (
            <div key={f.key}>
              <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>{f.label}</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:'0.8rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}>{f.icon}</span>
                <input className="input-field" type={f.type} value={form[f.key]}
                  onChange={(e) => setForm({...form, [f.key]: e.target.value})}
                  placeholder={f.placeholder} required style={{ paddingLeft:'2.4rem' }} />
              </div>
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary"
            style={{ justifyContent:'center', padding:'0.75rem', marginTop:'0.5rem', fontSize:'1rem' }}>
            <FiUserPlus /> {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.5rem', color:'var(--text-muted)', fontSize:'0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'var(--brand-secondary)', fontWeight:600, textDecoration:'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
