import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiEye, FiEyeOff, FiShoppingBag } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getError } from '../api/axios';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.password !== form.confirm) return setError('Passwords do not match');

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/');
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page auth-page auth-page-split auth-register-page">
      <section className="auth-visual register-visual" aria-label="ShopEase shopping">
        <Link to="/" className="auth-visual-brand"><FiShoppingBag /> ShopEase</Link>
        <div className="auth-visual-copy">
          <span className="auth-visual-eyebrow">Make room for good things</span>
          <h2>A more considered way to shop.</h2>
          <p>Create an account to keep your details close and your orders easy to follow.</p>
        </div>
        <div className="auth-visual-note">Your next everyday favorite is waiting.</div>
      </section>

      <section className="auth-panel">
        <div className="form-card auth-card auth-card-premium">
          <Link to="/" className="auth-mobile-brand"><FiShoppingBag /> ShopEase</Link>
          <span className="section-eyebrow">Join the ShopEase community</span>
          <h1>Create your account</h1>
          <p className="auth-description">A few details and you’re ready to explore.</p>

          {error && <div className="alert alert-danger" role="alert">{error}</div>}

          <form onSubmit={submit}>
            <div className="auth-field">
              <label className="form-label" htmlFor="register-name">Full name</label>
              <input
                className="form-control"
                id="register-name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={change}
                minLength={2}
                required
              />
            </div>

            <div className="auth-field">
              <label className="form-label" htmlFor="register-email">Email address</label>
              <input
                className="form-control"
                id="register-email"
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={change}
                required
              />
            </div>

            <div className="auth-field">
              <label className="form-label" htmlFor="register-password">Password</label>
              <div className="password-field">
                <input
                  className="form-control"
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={change}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <span className="auth-field-hint">Use at least 6 characters.</span>
            </div>

            <div className="auth-field">
              <label className="form-label" htmlFor="register-confirm">Confirm password</label>
              <div className="password-field">
                <input
                  className="form-control"
                  id="register-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm"
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={change}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showConfirm ? 'Hide confirmation password' : 'Show confirmation password'}
                  aria-pressed={showConfirm}
                  onClick={() => setShowConfirm((visible) => !visible)}
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button className="btn btn-brand w-100 auth-submit" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> Creating account...</>
              ) : (
                <>Create account <FiArrowRight /></>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
