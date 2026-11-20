import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBox, FiUsers, FiList, FiTrendingUp } from 'react-icons/fi';
import api, { getError } from '../../api/axios';
import { formatDate, formatPrice } from '../../utils/format';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch((err) => setError(getError(err)));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {error && <div className="alert alert-danger">{error}</div>}
      {!stats && !error && <Loader />}
      {stats && (
        <>
          <div className="stat-grid four">
            <div className="stat-card"><FiBox /><span>Total products</span><strong>{stats.totalProducts}</strong></div>
            <div className="stat-card"><FiUsers /><span>Registered users</span><strong>{stats.totalUsers}</strong></div>
            <div className="stat-card"><FiList /><span>Total orders</span><strong>{stats.totalOrders}</strong></div>
            <div className="stat-card"><FiTrendingUp /><span>Order value</span><strong>{formatPrice(stats.totalRevenue)}</strong></div>
          </div>

          <div className="form-card">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0">Recent orders</h2>
              <Link to="/admin/orders">View all</Link>
            </div>
            {stats.recentOrders.length === 0 ? (
              <p className="empty mt-3">No orders yet.</p>
            ) : (
              <div className="table-wrap">
                <table className="table align-middle">
                  <thead>
                    <tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((o) => (
                      <tr key={o._id}>
                        <td>#{o._id.slice(-8).toUpperCase()}</td>
                        <td>{o.user ? o.user.name : 'Deleted user'}</td>
                        <td>{formatDate(o.createdAt)}</td>
                        <td>{formatPrice(o.totalPrice)}</td>
                        <td><span className={`badge-status status-${o.status.toLowerCase()}`}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
