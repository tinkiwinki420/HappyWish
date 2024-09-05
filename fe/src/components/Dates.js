/* eslint-disable no-unused-vars */
// src/components/Dates.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/BookingCalendar.css';
import NavbarBooking from './NavbarBooking';
import '../styles/Dates.css';

const localizer = momentLocalizer(moment);

const Dates = () => {
  const { userId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingStatus, setBookingStatus] = useState([]);

  const userType = localStorage.getItem('userType'); // Get the user type from localStorage
  const loggedUserId = localStorage.getItem('userId'); // Get the logged-in user's ID

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await fetch(`/api/profile/business/bookings/${userId}/booked-dates`);
        if (!response.ok) {
          throw new Error('Failed to fetch booked dates');
        }
        const data = await response.json();
        console.log("Fetched booked dates:", data);
        const formattedEvents = data.bookedDates.map((event) => ({
          start: new Date(event.booking_date),
          end: new Date(event.booking_date),
          title: `Booked: ${event.time_slot}`,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching booked dates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedDates();
  }, [userId]);

  const handleSelectSlot = ({ start }) => {
    console.log("Selected date:", start);

    const now = new Date();
    if (start <= now) {
      alert('Please select a future date.');
      return;
    }
    setSelectedDate(start);
    const selectedDateString = start.toISOString().split('T')[0];
    console.log("Fetching booking status for:", selectedDateString);

    fetch(`/api/profile/business/bookings/check/${userId}/${selectedDateString}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Booking status:", data);

        if (!Array.isArray(data.bookedSlots)) {
          console.error('Invalid response:', data);
          return;
        }
        setBookingStatus(data.bookedSlots);
        const dayBooking = data.bookedSlots.some(booking => booking.time_slot === 'day');
        const nightBooking = data.bookedSlots.some(booking => booking.time_slot === 'night');

        if (dayBooking && nightBooking) {
          alert('This date is fully booked.');
        } else {
          setShowModal(true);
        }
      })
      .catch((error) => console.error('Error checking booking status:', error));
  };

  const handleTimeSelection = (time) => {
    setSelectedTimeSlot(time);
    handleBooking(time);
  };

  const handleBooking = (timeSlot) => {
    const businessId = userId;

    fetch(`/api/profile/business/bookings/regular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_id: businessId,
        user_id: loggedUserId, // Pass the logged-in user's ID
        date: selectedDate.toISOString().split('T')[0],
        time_slot: timeSlot,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Booking response:", data);
        if (data.message === 'Booking created successfully') {
          setEvents((prevEvents) => [
            ...prevEvents,
            {
              start: new Date(selectedDate),
              end: new Date(selectedDate),
              title: `Booked: ${timeSlot}`,
            },
          ]);
          setShowModal(false);
          setSelectedDate(null);
          setSelectedTimeSlot(null);
        } else {
          alert(data.message);
        }
      })
      .catch((error) => console.error('Error storing date selection:', error));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const dayBooking = bookingStatus.some(booking => booking.time_slot === 'day');
  const nightBooking = bookingStatus.some(booking => booking.time_slot === 'night');

  return (
    <div className="dates">
      <NavbarBooking userId={userId} />
      <h2>Booked Dates</h2>
      <Calendar
        localizer={localizer}
        events={events}
        selectable={userType === 'regular'}
        onSelectSlot={handleSelectSlot}
        defaultView="month"
        views={['month', 'agenda']}
        style={{ height: 500 }}
        components={{
          agenda: {
            event: CustomEvent,
            time: () => null, // Use the custom agenda time component
          },
          toolbar: (props) => (
            <div className="rbc-toolbar">
              <span className="rbc-btn-group">
                <button type="button" onClick={() => props.onNavigate("PREV")}>
                  Back
                </button>
                <button type="button" onClick={() => props.onNavigate("TODAY")}>
                  Today
                </button>
                <button type="button" onClick={() => props.onNavigate("NEXT")}>
                  Next
                </button>
              </span>
            </div>
          ),
        }}
      />
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Select Time Slot for {moment(selectedDate).format('MMMM Do YYYY')}</h3>
            {!dayBooking && (
              <button onClick={() => handleTimeSelection('day')}>
                Day Slot
              </button>
            )}
            {!nightBooking && (
              <button onClick={() => handleTimeSelection('night')}>
                Night Slot
              </button>
            )}
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dates;
