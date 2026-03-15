import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiPackage, FiClock, FiCheck, FiTruck, FiX } from 'react-icons/fi';

const STATUS_STYLES = {
  pending:    { color: 'var(--status-warning)', icon: <FiClock size={14} /> },
  processing: { color: 'var(--brand-primary)', icon: <FiPackage size={14} /> },
  shipped:    { color: 'var(--status-info)', icon: <FiTruck size={14} /> },
  delivered:  { color: 'var(--status-success)', icon: <FiCheck size={14} /> },
  cancelled:  { color: 'var(--status-danger)', icon: <FiX size={14} /> },
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = user?.isAdmin ? '/api/orders' : '/api/orders/myorders';
    api.get(endpoint)
      .then((res) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      toast.success('Order status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh', color:'var(--text-muted)' }}>
      Loading orders...
    </div>
  );

  if (orders.length === 0) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:'1rem', color:'var(--text-muted)' }}>
      <FiPackage size={60} style={{ opacity:0.3 }} />
      <h2 style={{ color:'var(--text-primary)', fontSize:'1.5rem' }}>No orders yet</h2>
      <p>Your orders will appear here after checkout.</p>
      <Link to="/products" className="btn-primary">Start Shopping</Link>
    </div>
  );

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto', padding:'2rem 1.5rem' }}>
      <h1 style={{ fontSize:'2rem', fontWeight:900, marginBottom:'2rem' }}>
        My <span className="gradient-text">Orders</span>
      </h1>

      <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
        {orders.map((order) => {
          const status = order.status || 'pending';
          const { color, icon } = STATUS_STYLES[status] || STATUS_STYLES.pending;
          return (
            <div key={order._id} className="glass" style={{ borderRadius:'1rem', padding:'1.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:'1rem', flexWrap:'wrap', gap:'0.5rem' }}>
                <div>
                  <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:'0.2rem' }}>Order ID</p>
                  <code style={{ fontSize:'0.8rem', color:'var(--brand-secondary)' }}>{order._id}</code>
                </div>
                <div style={{ textAlign:'right' }}>
                  {user?.isAdmin ? (
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{
                        background: `${color}20`, color, border: `1px solid ${color}40`,
                        borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.8rem', fontWeight: 600,
                        outline: 'none', cursor: 'pointer', appearance: 'menulist'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span style={{
                      display:'inline-flex', alignItems:'center', gap:'0.3rem',
                      background:`${color}20`, color, border:`1px solid ${color}40`,
                      borderRadius:'999px', padding:'0.3rem 0.8rem', fontSize:'0.8rem', fontWeight:600,
                    }}>
                      {icon} {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  )}
                  <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.3rem' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div style={{ display:'flex', gap:'0.8rem', flexWrap:'wrap', marginBottom:'1rem' }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <img src={item.image} alt={item.name} style={{ width:'40px', height:'40px', objectFit:'cover', borderRadius:'0.4rem', background:'var(--bg-tertiary)' }} />
                    <span style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{item.name} × {item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>
                  📍 {order.shippingAddress?.city}, {order.shippingAddress?.country}
                </div>
                <div style={{ fontWeight:900, fontSize:'1.1rem', color:'var(--brand-secondary)' }}>
                  ${order.totalPrice?.toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
