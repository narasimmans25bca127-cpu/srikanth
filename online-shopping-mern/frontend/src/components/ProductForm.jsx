import { useState } from 'react';
import { FALLBACK_IMAGE } from './ProductCard';

const empty = { name: '', description: '', price: '', category: '', image: '', stock: '' };

// Shared by the Add Product and Edit Product pages
export default function ProductForm({ initial = empty, onSubmit, submitLabel, loading }) {
  const [form, setForm] = useState({ ...empty, ...initial });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, price: Number(form.price), stock: Number(form.stock) });
  };

  return (
    <form onSubmit={submit} className="form-card">
      <div className="row g-3">
        <div className="col-md-8">
          <label className="form-label">Product name</label>
          <input className="form-control" name="name" value={form.name} onChange={change} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Category</label>
          <input
            className="form-control"
            name="category"
            list="category-options"
            value={form.category}
            onChange={change}
            required
          />
          <datalist id="category-options">
            <option value="Electronics" />
            <option value="Fashion" />
            <option value="Home & Kitchen" />
            <option value="Books" />
          </datalist>
        </div>
        <div className="col-md-6">
          <label className="form-label">Price</label>
          <input
            className="form-control"
            type="number"
            min="0"
            step="any"
            name="price"
            value={form.price}
            onChange={change}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Stock</label>
          <input
            className="form-control"
            type="number"
            min="0"
            step="1"
            name="stock"
            value={form.stock}
            onChange={change}
            required
          />
        </div>
        <div className="col-12">
          <label className="form-label">Image URL</label>
          <input
            className="form-control"
            name="image"
            value={form.image}
            onChange={change}
            placeholder="https://..."
            required
          />
        </div>
        {form.image && (
          <div className="col-12">
            <img
              src={form.image}
              alt="Preview"
              className="form-preview"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
          </div>
        )}
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="4"
            name="description"
            value={form.description}
            onChange={change}
            required
          />
        </div>
      </div>
      <button className="btn btn-brand mt-4" disabled={loading}>
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
