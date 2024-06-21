import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import SinglePost from './pages/SinglePost';
import './App.css';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import Contacts from './pages/Contacts';
import About from './pages/About';
import NewPost from './pages/NewPost';
import EditPost from './pages/EditPost';
import Register from './components/Register';
import NormalDashboard from './components/NormalDashboard';
import BusinessDashboard from './components/BusinessDashboard';

function App() {
    const [userType, setUserType] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserType = async () => {
            // Assuming you store token in localStorage after login
            const token = localStorage.getItem('token');
            if (token) {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                };

                try {
                    const res = await axios.get('/api/auth/user', config);
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
                    {userType === 'normal' && <Route path="/dashboard" element={<NormalDashboard />} />}
                    {userType === 'business' && <Route path="/dashboard" element={<BusinessDashboard />} />}
                    <Route path="/" element={<Navigate to={userType ? "/dashboard" : "/register"} />} />
                    <Route path="/post/:id" element={<SinglePost />} />
                    <Route path="/" element={<MainPage />} />
                    <Route path="/newpost" element={<NewPost />} />
                    <Route path="/editpost/:id" element={<EditPost />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contacts />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;
