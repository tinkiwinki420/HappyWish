import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './components/RegularUserRegister';
import BusinessUserRegister from './components/BusinessUserRegister';
import Profile from './pages/Profile';
import BusinessProfile from './pages/BusinessProfile';
import AuthContext from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import RegistrationSelection from './pages/Register'; // Ensure this import path is correct

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const userType = localStorage.getItem('userType');

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/profile" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/profile" /> : <RegistrationSelection />} />
          <Route path="/register-regular" element={isAuthenticated ? <Navigate to="/profile" /> : <Register />} />
          <Route path="/register-business" element={isAuthenticated ? <Navigate to="/profile" /> : <BusinessUserRegister />} />
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                userType === 'business' ? <BusinessProfile /> : <Profile />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
