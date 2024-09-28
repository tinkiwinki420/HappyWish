import moment from "moment";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { API_URL } from "../constans";
import "../styles/BookingCalendar.css";

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
    email: "", // Added email field
    num_of_people: 0,
    totalPrice: 0,
    priceRemaining: 0,
    paid: 0,
  });
  const [exclusiveMeals, setExclusiveMeals] = useState([]);
  const [regularMeals, setRegularMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingStatus, setBookingStatus] = useState([]);
  const [edit, setEdit] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [pricePerEvent, setPricePerEvent] = useState(0); // Initialize with 0
  const [slotDetails, setSlotDetails] = useState(null); // State to store booking details
  const [showDetailsModal, setShowDetailsModal] = useState(false); // New state for details modal

  const category = localStorage.getItem("categoryName");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`${API_URL}/api/bookings/business/${userId}`)
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

      fetch(`${API_URL}/api/meals/regular/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setRegularMeals(data);
        })
        .catch((error) =>
          console.error("Error fetching regular meals:", error)
        );

      fetch(`${API_URL}/api/meals/exclusive/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setExclusiveMeals(data);
        })
        .catch((error) =>
          console.error("Error fetching exclusive meals:", error)
        );

      // Fetch price_per_event
      fetch(`${API_URL}/api/bookings/business/${userId}/capacity`)
        .then((response) => response.json())
        .then((data) => {
          setPricePerEvent(data.price_per_event);
        })
        .catch((error) =>
          console.error("Error fetching price per event:", error)
        );
    }
  }, []);

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setSelectedTimeSlot(null); // Reset the time slot when a new date is selected
    setFormData({
      firstName: "",
      lastName: "",
      idNum: "",
      phoneNumber: "",
      email: "",
      num_of_people: 0,
      totalPrice: 0,
      priceRemaining: 0,
      paid: 0,
    });
    fetch(`${API_URL}/api/bookings/check/${start.toISOString().split("T")[0]}`)
      .then((response) => response.json())
      .then((data) => {
        setBookingStatus(data);
        setShowModal(true);
      })
      .catch((error) => console.error("Error checking booking status:", error));
  };

  const handleMealSelection = (meal) => {
    if (selectedMeal?.id === meal.id) {
      // If the selected meal is already selected, unselect it
      setSelectedMeal(null);
    } else {
      // Otherwise, select the meal
      setSelectedMeal(meal);
    }
  };

  const handleBooking = () => {
    const numOfBusiness = localStorage.getItem("userId");
    if (!numOfBusiness) {
      console.error("Business ID not found.");
      alert("Business ID not found.");
      return;
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.idNum ||
      !formData.phoneNumber ||
      !formData.email ||
      !selectedTimeSlot
    ) {
      console.error("All fields are required.");
      alert("Please fill in all the form fields and select a time slot.");
      return;
    }

    const bookingData = {
      business_id: numOfBusiness,
      date: selectedDate.toISOString().split("T")[0],
      time_slot: selectedTimeSlot,
      ...formData,
      meal_name: selectedMeal?.name || formData.meal_name,
      meal_price: selectedMeal?.price || formData.meal_price,
      meal_photo: selectedMeal?.image || formData.meal_photo,
      total: formData.totalPrice,
      price_remaining: formData.priceRemaining,
      paid: formData.paid,
    };

    console.log("Sending booking data:", bookingData);

    fetch(`${API_URL}/api/bookings`, {
      method: edit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);

        // Adjusted condition to recognize the new success message
        if (data.message.includes("Booking updated successfully")) {
          console.log("Update successful, closing modals...");

          // Update the events state to reflect changes
          setEvents((prevEvents) => [
            ...prevEvents.filter((event) => event.id !== data.id),
            {
              ...formData,
              start: new Date(selectedDate),
              end: new Date(selectedDate),
              title: `${formData.firstName} ${formData.lastName}`,
              time_slot: selectedTimeSlot,
            },
          ]);
          // Close the modals after successful update
          closeForm(); // Close the booking modal
          setShowDetailsModal(false); // Close the show details modal
        } else {
          console.error("Update failed with message:", data.message);
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error storing date selection:", error);
      });
  };

  const handleDelete = (timeSlot) => {
    if (
      window.confirm(
        `Are you sure you want to delete the booking for ${timeSlot} slot on ${moment(
          selectedDate
        ).format("MMMM Do YYYY")}?`
      )
    ) {
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
            closeForm();
          } else {
            alert(data.message);
          }
        })
        .catch((error) => console.error("Error deleting booking:", error));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedFormData = { ...prevData, [name]: value };

      if (
        name === "totalPrice" ||
        name === "paid" ||
        name === "num_of_people"
      ) {
        // Calculate total price when num_of_people, totalPrice, or paid changes
        if (name === "num_of_people" && selectedMeal) {
          const newTotalPrice =
            selectedMeal.price * updatedFormData.num_of_people +
            parseFloat(pricePerEvent); // Add pricePerEvent to total
          updatedFormData.totalPrice = newTotalPrice;
          updatedFormData.priceRemaining = newTotalPrice - updatedFormData.paid;
        } else {
          const priceRemaining =
            updatedFormData.totalPrice - updatedFormData.paid;
          updatedFormData.priceRemaining =
            priceRemaining > 0 ? priceRemaining : 0;
        }
      }

      return updatedFormData;
    });
  };

  const handleShowDetails = (timeSlot) => {
    console.log("handleShowDetails triggered for:", timeSlot); // Debugging
    localStorage.setItem("slot", timeSlot);
    const selectedDateString = selectedDate.toISOString().split("T")[0];

    fetch(`${API_URL}/api/bookings/${selectedDateString}/${timeSlot}/details`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data); // Debugging

        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          idNum: data.idNum,
          phoneNumber: data.phoneNumber,
          email: data.email,
          num_of_people: data.num_of_people || 0,
          totalPrice: data.total_price || 0,
          priceRemaining: data.price_remaining || 0,
          paid: data.paid || 0,
        });

        // Correct the image path
        let imagePath = data.meal_photo;
        if (imagePath) {
          // Ensure the path starts correctly
          if (!imagePath.startsWith("/uploads/")) {
            imagePath = `/uploads/${imagePath.replace(/^\/+/, "")}`;
          }
        }

        setSelectedMeal({
          name: data.meal_name,
          price: data.meal_price,
          image: imagePath,
        });

        setShowDetailsModal(true); // Show the new details modal
        console.log("showDetailsModal state set to true"); // Debugging
      })
      .catch((error) => console.error("Error fetching slot details:", error));
  };

  const renderTimeSlotButtons = () => {
    const dayBooking = bookingStatus.some(
      (booking) => booking.time_slot === "day"
    );
    const nightBooking = bookingStatus.some(
      (booking) => booking.time_slot === "night"
    );

    return (
      <div className='time-slot-buttons'>
        {!dayBooking && (
          <button onClick={() => handleTimeSelection("day")}>
            Book Day Slot
          </button>
        )}
        {dayBooking && (
          <>
            <button onClick={() => handleShowDetails("day")}>
              Show Day Slot Details
            </button>
            <button onClick={() => handleDelete("day")}>Delete Day Slot</button>
          </>
        )}
        {!nightBooking && (
          <button onClick={() => handleTimeSelection("night")}>
            Book Night Slot
          </button>
        )}
        {nightBooking && (
          <>
            <button onClick={() => handleShowDetails("night")}>
              Show Night Slot Details
            </button>
            <button onClick={() => handleDelete("night")}>
              Delete Night Slot
            </button>
          </>
        )}
        <button onClick={closeForm}>Cancel</button>
      </div>
    );
  };

  const handleOpenUpdateModal = () => {
    setEdit(true); // Enable edit mode
    setShowDetailsModal(false); // Close the details modal
    const timeSlot = localStorage.getItem("slot");
    // Set the time slot to the already booked slot
    setSelectedTimeSlot(timeSlot);
    // Open the booking modal with pre-filled details
    setShowModal(true);
  };

  const closeForm = () => {
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setFormData({
      firstName: "",
      lastName: "",
      idNum: "",
      phoneNumber: "",
      email: "",
      num_of_people: 0,
      totalPrice: 0,
      priceRemaining: 0,
      paid: 0,
    });
    setSelectedMeal(null);
    setShowModal(false);
    setEdit(false); // Reset edit mode
    setShowDetailsModal(false); // Ensure the details modal is closed
  };
  const handleTimeSelection = (time) => {
    setSelectedTimeSlot(time);
    setEdit(false);
    setDeleteMode(false);
    setShowDetailsModal(false);

    // Reset the form data and selected meal when starting a new booking
    setFormData({
      firstName: "",
      lastName: "",
      idNum: "",
      phoneNumber: "",
      email: "",
      num_of_people: 0,
      totalPrice: 0,
      priceRemaining: 0,
      paid: 0,
    });
    setSelectedMeal(null);

    // Open the booking modal for new booking, not update
    setShowModal(true);
  };

  // Inside the modal form
  return (
    <div className='booking-calendar-container'>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        defaultView='month'
        views={["month", "agenda"]}
        style={{ height: 500 }}
      />

      {showModal && (
        <div className='modal'>
          <div className='modal-content'>
            <h3>{`Booking for ${moment(selectedDate).format(
              "MMMM Do YYYY"
            )}`}</h3>
            {selectedTimeSlot || edit ? ( // Skip slot selection if editing
              <div className='form-content'>
                <h3>Booking Details</h3>
                <form>
                  <div className='form-group'>
                    <label>First Name:</label>
                    <input
                      type='text'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='form-group'>
                    <label>Last Name:</label>
                    <input
                      type='text'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='form-group'>
                    <label>ID Number:</label>
                    <input
                      type='text'
                      name='idNum'
                      value={formData.idNum}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='form-group'>
                    <label>Phone Number:</label>
                    <input
                      type='text'
                      name='phoneNumber'
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='form-group'>
                    <label>Email:</label>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  {category === "Hall" && (
                    <>
                      <div className='form-group'>
                        <label>Number of People:</label>
                        <input
                          type='number'
                          name='num_of_people'
                          value={formData.num_of_people}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className='meal-selection'>
                        <h3>Select a Meal</h3>

                        <h4>Exclusive Meals</h4>
                        <ul>
                          {exclusiveMeals.map((meal) => (
                            <li
                              key={meal.id}
                              onClick={() => handleMealSelection(meal)}
                            >
                              <input
                                type='radio'
                                name='meal'
                                value={meal.id}
                                checked={selectedMeal?.id === meal.id}
                                onChange={() => handleMealSelection(meal)}
                              />
                              {meal.name} - ${meal.price}
                              <img
                                src={meal.image}
                                alt={meal.name}
                                className='meal-photo'
                              />
                            </li>
                          ))}
                        </ul>

                        <h4>Regular Meals</h4>
                        <ul>
                          {regularMeals.map((meal) => (
                            <li
                              key={meal.id}
                              onClick={() => handleMealSelection(meal)}
                            >
                              <input
                                type='radio'
                                name='meal'
                                value={meal.id}
                                checked={selectedMeal?.id === meal.id}
                                onChange={() => handleMealSelection(meal)}
                              />
                              {meal.name} - ${meal.price}
                              <img
                                src={meal.image}
                                alt={meal.name}
                                className='meal-photo'
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className='form-group'>
                        <label>Total Price:</label>
                        <input
                          type='number'
                          name='totalPrice'
                          value={formData.totalPrice}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className='form-group'>
                        <label>Paid:</label>
                        <input
                          type='number'
                          name='paid'
                          value={formData.paid}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className='form-group'>
                        <label>Price Remaining:</label>
                        <input
                          type='number'
                          name='priceRemaining'
                          value={formData.priceRemaining}
                          readOnly
                        />
                      </div>
                    </>
                  )}
                  <div className='form-actions'>
                    <button type='button' onClick={handleBooking}>
                      {edit ? "Update" : "Book"}
                    </button>
                    <button type='button' onClick={closeForm}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              renderTimeSlotButtons()
            )}
          </div>
        </div>
      )}

      {showDetailsModal && (
        <div className='modal'>
          <div className='modal-content'>
            <h3>{`Details for ${moment(selectedDate).format(
              "MMMM Do YYYY"
            )}`}</h3>
            <div className='form-content'>
              <h3>Booking Details</h3>
              <form>
                <div className='form-group'>
                  <label>First Name:</label>
                  <input
                    type='text'
                    name='firstName'
                    value={formData.firstName}
                    readOnly
                  />
                </div>
                <div className='form-group'>
                  <label>Last Name:</label>
                  <input
                    type='text'
                    name='lastName'
                    value={formData.lastName}
                    readOnly
                  />
                </div>
                {/* Conditionally render the ID Number input */}
                {!edit && (
                  <div className='form-group'>
                    <label>ID Number:</label>
                    <input
                      type='text'
                      name='idNum'
                      value={formData.idNum}
                      readOnly
                    />
                  </div>
                )}
                <div className='form-group'>
                  <label>Phone Number:</label>
                  <input
                    type='text'
                    name='phoneNumber'
                    value={formData.phoneNumber}
                    readOnly
                  />
                </div>
                <div className='form-group'>
                  <label>Email:</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    readOnly
                  />
                </div>
                {category === "Hall" && (
                  <>
                    <div className='form-group'>
                      <label>Number of People:</label>
                      <input
                        type='number'
                        name='num_of_people'
                        value={formData.num_of_people}
                        readOnly
                      />
                    </div>
                    <div className='meal-selection'>
                      <h3>Selected Meal</h3>
                      {selectedMeal && (
                        <div className='meal-container'>
                          <p>
                            {selectedMeal.name} - ${selectedMeal.price}
                          </p>
                          <img
                            src={selectedMeal.image}
                            alt={selectedMeal.name}
                            className='meal-photo'
                          />
                        </div>
                      )}
                    </div>
                    <div className='form-group'>
                      <label>Total Price:</label>
                      <input
                        type='number'
                        name='totalPrice'
                        value={formData.totalPrice}
                        readOnly
                      />
                    </div>
                    <div className='form-group'>
                      <label>Paid:</label>
                      <input
                        type='number'
                        name='paid'
                        value={formData.paid}
                        readOnly
                      />
                    </div>
                    <div className='form-group'>
                      <label>Price Remaining:</label>
                      <input
                        type='number'
                        name='priceRemaining'
                        value={formData.priceRemaining}
                        readOnly
                      />
                    </div>
                  </>
                )}
                <div className='form-actions'>
                  <button
                    type='button'
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Close
                  </button>
                  <button type='button' onClick={() => handleOpenUpdateModal()}>
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
