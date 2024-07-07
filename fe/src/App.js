import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './components/RegularUserRegister';
import BusinessUserRegister from './components/BusinessUserRegister';
import Profile from './pages/Profile';
import BusinessProfile from './pages/BusinessProfile';
import Financial from './pages/Financial';
import Dates from './pages/Dates';
import Services from './pages/Services';
import Categories from './pages/Categories';
import CategoryUsers from './pages/CategoryUsers';
import AuthContext from './contexts/AuthContext';
import Layout from './components/Layout';
import BusinessLayout from './components/BusinessLayout';
import Home from './pages/Home';
import RegistrationSelection from './pages/Register';

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const userType = localStorage.getItem('userType'); // Get userType from localStorage

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/profile" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/profile" /> : <RegistrationSelection />} />
          <Route path="/register-business" element={isAuthenticated ? <Navigate to="/profile" /> : <BusinessUserRegister />} />
          <Route path="/register-regular" element={isAuthenticated ? <Navigate to="/profile" /> : <Register />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:categoryId" element={<CategoryUsers />} />
        </Route>
        {isAuthenticated && userType === 'business' && (
          <Route element={<BusinessLayout />}>
            <Route path="/profile" element={<BusinessProfile />} />
            <Route path="/financial" element={<Financial />} />
            <Route path="/dates" element={<Dates />} />
            <Route path="/services" element={<Services />} />
          </Route>
        )}
        {isAuthenticated && userType !== 'business' && (
          <Route element={<Layout />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
};

export default App;
