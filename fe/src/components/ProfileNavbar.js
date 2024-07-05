// src/components/ProfileNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProfileNavbar = () => {
  return (
    <nav className="profile-navbar">
      <ul>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/financial">Financial</Link></li>
        <li><Link to="/dates">Dates</Link></li>
        <li><Link to="/services">Services</Link></li>
      </ul>
    </nav>
  );
};

export default ProfileNavbar;
