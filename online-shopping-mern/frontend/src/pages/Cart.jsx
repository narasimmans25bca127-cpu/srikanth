import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiMinus, FiPlus, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { FALLBACK_IMAGE } from '../components/ProductCard';

export default function Cart() {
  const { items, setQuantity, removeFromCart, subtotal, count } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container page cart-page">
        <section className="cart-empty-state">
          <span className="cart-empty-icon"><FiShoppingCart /></span>
          <span className="section-eyebrow">A little room for something lovely</span>
          <h1>Your cart is waiting</h1>
          <p>When you find something you love, it will be right here.</p>
          <Link to="/products" className="btn btn-brand">
            Explore the shop <FiArrowRight />
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="container page cart-page">
      <div className="cart-heading">
        <div>
          <span className="section-eyebrow">Almost yours</span>
          <h1 className="page-title">Your shopping cart</h1>
          <p>{count} {count === 1 ? 'item' : 'items'} ready for checkout</p>
        </div>
        <Link to="/products" className="cart-continue">
          Continue shopping <FiArrowRight />
        </Link>
      </div>
      <div className="cart-layout">
        <section className="cart-items" aria-label="Items in your cart">
          {items.map((item) => (
            <article className="cart-row" key={item.product}>
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <div className="cart-info">
                <Link to={`/products/${item.product}`} className="product-name">{item.name}</Link>
                <span className="muted">{formatPrice(item.price)} each</span>
              </div>
              <div className="cart-quantity">
                <span>Quantity</span>
                <div className="qty">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${item.name}`}
                    disabled={item.quantity <= 1}
                    onClick={() => setQuantity(item.product, item.quantity - 1)}
                  >
                    <FiMinus />
                  </button>
                  <span aria-live="polite">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${item.name}`}
                    disabled={item.quantity >= item.stock}
                    onClick={() => setQuantity(item.product, item.quantity + 1)}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
              <div className="cart-side">
                <strong className="cart-line-price">{formatPrice(item.price * item.quantity)}</strong>
                <button
                  type="button"
                  className="icon-btn danger"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => removeFromCart(item.product)}
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="summary-card">
          <span className="section-eyebrow">Your order</span>
          <h2>Order summary</h2>
          <div className="summary-row"><span>Subtotal ({count} items)</span><span>{formatPrice(subtotal)}</span></div>
          <div className="summary-row"><span>Delivery</span><span className="summary-free">Free</span></div>
          <div className="summary-row total"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
          <button type="button" className="btn btn-brand w-100" onClick={() => navigate('/checkout')}>
            Proceed to checkout <FiArrowRight />
          </button>
          <p className="summary-note">Cash on Delivery available at checkout.</p>
        </aside>
      </div>
    </div>
  );
}
