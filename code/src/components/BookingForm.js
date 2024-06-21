// src/components/BookingForm.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import halls from "../data/halls";

const BookingForm = () => {
  const { id } = useParams();
  const hall = halls.find((h) => h.id === parseInt(id));
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    guests: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Booking Confirmed for ${formData.name} on ${formData.date}`);
    // In a real application, you would send this data to a server
  };

  return (
    <div>
      <h2>Book {hall.name}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </label>
        <label>
          Number of Guests:
          <input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
};

export default BookingForm;
