import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/login.css";
import api from '../utils/api';
import ErrorPopup from '../utils/ErrorPopup';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const [errors, setErrors] = useState({});
  const [popupError, setPopupError] = useState('');

  const sanitize = (value) => value.replace(/<[^>]*>?/gm, '').trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: sanitize(value)
    }));
  };

  const validateForm = () => {
    const err = {};
    if (form.password.length < 6) {
      err.password = ['Password must be at least 6 characters long.'];
    }
    if (form.password !== form.password_confirmation) {
      err.password_confirmation = ['Passwords do not match.'];
    }
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setPopupError('');

    const clientErrors = validateForm();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    try {
      const res = await api.post('/register', form);
     if (res.data.message === 'User registered successfully') {
        navigate('/'); 
      } else {
        setPopupError('Unexpected response. Try again.');
      }

      } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setPopupError('Registration failed. Please check your input.');
      }
    }
  };

  return (
    <div className="login-container">
      {popupError && <ErrorPopup message={popupError} onClose={() => setPopupError("")} />}
      <div className="login-image-section"></div>
      <div className="login-form-section">
        <div className="login-form-card">
          <div className="login-form-content">
            <h1 className="login-title">Create account</h1>
            <p className="login-text">Sign up and access your dashboard.</p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="name" className="login-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="login-input"
                placeholder="Your Name"
                onChange={handleChange}
                required
              />
              {errors.name && <p className="login-error">{errors.name[0]}</p>}

              <label htmlFor="email" className="login-label">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="login-input"
                placeholder="name@email.com"
                onChange={handleChange}
                required
              />
              {errors.email && <p className="login-error">{errors.email[0]}</p>}

              <label htmlFor="password" className="login-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="login-input"
                placeholder="******"
                onChange={handleChange}
                required
              />
              {errors.password && <p className="login-error">{errors.password[0]}</p>}

              <label htmlFor="password_confirmation" className="login-label">Confirm Password</label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                className="login-input"
                placeholder="******"
                onChange={handleChange}
                required
              />
              {errors.password_confirmation && <p className="login-error">{errors.password_confirmation[0]}</p>}

              <button type="submit" className="login-signin-button">Register</button>
            </form>

            <div className="login-extra-links">
              <p className="login-text">
                Already have an account? <a href="/" className="login-link">Login</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
