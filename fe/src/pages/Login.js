import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../constans';
import AuthContext from '../contexts/AuthContext';
import '../styles/login.css'; // Import the CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login response data:', data); // Log the entire response data

      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userType', data.userType);
      localStorage.setItem('category', data.categoryName); // Set the category name from response
      console.log('Category set to:', data.categoryName); // Log the category

      login();
      navigate('/profile');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="login-page"> {/* Wrapper for the background */}
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          <div className="redirect-message">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
