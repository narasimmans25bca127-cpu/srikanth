import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiArrowRight,
  FiLogIn,
  FiMenu,
  FiSearch,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const close = () => setOpen(false);
  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const keyword = search.trim();
    navigate(keyword ? `/products?keyword=${encodeURIComponent(keyword)}` : '/products');
    close();
  };

  return (
    <header className="site-nav">
      <nav className="container nav-inner" aria-label="Main navigation">
        <Link to="/" className="brand" onClick={close}>
          <FiShoppingBag /> ShopEase
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>

        <div className={`nav-content ${open ? 'open' : ''}`}>
          <form className="nav-search" role="search" onSubmit={submitSearch}>
            <FiSearch aria-hidden="true" />
            <input
              type="search"
              aria-label="Search products"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="submit" aria-label="Submit product search">
              <FiArrowRight />
            </button>
          </form>

          <div className="nav-links">
            <NavLink to="/" end onClick={close}>Home</NavLink>
            <NavLink to="/products" onClick={close}>Shop</NavLink>
            <Link to="/#categories" onClick={close}>Categories</Link>
            <NavLink to="/my-orders" onClick={close}>My Orders</NavLink>
          </div>

          <div className="nav-actions">
            <NavLink to="/cart" onClick={close} className="cart-link" aria-label={`Cart, ${count} items`}>
              <FiShoppingCart /> <span>Cart</span>
              {count > 0 && <span className="cart-badge">{count}</span>}
            </NavLink>
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="nav-account" onClick={close}>
                  <FiUser /> <span>{user.role === 'admin' ? 'Admin' : 'Account'}</span>
                </Link>
                <button className="nav-logout" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-account" onClick={close}>
                  <FiLogIn /> <span>Log in</span>
                </NavLink>
                <NavLink to="/register" className="nav-cta" onClick={close}>Create account</NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
