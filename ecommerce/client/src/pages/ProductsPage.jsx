import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const PRICE_MAX = 500;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [displayMaxPrice, setDisplayMaxPrice] = useState(PRICE_MAX);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = async () => {
    const res = await api.get('/api/products/categories');
    setCategories(res.data);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, pageSize: 8, minPrice, maxPrice };
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      const res = await api.get('/api/products', { params });
      setProducts(res.data.products);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory, minPrice, maxPrice]);

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { setPage(1); }, [search, selectedCategory, minPrice, maxPrice]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const clearFilters = () => {
    setSearch(''); setSelectedCategory(''); setMinPrice(0); setMaxPrice(PRICE_MAX); setDisplayMaxPrice(PRICE_MAX);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display:'flex', gap:'2rem' }}>
      {/* Filter Sidebar */}
      <aside style={{ width: '220px', flexShrink: 0 }}>
        <div className="glass" style={{ borderRadius:'1rem', padding:'1.5rem', position:'sticky', top:'80px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
            <span style={{ fontWeight:700, display:'flex', alignItems:'center', gap:'0.4rem' }}>
              <FiFilter size={16} style={{ color:'var(--brand-primary)' }} /> Filters
            </span>
            <button onClick={clearFilters} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'0.8rem', display:'flex', alignItems:'center', gap:'0.2rem' }}>
              <FiX size={14} /> Clear
            </button>
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)', fontWeight:600, display:'block', marginBottom:'0.5rem' }}>CATEGORY</label>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
              {['', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    background: selectedCategory === cat ? 'var(--brand-alpha)' : 'transparent',
                    border: `1px solid ${selectedCategory === cat ? 'var(--brand-primary)' : 'transparent'}`,
                    color: selectedCategory === cat ? 'var(--brand-secondary)' : 'var(--text-secondary)',
                    borderRadius:'0.4rem', padding:'0.4rem 0.8rem',
                    cursor:'pointer', textAlign:'left', fontSize:'0.85rem', transition:'all 0.15s',
                  }}
                >
                  {cat || 'All Categories'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.5rem' }}>
              <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)', fontWeight:600 }}>MAX PRICE</label>
              <span className="gradient-text" style={{ fontWeight: 800 }}>${displayMaxPrice}</span>
            </div>
            <input type="range" min={0} max={PRICE_MAX} value={displayMaxPrice}
               onChange={(e) => setDisplayMaxPrice(Number(e.target.value))}
               onMouseUp={(e) => setMaxPrice(Number(e.target.value))}
               onTouchEnd={(e) => setMaxPrice(Number(e.target.value))}
               style={{ width:'100%', accentColor:'var(--brand-primary)' }}
            />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'0.3rem' }}>
               <span>$0</span>
               <span>${PRICE_MAX}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {/* Search bar */}
        <div style={{ position:'relative', marginBottom:'2rem' }}>
          <FiSearch style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
          <input
            className="input-field"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft:'2.5rem', fontSize:'0.95rem', borderRadius:'0.75rem' }}
          />
        </div>

        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'1.5rem' }}>
            {[...Array(8)].map((_, i) => <div key={i} className="card" style={{ height:'300px', opacity:0.6 }} />)}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>
            <p style={{ fontSize:'3rem' }}>🔍</p>
            <p>No products found. Try different filters.</p>
          </div>
        ) : (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'1.5rem' }}>
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display:'flex', gap:'0.5rem', justifyContent:'center', marginTop:'2.5rem' }}>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={page === i + 1 ? 'btn-primary' : 'btn-outline'}
                    style={{ padding:'0.4rem 0.9rem', fontSize:'0.85rem' }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
