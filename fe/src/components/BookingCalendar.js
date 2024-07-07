// src/components/BookingCalendar.js
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { API_URL } from '../constans';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/BookingCalendar.css';
import CustomEvent from './CustomEvent';

const localizer = momentLocalizer(moment);

const BookingCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNum: '',
    phoneNumber: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [bookingStatus, setBookingStatus] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/bookings`)
      .then((response) => response.json())
      .then((data) => {
        const formattedEvents = data.map((event) => ({
          ...event,
          start: new Date(event.date),
          end: new Date(event.date),
          title: `${event.firstName} ${event.lastName}`,
        }));
        setEvents(formattedEvents);
      })
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    fetch(`${API_URL}/api/bookings/check/${start.toISOString().split('T')[0]}`)
      .then((response) => response.json())
      .then((data) => {
        setBookingStatus(data);
        const dayBooking = data.some(booking => booking.time_slot === 'day');
        const nightBooking = data.some(booking => booking.time_slot === 'night');

        if (dayBooking && nightBooking) {
          alert('This date is fully booked.');
        } else {
          setShowModal(true);
        }
      })
      .catch((error) => console.error('Error checking booking status:', error));
  };

  const handleTimeSelection = (time) => {
    const numOfBusiness = localStorage.getItem('userId');
    if (!numOfBusiness) {
      alert('Business ID not found.');
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.idNum || !formData.phoneNumber) {
      alert('Please fill in all the form fields.');
      return;
    }

    fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_id: numOfBusiness,
        date: selectedDate.toISOString().split('T')[0],
        time_slot: time,
        ...formData,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Booking created successfully') {
          setEvents((prevEvents) => [
            ...prevEvents,
            {
              ...formData,
              start: new Date(selectedDate),
              end: new Date(selectedDate),
              title: `${formData.firstName} ${formData.lastName}`,
              time_slot: time,
            },
          ]);
          setShowModal(false);
          setFormData({ firstName: '', lastName: '', idNum: '', phoneNumber: '' });
          setSelectedDate(null);
        } else {
          alert(data.message);
        }
      })
      .catch((error) => console.error('Error storing date selection:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="booking-calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        defaultView="month"
        views={['month', 'agenda']}
        components={{
          agenda: {
            event: CustomEvent,
            time: ()=>null, // Use the custom agenda time component
          },
          toolbar: (props) => (
            <div className="rbc-toolbar">
              <span className="rbc-btn-group">
                <button type="button" onClick={() => props.onNavigate('PREV')}>Back</button>
                <button type="button" onClick={() => props.onNavigate('TODAY')}>Today</button>
                <button type="button" onClick={() => props.onNavigate('NEXT')}>Next</button>
              </span>
              <span className="rbc-toolbar-label">{props.label}</span>
              <span className="rbc-btn-group">
                <button type="button" onClick={() => props.onView('month')}>Month</button>
                <button type="button" onClick={() => props.onView('agenda')}>Agenda</button>
              </span>
            </div>
          ),
        }}
        style={{ height: 500 }}
      />
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Select Time Slot for {moment(selectedDate).format('MMMM Do YYYY')}</h3>
            <button
              onClick={() => handleTimeSelection('day')}
              disabled={bookingStatus.some(booking => booking.time_slot === 'day')}
            >
              Day
            </button>
            <button
              onClick={() => handleTimeSelection('night')}
              disabled={bookingStatus.some(booking => booking.time_slot === 'night')}
            >
              Night
            </button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
      {selectedDate && showModal && (
        <form className="date-form">
          <h3>Selected Date: {moment(selectedDate).format('MMMM Do YYYY')}</h3>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>ID Number</label>
            <input
              type="text"
              name="idNum"
              value={formData.idNum}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default BookingCalendar;
