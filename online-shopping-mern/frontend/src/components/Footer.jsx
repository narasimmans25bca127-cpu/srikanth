import { Link } from 'react-router-dom';
import { FiHeadphones, FiShoppingBag } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="footer-brand"><FiShoppingBag /> ShopEase</Link>
            <p className="footer-intro">
              Thoughtful picks for everyday living, with a shopping experience made simple.
            </p>
          </div>

          <div className="footer-column">
            <h2>Explore</h2>
            <nav className="footer-links" aria-label="Explore">
              <Link to="/">Home</Link>
              <Link to="/products">Shop all products</Link>
              <Link to="/#categories">Shop by category</Link>
            </nav>
          </div>

          <div className="footer-column">
            <h2>Your account</h2>
            <nav className="footer-links" aria-label="Your account">
              <Link to="/dashboard">My account</Link>
              <Link to="/my-orders">My orders</Link>
              <Link to="/cart">Shopping cart</Link>
            </nav>
          </div>

          <div className="footer-column">
            <h2>Customer support</h2>
            <div className="footer-support">
              <FiHeadphones aria-hidden="true" />
              <span>
                Need help with an order? Visit your order history or sign in to your account for order details.
              </span>
            </div>
            <nav className="footer-links mt-3" aria-label="Customer support">
              <Link to="/my-orders">Order support</Link>
              <Link to="/login">Sign in for help</Link>
            </nav>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} ShopEase. All rights reserved.</span>
          <span>Cash on Delivery available on every order.</span>
        </div>
      </div>
    </footer>
  );
}
