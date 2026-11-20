import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPackage } from 'react-icons/fi';
import api, { getError } from '../api/axios';
import { formatDate, formatPrice } from '../utils/format';
import OrderTracker from '../components/OrderTracker';
import Loader from '../components/Loader';
import { FALLBACK_IMAGE } from '../components/ProductCard';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders/myorders')
      .then((res) => setOrders(res.data))
      .catch((err) => setError(getError(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container page my-orders-page">
      <header className="orders-heading">
        <div>
          <span className="section-eyebrow">Your ShopEase history</span>
          <h1 className="page-title">My orders</h1>
          <p>Review your purchases and follow their progress.</p>
        </div>
        <Link to="/products" className="orders-shop-link">Continue shopping <FiArrowRight /></Link>
      </header>
      {error && <div className="alert alert-danger">{error}</div>}

      {!error && orders.length === 0 && (
        <section className="orders-empty">
          <span className="cart-empty-icon"><FiPackage /></span>
          <h2>Your order history is clear</h2>
          <p>Once you place an order, its details and delivery progress will appear here.</p>
          <Link to="/products" className="btn btn-brand">Start shopping <FiArrowRight /></Link>
        </section>
      )}

      {orders.map((order) => (
        <article className="order-card" key={order._id}>
          <header className="order-head">
            <div className="order-reference">
              <span className="order-reference-icon"><FiPackage /></span>
              <div>
                <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
                <span className="muted d-block">Placed on {formatDate(order.createdAt)}</span>
              </div>
            </div>
            <div className="order-total-status">
              <span className={`badge-status status-${order.status.toLowerCase()}`}>{order.status}</span>
              <strong>{formatPrice(order.totalPrice)}</strong>
            </div>
          </header>

          <OrderTracker status={order.status} />

          <div className="order-items">
            {order.items.map((i) => (
              <div className="order-item" key={i.product}>
                <img
                  src={i.image}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <div className="order-item-info">
                  <strong>{i.name}</strong>
                  <span>Quantity: {i.quantity}</span>
                </div>
                <strong>{formatPrice(i.price * i.quantity)}</strong>
              </div>
            ))}
          </div>
          <footer className="order-footer">
            <p className="muted mb-0">
              Deliver to: {order.shippingAddress.address}, {order.shippingAddress.city} &middot; {order.paymentMethod}
            </p>
            <strong>Total {formatPrice(order.totalPrice)}</strong>
          </footer>
        </article>
      ))}
    </div>
  );
}
