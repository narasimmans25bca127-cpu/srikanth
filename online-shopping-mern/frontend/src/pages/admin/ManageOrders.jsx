import { useEffect, useState } from 'react';
import api, { getError } from '../../api/axios';
import { formatDate, formatPrice, ORDER_STATUSES } from '../../utils/format';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api
      .get('/admin/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => setError(getError(err)))
      .finally(() => setLoading(false));
  }, []);

  const changeStatus = async (order, status) => {
    setError('');
    setMessage('');
    try {
      const { data } = await api.put(`/admin/orders/${order._id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === data._id ? data : o)));
      setMessage(`Order #${order._id.slice(-8).toUpperCase()} is now ${status}`);
    } catch (err) {
      setError(getError(err));
    }
  };

  return (
    <AdminLayout title="Manage orders">
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <p className="empty">No orders have been placed yet.</p>
      ) : (
        <div className="form-card table-wrap">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Order</th><th>Customer</th><th>Items</th><th>Delivery address</th>
                <th>Total</th><th>Date</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>#{o._id.slice(-8).toUpperCase()}</td>
                  <td>
                    {o.user ? o.user.name : 'Deleted user'}
                    <span className="muted d-block">{o.shippingAddress.phone}</span>
                  </td>
                  <td>
                    {o.items.map((i) => (
                      <span className="d-block" key={i.product}>{i.name} &times; {i.quantity}</span>
                    ))}
                  </td>
                  <td>{o.shippingAddress.address}, {o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.postalCode}</td>
                  <td>{formatPrice(o.totalPrice)}</td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td>
                    <select
                      className={`form-select form-select-sm status-select status-${o.status.toLowerCase()}`}
                      value={o.status}
                      onChange={(e) => changeStatus(o, e.target.value)}
                      aria-label={`Status for order ${o._id}`}
                    >
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
