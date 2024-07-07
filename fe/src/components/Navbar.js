// src/components/ProfileNavBar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const ProfileNavBar = () => {
  return (
    <nav className="profile-nav">
      <ul>
        <li><NavLink to="/profile" activeclassname="active-link">Profile</NavLink></li>
        <li><NavLink to="/financial" activeclassname="active-link">Financial</NavLink></li>
        <li><NavLink to="/dates" activeclassname="active-link">Dates</NavLink></li>
        <li><NavLink to="/services" activeclassname="active-link">Services</NavLink></li>
      </ul>
    </nav>
  );
};

export default ProfileNavBar;
