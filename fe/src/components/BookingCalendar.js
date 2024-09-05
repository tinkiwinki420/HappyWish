import moment from "moment";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { API_URL } from "../constans";
import "../styles/BookingCalendar.css";
import CustomEvent from "./CustomEvent";

const localizer = momentLocalizer(moment);

const BookingCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNum: "",
    phoneNumber: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [bookingStatus, setBookingStatus] = useState([]);
  const [edit, setEdit] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    const businessId = localStorage.getItem("userId");
    if (businessId) {
      fetch(`${API_URL}/api/bookings/business/${businessId}`)
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
        .catch((error) => console.error("Error fetching events:", error));
    }
  }, []);

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    fetch(`${API_URL}/api/bookings/check/${start.toISOString().split("T")[0]}`)
      .then((response) => response.json())
      .then((data) => {
        setBookingStatus(data);
        const dayBooking = data.some((booking) => booking.time_slot === "day");
        const nightBooking = data.some(
          (booking) => booking.time_slot === "night"
        );

        if (dayBooking && nightBooking) {
          if (
            window.confirm(
              "This date is fully booked. Do you want to delete a booking?"
            )
          ) {
            setEdit(true);
            setDeleteMode(true);
            setShowModal(true);
          } else {
            setShowModal(false);
          }
        } else {
          setEdit(false);
          setDeleteMode(false);
          setShowModal(true);
        }
      })
      .catch((error) => console.error("Error checking booking status:", error));
  };

  const handleTimeSelection = (time) => {
    setSelectedTimeSlot(time);
    if (deleteMode) {
      handleDelete(time);
    }
  };

  const handleDelete = (timeSlot) => {
    const selectedDateString = selectedDate.toISOString().split("T")[0];
    fetch(`${API_URL}/api/bookings/${selectedDateString}/${timeSlot}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Booking deleted successfully") {
          setEvents((prevEvents) =>
            prevEvents.filter(
              (event) =>
                !(
                  event.date === selectedDateString &&
                  event.time_slot === timeSlot
                )
            )
          );
          setShowModal(false);
          setSelectedDate(null);
          setSelectedTimeSlot(null);
          setDeleteMode(false);
        } else {
          alert(data.message);
        }
      })
      .catch((error) => console.error("Error deleting booking:", error));
  };

  const handleBooking = () => {
    const numOfBusiness = localStorage.getItem("userId");
    if (!numOfBusiness) {
      alert("Business ID not found.");
      return;
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.idNum ||
      !formData.phoneNumber ||
      !selectedTimeSlot
    ) {
      alert("Please fill in all the form fields and select a time slot.");
      return;
    }

    const bookingData = {
      business_id: numOfBusiness,
      date: selectedDate.toISOString().split("T")[0],
      time_slot: selectedTimeSlot,
      ...formData,
    };

    fetch(`${API_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Booking created successfully") {
          setEvents((prevEvents) => [
            ...prevEvents,
            {
              ...formData,
              start: new Date(selectedDate),
              end: new Date(selectedDate),
              title: `${formData.firstName} ${formData.lastName}`,
              time_slot: selectedTimeSlot,
            },
          ]);
          setShowModal(false);
          setFormData({
            firstName: "",
            lastName: "",
            idNum: "",
            phoneNumber: "",
          });
          setSelectedDate(null);
          setSelectedTimeSlot(null);
        } else {
          alert(data.message);
        }
      })
      .catch((error) => console.error("Error storing date selection:", error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className='booking-calendar-container'>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        defaultView='month'
        views={["month", "agenda"]}
        components={{
          agenda: {
            event: CustomEvent,
            time: () => null, // Use the custom agenda time component
          },
          toolbar: (props) => (
            <div className='rbc-toolbar'>
              <span className='rbc-btn-group'>
                <button type='button' onClick={() => props.onNavigate("PREV")}>
                  Back
                </button>
                <button type='button' onClick={() => props.onNavigate("TODAY")}>
                  Today
                </button>
                <button type='button' onClick={() => props.onNavigate("NEXT")}>
                  Next
                </button>
              </span>
              <span className='rbc-toolbar-label'>{props.label}</span>
              <span className='rbc-btn-group'>
                <button type='button' onClick={() => props.onView("month")}>
                  Month
                </button>
                <button type='button' onClick={() => props.onView("agenda")}>
                  Events
                </button>
              </span>
            </div>
          ),
        }}
        style={{ height: 500 }}
      />
      {showModal && (
        <div className='modal'>
          <div className='modal-content'>
            <h3>
              {deleteMode
                ? `Delete booking for ${moment(selectedDate).format(
                    "MMMM Do YYYY"
                  )}`
                : `Select Time Slot for ${moment(selectedDate).format(
                    "MMMM Do YYYY"
                  )}`}
            </h3>
            {deleteMode ? (
              <div>
                <button onClick={() => handleTimeSelection("day")}>
                  Delete Day Slot
                </button>
                <button onClick={() => handleTimeSelection("night")}>
                  Delete Night Slot
                </button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            ) : (
              <div>
                {(edit ||
                  !bookingStatus.some(
                    (booking) => booking.time_slot === "day"
                  )) && (
                  <button onClick={() => handleTimeSelection("day")}>
                    Day Slot
                  </button>
                )}
                {(edit ||
                  !bookingStatus.some(
                    (booking) => booking.time_slot === "night"
                  )) && (
                  <button onClick={() => handleTimeSelection("night")}>
                    Night Slot
                  </button>
                )}
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            )}
          </div>
          {!deleteMode && (
            <div className='form-content'>
              <h3>Booking Details</h3>
              <form>
                <div>
                  <label>First Name:</label>
                  <input
                    type='text'
                    name='firstName'
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Last Name:</label>
                  <input
                    type='text'
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>ID Number:</label>
                  <input
                    type='text'
                    name='idNum'
                    value={formData.idNum}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Phone Number:</label>
                  <input
                    type='text'
                    name='phoneNumber'
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <button type='button' onClick={handleBooking}>
                  {edit ? "Update" : "Book"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
