import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getError } from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';
import ProductForm from '../../components/ProductForm';

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const create = async (data) => {
    setError('');
    setLoading(true);
    try {
      await api.post('/products', data);
      navigate('/admin/products');
    } catch (err) {
      setError(getError(err));
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add product">
      {error && <div className="alert alert-danger">{error}</div>}
      <ProductForm onSubmit={create} submitLabel="Add product" loading={loading} />
    </AdminLayout>
  );
}
