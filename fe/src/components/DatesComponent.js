import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { API_URL } from '../constans';
import '../styles/Dates.css';
import 'react-calendar/dist/Calendar.css';

const DatesComponent = () => {
  const [date, setDate] = useState(new Date());
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNum: '',
    phoneNumber: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/reservations/unavailable-dates`)
      .then(response => response.json())
      .then(data => setUnavailableDates(data))
      .catch(error => console.error('Error fetching unavailable dates:', error));
  }, []);

  const handleDateChange = (date) => {
    setDate(date);
    setMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/api/reservations/reserve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, reservationDate: date })
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          setMessage('Reservation successful');
          setUnavailableDates([...unavailableDates, date]);
        } else {
          setMessage(data.message);
        }
      })
      .catch(error => {
        console.error('Error making reservation:', error);
        setMessage('Error making reservation');
      });
  };

  return (
    <div className="profile-container">
      <h1>Reserve a Date</h1>
      <Calendar
        onChange={handleDateChange}
        value={date}
        tileDisabled={({ date }) =>
          unavailableDates.some(
            unavailableDate =>
              new Date(unavailableDate).toDateString() === date.toDateString()
          )
        }
      />
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>ID Number:</label>
          <input
            type="text"
            name="idNum"
            value={formData.idNum}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Reserve</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DatesComponent;
