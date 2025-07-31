import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/login.css";
import api from '../utils/api';
import ErrorPopup from '../utils/ErrorPopup';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const sanitize = (value) => value.replace(/<[^>]*>?/gm, '').trim();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = sanitize(email);

    if (!cleanEmail) {
      setError('Please fill in all fields correctly.');
      return;
    }

    try {
      const res = await api.post('/login', {
        email: cleanEmail,
        password: password
      });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setAuth(true);
        navigate('/home');
      } else {
        setError('Unexpected response. Try again.');
      }

    } catch (err) {
      if (err.response?.status === 422 && err.response.data.errors) {
        const serverErrors = err.response.data.errors;
        const message =
          serverErrors.email?.[0] ||
          serverErrors.password?.[0] ||
          'Invalid input. Please check your credentials.';
        setError(message);
      } else if (err.response?.status === 401) {
        setError('Invalid credentials');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      {error && <ErrorPopup message={error} onClose={() => setError("")} />}
      <div className="login-image-section"></div>
      <div className="login-form-section">
        <div className="login-form-card">
          <div className="login-form-content">
            <h1 className="login-title">Sign in</h1>
            <p className="login-text">Gain access to Dashboard!</p>
            <form onSubmit={handleLogin}>
              <label htmlFor="email" className="login-label">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="login-input"
                placeholder="name@email.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="password" className="login-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="login-input"
                placeholder="******"
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className="login-signin-button">
                Sign in
              </button>
            </form>

            <div className="login-extra-links">
              <p className="login-text">
                Not have an account? <a href="/register" className="login-link">Register</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
