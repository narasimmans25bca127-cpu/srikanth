import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiLock, FiMapPin, FiTruck } from 'react-icons/fi';
import api, { getError } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { FALLBACK_IMAGE } from '../components/ProductCard';

export default function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    postalCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Nothing to check out: go back to the cart (but not right after placing an order)
  useEffect(() => {
    if (items.length === 0 && !placed) navigate('/cart', { replace: true });
  }, [items, placed, navigate]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: form,
        paymentMethod: 'Cash on Delivery',
      });
      setPlaced(true);
      clearCart();
      navigate(`/order-confirmation/${data._id}`, { replace: true });
    } catch (err) {
      setError(getError(err));
      setLoading(false);
    }
  };

  return (
    <div className="container page checkout-page">
      <div className="checkout-heading">
        <div>
          <span className="section-eyebrow">Just one more step</span>
          <h1 className="page-title">Checkout</h1>
          <p>Where should we deliver your order?</p>
        </div>
        <Link to="/cart" className="checkout-back"><FiArrowLeft /> Back to cart</Link>
      </div>
      <form onSubmit={submit} className="cart-layout checkout-layout">
        <div className="form-card checkout-form-card">
          <div className="checkout-section-heading">
            <span className="checkout-heading-icon"><FiMapPin /></span>
            <div>
              <h2>Delivery address</h2>
              <p>Enter the details for your delivery.</p>
            </div>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="row g-3 checkout-fields">
            <div className="col-md-6">
              <label className="form-label" htmlFor="checkout-full-name">Full name</label>
              <input
                className="form-control"
                id="checkout-full-name"
                name="fullName"
                autoComplete="name"
                value={form.fullName}
                onChange={change}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="checkout-phone">Phone number</label>
              <input
                className="form-control"
                id="checkout-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                value={form.phone}
                onChange={change}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="checkout-address">Street address</label>
              <textarea
                className="form-control"
                id="checkout-address"
                rows="3"
                name="address"
                autoComplete="street-address"
                value={form.address}
                onChange={change}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="checkout-city">City</label>
              <input
                className="form-control"
                id="checkout-city"
                name="city"
                autoComplete="address-level2"
                value={form.city}
                onChange={change}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="checkout-state">State</label>
              <input
                className="form-control"
                id="checkout-state"
                name="state"
                autoComplete="address-level1"
                value={form.state}
                onChange={change}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="checkout-postal-code">Postal code</label>
              <input
                className="form-control"
                id="checkout-postal-code"
                name="postalCode"
                autoComplete="postal-code"
                value={form.postalCode}
                onChange={change}
                required
              />
            </div>
          </div>

          <section className="checkout-payment">
            <div className="checkout-section-heading">
              <span className="checkout-heading-icon"><FiLock /></span>
              <div>
                <h2>Payment method</h2>
                <p>Choose how you would like to pay.</p>
              </div>
            </div>
            <label className="payment-option">
              <input type="radio" name="paymentMethod" checked readOnly />
              <span className="payment-option-copy">
                <strong>Cash on Delivery</strong>
                <span className="muted">Pay in cash when your order arrives.</span>
              </span>
            </label>
          </section>
        </div>

        <aside className="summary-card">
          <span className="section-eyebrow">Ready when you are</span>
          <h2>Order summary</h2>
          <div className="checkout-items">
            {items.map((i) => (
              <div className="checkout-item" key={i.product}>
                <img
                  src={i.image}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <div className="checkout-item-info">
                  <strong>{i.name}</strong>
                  <span>Qty {i.quantity}</span>
                </div>
                <strong className="checkout-item-price">{formatPrice(i.price * i.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="summary-row"><span>Delivery</span><span className="summary-free">Free</span></div>
          <div className="summary-row total"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
          <div className="checkout-delivery-note"><FiTruck /> Free delivery on every order</div>
          <button className="btn btn-brand w-100 checkout-submit" disabled={loading}>
            {loading ? 'Placing order...' : <>Place order <FiArrowRight /></>}
          </button>
          <p className="checkout-cod-note">Payment is collected in cash when your order arrives.</p>
          <Link to="/cart" className="checkout-back checkout-back-mobile"><FiArrowLeft /> Back to cart</Link>
        </aside>
      </form>
    </div>
  );
}
