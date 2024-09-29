<<<<<<< HEAD
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './components/RegularUserRegister';
import BusinessUserRegister from './components/BusinessUserRegister';
import Profile from './pages/Profile';
import BusinessProfile from './pages/BusinessProfile';
import Financial from './pages/Financial';
import PageDates from './pages/Dates'; // Dates from pages
import Services from './pages/Services';
import Categories from './pages/Categories';
import CategoryUsers from './pages/CategoryUsers';
import CategoryUserProfile from './components/CategoryUserProfile'; // Import the new component
import ComponentDates from './pages/UsersBookingDates'; // Dates from components
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
          <Route path="/users/:userId" element={<CategoryUserProfile />} /> {/* Add this route */}
          <Route path="/users/:userId/dates" element={<ComponentDates />} /> {}
        </Route>
        {isAuthenticated && userType === 'business' && (
          <Route element={<BusinessLayout />}>
            <Route path="/profile" element={<BusinessProfile />} />
            <Route path="/financial" element={<Financial />} />
            <Route path="/dates" element={<PageDates />} />
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
=======
import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import SinglePost from "./pages/SinglePost";
import "./App.css";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Contacts from "./pages/Contacts";
import About from "./pages/About";
import NewPost from "./pages/NewPost";
import EditPost from "./pages/EditPost";
import Register from "./components/Register";
import NormalDashboard from "./components/NormalDashboard";
import BusinessDashboard from "./components/BusinessDashboard";
import Profile from "./pages/profile";
import ProfileView from "./pages/profileview"; // Ensure correct capitalization

function App() {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserType = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        };

        try {
          const res = await axios.get("/api/auth/user", config);
          setUserType(res.data.userType);
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };

    fetchUserType();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Header />
      <div className="main">
        <Routes>
          <Route path="/register" element={<Register />} />
          {userType === "normal" && (
            <Route path="/dashboard" element={<NormalDashboard />} />
          )}
          {userType === "business" && (
            <Route path="/dashboard" element={<BusinessDashboard />} />
          )}
          <Route
            path="/"
            element={<Navigate to={userType ? "/dashboard" : "/register"} />}
          />
          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/newpost" element={<NewPost />} />
          <Route path="/editpost/:id" element={<EditPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contacts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profileview" element={<ProfileView />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
>>>>>>> master

export default App;
