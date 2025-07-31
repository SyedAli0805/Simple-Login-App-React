import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/home.css";
import api from '../utils/api';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user');
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  if (!user) return <div className="home-loading">Loading...</div>;

  return (
    <div className="home-container">
      <div className="home-card">
        <h2>Welcome, <span className="home-name">{user.name}</span></h2>
        <p className="home-email">📧 {user.email}</p>
        <button className="home-logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Home;
