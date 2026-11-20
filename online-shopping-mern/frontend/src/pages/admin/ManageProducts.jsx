import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import api, { getError } from '../../api/axios';
import { formatPrice } from '../../utils/format';
import { FALLBACK_IMAGE } from '../../components/ProductCard';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () =>
    api
      .get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => setError(getError(err)))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const remove = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${product._id}`);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
    } catch (err) {
      setError(getError(err));
    }
  };

  return (
    <AdminLayout
      title="Manage products"
      action={<Link to="/admin/products/add" className="btn btn-brand">Add product</Link>}
    >
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <p className="empty">No products yet. Add your first product.</p>
      ) : (
        <div className="form-card table-wrap">
          <table className="table align-middle">
            <thead>
              <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th className="text-end">Actions</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="thumb"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{p.stock === 0 ? <span className="stock out">0</span> : p.stock}</td>
                  <td className="text-end actions">
                    <Link to={`/admin/products/edit/${p._id}`} className="icon-btn"><FiEdit2 /> Edit</Link>
                    <button className="icon-btn danger" onClick={() => remove(p)}><FiTrash2 /> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
