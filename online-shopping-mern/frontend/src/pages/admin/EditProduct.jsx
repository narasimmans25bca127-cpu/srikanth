import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getError } from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';
import ProductForm from '../../components/ProductForm';
import Loader from '../../components/Loader';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(getError(err)));
  }, [id]);

  const update = async (data) => {
    setError('');
    setLoading(true);
    try {
      await api.put(`/products/${id}`, data);
      navigate('/admin/products');
    } catch (err) {
      setError(getError(err));
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Edit product">
      {error && <div className="alert alert-danger">{error}</div>}
      {!product && !error && <Loader />}
      {product && (
        <ProductForm initial={product} onSubmit={update} submitLabel="Save changes" loading={loading} />
      )}
    </AdminLayout>
  );
}
