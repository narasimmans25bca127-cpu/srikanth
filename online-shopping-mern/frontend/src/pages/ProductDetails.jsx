import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCheck,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiTruck,
} from 'react-icons/fi';
import api, { getError } from '../api/axios';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import ProductCard, { FALLBACK_IMAGE } from '../components/ProductCard';
import Loader from '../components/Loader';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState('');

  useEffect(() => {
    let active = true;
    setProduct(null);
    setError('');
    api
      .get(`/products/${id}`)
      .then((res) => {
        if (active) {
          setProduct(res.data);
          setQuantity(1);
          setAdded(false);
        }
      })
      .catch((err) => {
        if (active) setError(getError(err));
      });
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!product) return undefined;
    let active = true;
    setRelatedLoading(true);
    setRelatedError('');
    api
      .get('/products', { params: { category: product.category } })
      .then((res) => {
        if (active) {
          setRelatedProducts(
            res.data.filter((item) => item._id !== product._id).slice(0, 4)
          );
        }
      })
      .catch((err) => {
        if (active) setRelatedError(getError(err));
      })
      .finally(() => {
        if (active) setRelatedLoading(false);
      });
    return () => {
      active = false;
    };
  }, [product]);

  if (error)
    return (
      <div className="container page">
        <div className="alert alert-danger">{error}</div>
        <Link to="/products" className="back-link"><FiArrowLeft /> Back to products</Link>
      </div>
    );
  if (!product) return <Loader />;

  const soldOut = Number(product.stock) <= 0;
  const maxStock = Math.max(0, Number(product.stock) || 0);
  const discount = Number(product.discountPercentage);
  const hasDiscount = Number.isFinite(discount) && discount > 0;

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
  };

  return (
    <div className="container page product-detail-page">
      <Link to="/products" className="back-link"><FiArrowLeft /> Back to shop</Link>
      <div className="details">
        <div className="details-img">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <span className="details-image-caption">{product.category}</span>
        </div>
        <div className="details-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="details-price-row">
            <p className="details-price">{formatPrice(product.price)}</p>
            {hasDiscount && <span className="discount-tag details-discount">{Math.round(discount)}% off</span>}
          </div>
          <p className="details-desc">{product.description}</p>

          <div className={`details-stock ${soldOut ? 'out' : 'in'}`}>
            <span className="details-stock-icon">{soldOut ? <FiTruck /> : <FiCheck />}</span>
            <span>{soldOut ? 'Currently unavailable' : `${product.stock} available to ship`}</span>
          </div>

          {!soldOut && (
            <>
              <div className="details-purchase">
                <div className="qty" aria-label="Select quantity">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  >
                    <FiMinus />
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= maxStock}
                    onClick={() => setQuantity((current) => Math.min(maxStock, current + 1))}
                  >
                    <FiPlus />
                  </button>
                </div>
                <span className="quantity-note">Quantity</span>
              </div>
              <div className="details-actions">
                <button className="btn btn-brand" onClick={handleAdd}>
                  <FiShoppingCart /> Add to cart
                </button>
                <button
                  className="btn btn-outline-dark"
                  onClick={() => {
                    addToCart(product, quantity);
                    navigate('/cart');
                  }}
                >
                  Buy now
                </button>
              </div>
            </>
          )}
          {added && (
            <p className="added-note" role="status">
              Added to your cart. <Link to="/cart">View cart</Link>
            </p>
          )}
          <div className="details-delivery"><FiTruck /> Free delivery on every order</div>
        </div>
      </div>

      {(relatedLoading || relatedError || relatedProducts.length > 0) && (
        <section className="related-section" aria-labelledby="related-title">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">More to explore</span>
              <h2 id="related-title">You may also like</h2>
            </div>
          </div>
          {relatedError && <div className="alert alert-warning">{relatedError}</div>}
          {relatedLoading ? (
            <Loader text="Finding more from this category..." />
          ) : (
            relatedProducts.length > 0 && (
              <div className="product-grid">
                {relatedProducts.map((item) => <ProductCard key={item._id} product={item} />)}
              </div>
            )
          )}
        </section>
      )}
    </div>
  );
}
