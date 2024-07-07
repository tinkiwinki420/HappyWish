// src/pages/Dates.js
import React from 'react';
import BookingCalendar from '../components/BookingCalendar';
import '../styles/styles.css';

const Dates = () => {
  return (
    <div className="profile-container">
      <h1>Dates Page</h1>
      <BookingCalendar />
    </div>
  );
};

export default Dates;
