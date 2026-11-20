import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiGrid,
  FiHome,
  FiRefreshCw,
  FiShoppingBag,
  FiSmartphone,
  FiTruck,
} from 'react-icons/fi';
import api, { getError } from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const categoryIconFor = (category) => {
  const name = category.toLowerCase();
  if (name.includes('electronic') || name.includes('tech')) return FiSmartphone;
  if (name.includes('book')) return FiBookOpen;
  if (name.includes('home') || name.includes('kitchen')) return FiHome;
  if (name.includes('fashion') || name.includes('cloth')) return FiShoppingBag;
  return FiGrid;
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/products/categories')])
      .then(([p, c]) => {
        setProducts(p.data.slice(0, 8));
        setCategories(c.data);
      })
      .catch((err) => setError(getError(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-inner">
          <span className="hero-eyebrow">Everyday, elevated</span>
          <h1>Find the little things that make life better.</h1>
          <p>
            Discover considered essentials for your home, wardrobe and day-to-day. A better way to shop starts here.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-brand btn-lg">
              Shop now <FiArrowRight className="ms-2" />
            </Link>
            <Link to="/#categories" className="hero-secondary">
              Explore categories <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section id="categories" className="home-section container">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">Find your favorites</span>
            <h2>Shop by category</h2>
            <p>Browse the collections available in our store.</p>
          </div>
          <Link to="/products" className="section-link">View all products <FiArrowRight /></Link>
        </div>
        {error && <div className="alert alert-warning home-error" role="status">{error}</div>}
        {loading ? (
          <Loader text="Loading store collections..." />
        ) : error ? null : (
          categories.length === 0 ? (
            <p className="empty">No categories are available right now. Please check back soon.</p>
          ) : (
            <div className="category-grid">
              {categories.map((category) => {
                const CategoryIcon = categoryIconFor(category);
                return (
                  <Link
                    key={category}
                    to={`/products?category=${encodeURIComponent(category)}`}
                    className="category-tile"
                  >
                    <span>
                      <span className="category-icon"><CategoryIcon aria-hidden="true" /></span>
                      <span>{category}</span>
                    </span>
                    <FiArrowRight className="category-arrow" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          )
        )}
      </section>

      <section className="home-section soft-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">Fresh finds</span>
              <h2>Latest arrivals</h2>
              <p>Explore the newest products in the ShopEase collection.</p>
            </div>
            <Link to="/products" className="section-link">Shop everything <FiArrowRight /></Link>
          </div>
          {loading ? (
            <Loader text="Loading the latest products..." />
          ) : error ? null : products.length === 0 ? (
            <p className="empty">There are no products to display right now.</p>
          ) : (
            <div className="product-grid">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      <section className="home-section container">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">A better way to shop</span>
            <h2>Made simple, from cart to doorstep</h2>
          </div>
        </div>
        <div className="benefits-grid">
          <article className="benefit-card">
            <span className="benefit-icon"><FiTruck aria-hidden="true" /></span>
            <div><h3>Free delivery</h3><p>Delivery is free on every order.</p></div>
          </article>
          <article className="benefit-card">
            <span className="benefit-icon"><FiCheckCircle aria-hidden="true" /></span>
            <div><h3>Pay on delivery</h3><p>Pay in cash when your order arrives.</p></div>
          </article>
          <article className="benefit-card">
            <span className="benefit-icon"><FiRefreshCw aria-hidden="true" /></span>
            <div><h3>Stay in the know</h3><p>Follow your order progress from your account.</p></div>
          </article>
        </div>
      </section>

      <section className="container pb-5">
        <div className="promo-banner">
          <div className="promo-content">
            <span className="section-eyebrow">Good things are closer</span>
            <h2>Your next favorite is waiting.</h2>
            <p>Explore the collection and find something just right for your everyday.</p>
            <Link to="/products" className="btn btn-brand">
              Explore the shop <FiArrowRight className="ms-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
