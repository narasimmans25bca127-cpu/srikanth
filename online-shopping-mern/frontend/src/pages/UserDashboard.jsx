import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiBox,
  FiEdit2,
  FiMapPin,
  FiPackage,
  FiShoppingBag,
  FiTruck,
  FiUser,
} from 'react-icons/fi';
import api, { getError } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatPrice } from '../utils/format';
import Loader from '../components/Loader';

export default function UserDashboard() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone || '',
    address: user.address || '',
    password: '',
  });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get('/orders/myorders')
      .then((res) => {
        if (active) setOrders(res.data);
      })
      .catch((err) => {
        if (active) setOrdersError(getError(err));
      })
      .finally(() => {
        if (active) setOrdersLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);
    try {
      const payload = { name: form.name, phone: form.phone, address: form.address };
      if (form.password) payload.password = form.password;
      const { data } = await api.put('/users/profile', payload);
      updateUser(data);
      setForm({ ...form, password: '' });
      setMessage('Profile updated');
    } catch (err) {
      setError(getError(err));
    } finally {
      setSaving(false);
    }
  };

  const spent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const pending = orders.filter((order) => order.status !== 'Delivered').length;
  const firstName = user.name.split(' ')[0];
  const initials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="container page dashboard-page">
      <header className="dashboard-welcome">
        <div>
          <span className="section-eyebrow">Your ShopEase account</span>
          <h1>Welcome back, {firstName}</h1>
          <p>Manage your profile, keep an eye on your orders, and get back to browsing.</p>
        </div>
        <div className="dashboard-user-chip">
          <span className="dashboard-avatar">{initials}</span>
          <span>
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </span>
        </div>
      </header>

      <section className="stat-grid dashboard-stats" aria-label="Account overview">
        <article className="stat-card dashboard-stat-card">
          <span className="dashboard-stat-icon"><FiPackage /></span>
          <span>Orders placed</span>
          <strong>{ordersLoading || ordersError ? '—' : orders.length}</strong>
        </article>
        <article className="stat-card dashboard-stat-card">
          <span className="dashboard-stat-icon"><FiTruck /></span>
          <span>Orders on the way</span>
          <strong>{ordersLoading || ordersError ? '—' : pending}</strong>
        </article>
        <article className="stat-card dashboard-stat-card">
          <span className="dashboard-stat-icon"><FiShoppingBag /></span>
          <span>Total spent</span>
          <strong>{ordersLoading || ordersError ? '—' : formatPrice(spent)}</strong>
        </article>
      </section>

      {ordersError && <div className="alert alert-warning" role="status">{ordersError}</div>}

      <div className="dashboard-layout">
        <div className="dashboard-main">
          <section className="form-card dashboard-profile-card" id="profile">
            <div className="dashboard-card-heading">
              <span className="dashboard-card-icon"><FiUser /></span>
              <div>
                <h2>Profile information</h2>
                <p>Keep your account and delivery details up to date.</p>
              </div>
            </div>

            <form onSubmit={save}>
              {message && <div className="alert alert-success" role="status">{message}</div>}
              {error && <div className="alert alert-danger" role="alert">{error}</div>}

              <div className="dashboard-form-grid">
                <div className="dashboard-form-field dashboard-field-wide">
                  <label className="form-label" htmlFor="account-email">Email address</label>
                  <input className="form-control" id="account-email" type="email" value={user.email} disabled />
                  <span className="dashboard-field-hint">Your email address cannot be changed here.</span>
                </div>

                <div className="dashboard-form-field">
                  <label className="form-label" htmlFor="account-name">Full name</label>
                  <input
                    className="form-control"
                    id="account-name"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={change}
                    minLength={2}
                    required
                  />
                </div>

                <div className="dashboard-form-field">
                  <label className="form-label" htmlFor="account-phone">Phone</label>
                  <input
                    className="form-control"
                    id="account-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={change}
                  />
                </div>

                <div className="dashboard-form-field dashboard-field-wide">
                  <label className="form-label" htmlFor="account-address">Delivery address</label>
                  <textarea
                    className="form-control"
                    id="account-address"
                    rows="3"
                    name="address"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={change}
                  />
                </div>

                <div className="dashboard-form-field dashboard-field-wide">
                  <label className="form-label" htmlFor="account-password">New password</label>
                  <input
                    className="form-control"
                    id="account-password"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={change}
                    minLength={6}
                    placeholder="Leave blank to keep your current password"
                  />
                  <span className="dashboard-field-hint">If changing it, use at least 6 characters.</span>
                </div>
              </div>

              <button className="btn btn-brand dashboard-save" disabled={saving}>
                {saving ? (
                  <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> Saving...</>
                ) : (
                  <>Save profile <FiArrowRight /></>
                )}
              </button>
            </form>
          </section>

          <section className="form-card dashboard-recent-card">
            <div className="dashboard-card-heading dashboard-recent-heading">
              <span className="dashboard-card-icon"><FiBox /></span>
              <div>
                <h2>Recent orders</h2>
                <p>Your latest purchases at a glance.</p>
              </div>
              <Link to="/my-orders" className="dashboard-view-all">View all <FiArrowRight /></Link>
            </div>

            {ordersLoading ? (
              <Loader text="Loading your orders..." />
            ) : ordersError ? (
              <p className="dashboard-inline-error">Your order history is temporarily unavailable.</p>
            ) : recentOrders.length === 0 ? (
              <div className="dashboard-no-orders">
                <p>You haven’t placed an order yet.</p>
                <Link to="/products">Explore the shop <FiArrowRight /></Link>
              </div>
            ) : (
              <div className="dashboard-recent-orders">
                {recentOrders.map((order) => (
                  <div className="dashboard-recent-order" key={order._id}>
                    <span className="dashboard-recent-order-icon"><FiPackage /></span>
                    <span className="dashboard-recent-order-info">
                      <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
                      <small>{formatDate(order.createdAt)}</small>
                    </span>
                    <span className={`badge-status status-${order.status.toLowerCase()}`}>{order.status}</span>
                    <strong className="dashboard-recent-order-total">{formatPrice(order.totalPrice)}</strong>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="dashboard-navigation">
          <section className="form-card dashboard-nav-card">
            <div className="dashboard-card-heading">
              <span className="dashboard-card-icon"><FiMapPin /></span>
              <div>
                <h2>Account navigation</h2>
                <p>Pick up where you left off.</p>
              </div>
            </div>
            <nav className="dashboard-nav-links" aria-label="Account navigation">
              <a href="#profile"><FiUser /><span>Edit profile</span><FiArrowRight /></a>
              <Link to="/my-orders"><FiPackage /><span>My orders</span><FiArrowRight /></Link>
              <Link to="/cart"><FiShoppingBag /><span>Shopping cart</span><FiArrowRight /></Link>
              <Link to="/products"><FiBox /><span>Browse products</span><FiArrowRight /></Link>
            </nav>
          </section>
        </aside>
      </div>
    </div>
  );
}
