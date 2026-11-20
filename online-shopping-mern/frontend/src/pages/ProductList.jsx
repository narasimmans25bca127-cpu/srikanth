import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiArrowDown, FiSearch, FiX } from 'react-icons/fi';
import api, { getError } from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function ProductList() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const urlKeyword = params.get('keyword') || '';

  const [search, setSearch] = useState(urlKeyword);
  const [keyword, setKeyword] = useState(urlKeyword);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    api
      .get('/products/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => setCategoryError(getError(err)));
  }, []);

  useEffect(() => {
    setSearch(urlKeyword);
    setKeyword(urlKeyword);
  }, [urlKeyword]);

  // Wait 300ms after typing before searching
  useEffect(() => {
    const timer = setTimeout(() => setKeyword(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get('/products', { params: { keyword, category } })
      .then((res) => setProducts(res.data))
      .catch((err) => setError(getError(err)))
      .finally(() => setLoading(false));
  }, [keyword, category]);

  const chooseCategory = (c) => {
    const nextParams = new URLSearchParams(params);
    if (c) nextParams.set('category', c);
    else nextParams.delete('category');
    const activeKeyword = search.trim();
    if (activeKeyword) nextParams.set('keyword', activeKeyword);
    else nextParams.delete('keyword');
    setParams(nextParams);
  };

  const invalidPriceRange =
    minPrice !== '' && maxPrice !== '' && Number(minPrice) > Number(maxPrice);
  const filtersActive = Boolean(keyword || category || minPrice || maxPrice);
  const priceFilteredProducts = invalidPriceRange
    ? []
    : products.filter((product) => {
        const price = Number(product.price);
        const aboveMin = minPrice === '' || price >= Number(minPrice);
        const belowMax = maxPrice === '' || price <= Number(maxPrice);
        return aboveMin && belowMax;
      });

  const sortedProducts = [...priceFilteredProducts].sort((a, b) => {
    if (sortOrder === 'price-low') return Number(a.price) - Number(b.price);
    if (sortOrder === 'price-high') return Number(b.price) - Number(a.price);
    if (sortOrder === 'name') return a.name.localeCompare(b.name);
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  const clearFilters = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSortOrder('newest');
    setParams({});
  };

  return (
    <div className="container page catalog-page">
      <header className="catalog-header">
        <div>
          <span className="section-eyebrow">The ShopEase collection</span>
          <h1 className="page-title">Shop all products</h1>
          <p>Find something useful, lovely, or a little of both.</p>
        </div>
      </header>

      <section className="catalog-tools" aria-label="Product search and filters">
        <div className="catalog-search search-box">
          <FiSearch aria-hidden="true" />
          <input
            className="form-control"
            type="search"
            aria-label="Search products by name"
            placeholder="Search products by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" className="catalog-clear" aria-label="Clear search" onClick={() => setSearch('')}>
              <FiX />
            </button>
          )}
        </div>

        <div className="catalog-categories" aria-label="Filter by category">
          <button
            type="button"
            className={`pill ${category === '' ? 'active' : ''}`}
            aria-pressed={category === ''}
            onClick={() => chooseCategory('')}
          >
            All products
          </button>
          {categories.map((c) => (
            <button
              type="button"
              key={c}
              className={`pill ${category === c ? 'active' : ''}`}
              aria-pressed={category === c}
              onClick={() => chooseCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="catalog-price-filter" aria-label="Filter by price in Indian rupees">
          <span className="catalog-filter-label">Price range</span>
          <label>
            <span className="catalog-price-input">
              <span aria-hidden="true">₹</span>
              <input
                type="number"
                min="0"
                step="100"
                inputMode="numeric"
                placeholder="Min"
                aria-label="Minimum price in rupees"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </span>
          </label>
          <span className="catalog-price-separator">to</span>
          <label>
            <span className="catalog-price-input">
              <span aria-hidden="true">₹</span>
              <input
                type="number"
                min="0"
                step="100"
                inputMode="numeric"
                placeholder="Max"
                aria-label="Maximum price in rupees"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </span>
          </label>
          {filtersActive && (
            <button type="button" className="catalog-reset" onClick={clearFilters}>Clear filters</button>
          )}
        </div>
      </section>

      {categoryError && <div className="alert alert-warning">{categoryError}</div>}

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="catalog-results">
            <p aria-live="polite">
              {invalidPriceRange ? (
                'Set a valid price range to view products.'
              ) : (
                <>
                  <strong>{sortedProducts.length}</strong> {sortedProducts.length === 1 ? 'product' : 'products'}
                  {category && <> in <strong>{category}</strong></>}
                  {keyword && <> matching <strong>“{keyword}”</strong></>}
                  {(minPrice || maxPrice) && <> in your price range</>}
                </>
              )}
            </p>
            <label className="catalog-sort">
              <span>Sort by</span>
              <span className="catalog-sort-control">
                <select
                  className="form-select"
                  aria-label="Sort products"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">Newest first</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="name">Name: A to Z</option>
                </select>
                <FiArrowDown aria-hidden="true" />
              </span>
            </label>
          </div>

          {invalidPriceRange ? (
            <div className="alert alert-warning price-range-error" role="alert">
              Minimum price must be less than or equal to maximum price.
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="catalog-empty">
              <span className="catalog-empty-icon"><FiSearch /></span>
              <h2>No products found</h2>
              <p>Try a different search or choose another category.</p>
              {filtersActive && (
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="product-grid">
              {sortedProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
