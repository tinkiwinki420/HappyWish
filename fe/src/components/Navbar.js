// src/components/ProfileNavBar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const ProfileNavBar = () => {
  return (
    <nav className="profile-nav">
      <ul>
        <li><NavLink to="/profile" activeClassName="active-link">Profile</NavLink></li>
        <li><NavLink to="/financial" activeClassName="active-link">Financial</NavLink></li>
        <li><NavLink to="/dates" activeClassName="active-link">Dates</NavLink></li>
        <li><NavLink to="/services" activeClassName="active-link">Services</NavLink></li>
      </ul>
    </nav>
  );
};

export default ProfileNavBar;
