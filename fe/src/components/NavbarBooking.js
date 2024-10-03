// src/components/NavbarBooking.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/NavbarBooking.css';

const NavbarBooking = ({ userId }) => (
    <nav className="navbar">
        <NavLink to={`/users/${userId}`} activeclassname="active">
            Profile
        </NavLink>
        <NavLink to={`/users/${userId}/dates`} activeclassname="active">
            Dates
        </NavLink>
    </nav>
);

export default NavbarBooking;
