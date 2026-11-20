import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

export const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="100%" height="100%" fill="#e4ecec"/><text x="50%" y="50%" fill="#5e6e75" font-family="sans-serif" font-size="28" text-anchor="middle">No image</text></svg>'
  );

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const soldOut = Number(product.stock) <= 0;
  const discount = Number(product.discountPercentage);
  const hasDiscount = Number.isFinite(discount) && discount > 0;

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        {soldOut && <span className="sold-out-tag">Sold out</span>}
        {hasDiscount && !soldOut && <span className="discount-tag">{Math.round(discount)}% off</span>}
      </Link>
      <div className="product-body">
        <div className="product-meta">
          <span className="product-category">{product.category}</span>
          <span className={`product-stock ${soldOut ? 'out' : 'in'}`}>
            {soldOut ? 'Out of stock' : 'In stock'}
          </span>
        </div>
        <Link to={`/products/${product._id}`} className="product-name">
          {product.name}
        </Link>
        <div className="product-card-bottom">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button
            className="btn btn-brand btn-sm"
            disabled={soldOut}
            onClick={() => addToCart(product, 1)}
          >
            <FiShoppingCart /> Add to cart
          </button>
        </div>
        <Link to={`/products/${product._id}`} className="product-view-link">
          View details <FiArrowRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
