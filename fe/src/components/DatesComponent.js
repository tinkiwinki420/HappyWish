// src/pages/Dates.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/styles.css';

const Dates = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Additional logic for handling date selection can be added here
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to submit the form data along with the selected date
  };

  return (
    <div className="profile-container">
      <h1>Dates Page</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select a Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MMMM d, yyyy"
            className="date-picker"
          />
        </div>
        <div className="form-group">
          <label>First Name:</label>
          <input type="text" name="firstName" required />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input type="text" name="lastName" required />
        </div>
        <div className="form-group">
          <label>ID Number:</label>
          <input type="text" name="idNum" required />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input type="tel" name="phoneNumber" required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Dates;
