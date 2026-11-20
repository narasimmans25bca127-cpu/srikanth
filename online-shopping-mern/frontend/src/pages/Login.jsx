import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiEye, FiEyeOff, FiShoppingBag } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getError } from '../api/axios';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else navigate(location.state?.from?.pathname || '/');
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page auth-page auth-page-split">
      <section className="auth-visual login-visual" aria-label="ShopEase shopping">
        <Link to="/" className="auth-visual-brand"><FiShoppingBag /> ShopEase</Link>
        <div className="auth-visual-copy">
          <span className="auth-visual-eyebrow">Good to have you back</span>
          <h2>Everyday finds, just a sign-in away.</h2>
          <p>Pick up where you left off and keep the good things coming.</p>
        </div>
        <div className="auth-visual-note">Thoughtful finds. A smoother everyday.</div>
      </section>

      <section className="auth-panel">
        <div className="form-card auth-card auth-card-premium">
          <Link to="/" className="auth-mobile-brand"><FiShoppingBag /> ShopEase</Link>
          <span className="section-eyebrow">Welcome back</span>
          <h1>Sign in to your account</h1>
          <p className="auth-description">Enter your details to continue shopping.</p>

          {location.state?.from && (
            <div className="alert alert-info" role="status">Please sign in to continue to that page.</div>
          )}
          {error && <div className="alert alert-danger" role="alert">{error}</div>}

          <form onSubmit={submit}>
            <div className="auth-field">
              <label className="form-label" htmlFor="login-email">Email address</label>
              <input
                className="form-control"
                id="login-email"
                type="email"
                name="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="password-field">
                <input
                  className="form-control"
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <p className="auth-persistence">Your sign-in stays saved on this device.</p>
            <button className="btn btn-brand w-100 auth-submit" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> Signing in...</>
              ) : (
                <>Sign in <FiArrowRight /></>
              )}
            </button>
          </form>

          <p className="auth-switch">
            New to ShopEase? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
