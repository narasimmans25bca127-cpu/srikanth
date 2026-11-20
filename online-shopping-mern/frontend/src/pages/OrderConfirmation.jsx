import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiCheckCircle, FiMapPin, FiPackage } from 'react-icons/fi';
import api, { getError } from '../api/axios';
import { formatDate, formatPrice } from '../utils/format';
import OrderTracker from '../components/OrderTracker';
import Loader from '../components/Loader';
import { FALLBACK_IMAGE } from '../components/ProductCard';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(getError(err)));
  }, [id]);

  if (error) return <div className="container page"><div className="alert alert-danger">{error}</div></div>;
  if (!order) return <Loader />;

  const a = order.shippingAddress;
  const orderNumber = order._id.slice(-8).toUpperCase();

  return (
    <div className="container page confirm confirmation-page">
      <section className="confirmation-success">
        <span className="confirmation-check"><FiCheckCircle /></span>
        <span className="section-eyebrow">Thank you for shopping with us</span>
        <h1>Order confirmed</h1>
        <p>Thank you, {a.fullName}. We’ve received your order and will get it ready for delivery.</p>
        <div className="confirmation-number">
          <span>Order number</span>
          <strong>#{orderNumber}</strong>
        </div>
        <span className="confirmation-date">Placed {formatDate(order.createdAt)}</span>
      </section>

      <section className="confirmation-tracking" aria-label="Order tracking">
        <div className="confirmation-section-heading">
          <span className="confirmation-heading-icon"><FiPackage /></span>
          <div>
            <h2>Order progress</h2>
            <p>We’ll keep you updated as your order moves along.</p>
          </div>
        </div>
        <OrderTracker status={order.status} />
      </section>

      <div className="confirmation-layout">
        <section className="form-card confirmation-items">
          <div className="confirmation-section-heading">
            <span className="confirmation-heading-icon"><FiPackage /></span>
            <div>
              <h2>Items in your order</h2>
              <p>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          {order.items.map((i) => (
            <div className="confirmation-item" key={i.product}>
              <img
                src={i.image}
                alt=""
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <div className="confirmation-item-info">
                <strong>{i.name}</strong>
                <span>Quantity: {i.quantity}</span>
              </div>
              <strong>{formatPrice(i.price * i.quantity)}</strong>
            </div>
          ))}
          <div className="summary-row"><span>Subtotal</span><span>{formatPrice(order.itemsPrice)}</span></div>
          <div className="summary-row"><span>Delivery</span><span className="summary-free">Free</span></div>
          <div className="summary-row total"><span>Total due on delivery</span><span>{formatPrice(order.totalPrice)}</span></div>
        </section>

        <aside className="form-card confirmation-address">
          <div className="confirmation-section-heading">
            <span className="confirmation-heading-icon"><FiMapPin /></span>
            <div>
              <h2>Delivery details</h2>
              <p>Shipping address</p>
            </div>
          </div>
          <address>
            <strong>{a.fullName}</strong>
            <span>{a.phone}</span>
            <span>{a.address}</span>
            <span>{a.city}, {a.state} {a.postalCode}</span>
          </address>
          <div className="confirmation-payment">
            <FiCheck />
            <span>Payment method: <strong>{order.paymentMethod}</strong></span>
          </div>
        </aside>
      </div>

      <div className="confirm-actions confirmation-actions">
        <Link to="/products" className="btn btn-brand">Continue shopping <FiArrowRight /></Link>
        <Link to="/my-orders" className="btn btn-outline-dark">View my orders</Link>
      </div>
    </div>
  );
}
