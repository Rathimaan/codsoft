import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { FiUpload, FiPackage } from 'react-icons/fi';

export default function AdminAddProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: 0,
    countInStock: 0,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', // default placeholder
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category || !formData.brand) {
      return toast.error('Please fill all required fields');
    }
    
    setLoading(true);
    try {
      const { data } = await api.post('/api/products', formData);
      toast.success('Product created successfully!');
      navigate(`/products/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'countInStock' ? Number(value) : value,
    }));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <FiPackage className="gradient-text" /> 
        <span>Add New <span className="gradient-text">Product</span></span>
      </h1>

      <form onSubmit={handleSubmit} className="glass" style={{ borderRadius: '1rem', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>PRODUCT NAME <span style={{color:'var(--status-danger)'}}>*</span></label>
            <input name="name" className="input-field" value={formData.name} onChange={handleChange} placeholder="e.g. Wireless Headphones" required />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>BRAND <span style={{color:'var(--status-danger)'}}>*</span></label>
            <input name="brand" className="input-field" value={formData.brand} onChange={handleChange} placeholder="e.g. Sony" required />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>CATEGORY <span style={{color:'var(--status-danger)'}}>*</span></label>
            <input name="category" className="input-field" value={formData.category} onChange={handleChange} placeholder="e.g. Electronics" required />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>PRICE ($) <span style={{color:'var(--status-danger)'}}>*</span></label>
            <input type="number" step="0.01" min="0" name="price" className="input-field" value={formData.price} onChange={handleChange} required />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>STOCK QUANTITY <span style={{color:'var(--status-danger)'}}>*</span></label>
            <input type="number" min="0" name="countInStock" className="input-field" value={formData.countInStock} onChange={handleChange} required />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>IMAGE URL <span style={{color:'var(--status-danger)'}}>*</span></label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input name="image" className="input-field" value={formData.image} onChange={handleChange} placeholder="https://images.unsplash.com/..." required style={{ flex: 1 }} />
            {formData.image && (
              <img src={formData.image} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '0.4rem', border: '1px solid var(--border-color)' }} />
            )}
          </div>
        </div>

        <div>
           <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>DESCRIPTION</label>
           <textarea name="description" className="input-field" value={formData.description} onChange={handleChange} placeholder="Detailed product description..." rows="4" style={{ resize: 'vertical' }}></textarea>
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center', padding: '0.8rem', fontSize: '1rem' }}>
          <FiUpload /> {loading ? 'Creating...' : 'Publish Product'}
        </button>

      </form>
    </div>
  );
}
