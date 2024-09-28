import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { PayPalButton } from "react-paypal-button-v2";
import { useParams } from "react-router-dom";
import "../styles/Dates.css";
import NavbarBooking from "./NavbarBooking";

const localizer = momentLocalizer(moment);

// Modal Component for displaying meal selection
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <button onClick={onClose} className='modal-close'>
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

const Dates = () => {
  const { userId } = useParams();
  const [category, setCategory] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMealsSelection, setShowMealsSelection] = useState(false);
  const [bookingStatus, setBookingStatus] = useState([]);
  const [userType, setUserType] = useState(null);
  const [numOfPeople, setNumOfPeople] = useState("");
  const [hallCapacity, setHallCapacity] = useState(null);
  const [minGuests, setMinGuests] = useState(null);
  const [exclusiveMeal, setExclusiveMeal] = useState(null);
  const [regularMeals, setRegularMeals] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [pricePerEvent, setPricePerEvent] = useState(0);
  const [advancePayment, setAdvancePayment] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [profit, setProfit] = useState(0); // Initialize profit
  const [useNewPayPalButton, setUseNewPayPalButton] = useState(true);
  const [formData, setFormData] = useState({
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
  useEffect(() => {
    const mealPrice = selectedMeal ? selectedMeal.price : 0;
    calculateTotalPrice(mealPrice);
  }, [numOfPeople, selectedMeal]);
  useEffect(() => {
    const fetchUserType = () => {
      const storedUserType = localStorage.getItem("userType");
      setUserType(storedUserType);
    };

    const fetchCategory = async () => {
      try {
        const response = await fetch(
          `/api/profile/business/${userId}/category`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategory(data.category || "");
      } catch (error) {
        console.error("Error fetching category:", error.message);
        alert("Error fetching category. Please try again later.");
      }
    };

    const fetchHallDetails = async () => {
      try {
        const response = await fetch(
          `/api/bookings/business/${userId}/capacity`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHallCapacity(data.hallCapacity || 0);
        setMinGuests(data.minGuests || 0);
        setPricePerEvent(data.price_per_event || 0);
        setTotalPrice(data.price_per_event || 0);
      } catch (error) {
        console.error("Error fetching hall details:", error.message);
        alert("Error fetching hall details. Please try again later.");
      }
    };

    fetchUserType();
    fetchCategory();
    fetchHallDetails();

    const fetchBookedDates = async () => {
      try {
        const response = await fetch(
          `/api/profile/business/bookings/${userId}/booked-dates`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch booked dates");
        }
        const data = await response.json();
        const formattedEvents = data.bookedDates.map((event) => ({
          start: new Date(event.booking_date),
          end: new Date(event.booking_date),
          title: `Booked: ${event.time_slot}`,
          className:
            event.time_slot === "day" ? "rbc-event-day" : "rbc-event-night",
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching booked dates:", error.message);
        alert("Error fetching booked dates. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookedDates();
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetch(`/api/meals/regular/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setRegularMeals(data);
        })
        .catch((error) => {
          console.error("Error fetching regular meals:", error.message);
          alert("Error fetching regular meals. Please try again later.");
        });

      fetch(`/api/meals/exclusive/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setExclusiveMeal(data[0]);
        })
        .catch((error) => {
          console.error("Error fetching exclusive meal:", error.message);
          alert("Error fetching exclusive meal. Please try again later.");
        });
    }
  }, [userId]);

  const handleSelectSlot = ({ start }) => {
    const now = new Date();
    if (userType === "business") {
      alert("Business users cannot book dates.");
      return;
    }
    if (!userType) {
      alert("You have to sign in first to book a date!");
      return;
    }
    if (start <= now) {
      alert("Please select a future date.");
      return;
    }
    setSelectedDate(start);
    const selectedDateString = start.toISOString().split("T")[0];

    fetch(
      `/api/profile/business/bookings/check/${userId}/${selectedDateString}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data.bookedSlots)) {
          console.error("Invalid response:", data);
          return;
        }
        setBookingStatus(data.bookedSlots);
        const dayBooking = data.bookedSlots.some(
          (booking) => booking.time_slot === "day"
        );
        const nightBooking = data.bookedSlots.some(
          (booking) => booking.time_slot === "night"
        );

        if (dayBooking && nightBooking) {
          alert("This date is fully booked.");
        } else {
          setShowModal(true);
        }
      })
      .catch((error) => {
        console.error("Error checking booking status:", error.message);
        alert("Error checking booking status. Please try again later.");
      });
  };

  const closeForm = () => {
    setSelectedMeal(null); // Reset meal selection
    setTotalPrice(pricePerEvent); // Reset price to just the event price if applicable
    setSelectedDate(null); // Reset selected date
    setSelectedTimeSlot(null); // Reset selected time slot
    setNumOfPeople(0); // Reset number of people
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
    setShowModal(false);
    setShowMealsSelection(false); // Close the meal selection modal if it's open
  };

  const handleMealSelection = (meal) => {
    if (selectedMeal && selectedMeal.id === meal.id) {
      // If the selected meal is clicked again, unselect it
      setSelectedMeal(null);
      setTotalPrice(pricePerEvent);
      setAdvancePayment(pricePerEvent * 0.05); // Reset to just the event price without the meal
    } else {
      // Select the meal and update the total price
      setSelectedMeal(meal);
      calculateTotalPrice(meal.price);
    }
  };

  const calculateTotalPrice = (mealPrice = 0) => {
    const total =
      category === "Hall"
        ? mealPrice * numOfPeople + pricePerEvent
        : pricePerEvent;
    setTotalPrice(total);
    setAdvancePayment((total * 0.05).toFixed(2)); // Calculate 5% advance payment
    setProfit((total * 0.05).toFixed(2)); // Calculate 5% profit and update the state
  };

  const handleTimeSelection = (time) => {
    setSelectedTimeSlot(time);
    if (category === "Hall") {
      if (
        !numOfPeople ||
        numOfPeople < minGuests ||
        numOfPeople > hallCapacity
      ) {
        alert(
          `The number of people must be between ${minGuests} and ${hallCapacity}.`
        );
        return;
      }
      setShowModal(false);
      setShowMealsSelection(true);
    } else {
      setTotalPrice(pricePerEvent); // Set total price for non-Hall categories
      setShowModal(false);
      handleBooking(time); // Ensure the time slot is sent directly
    }
  };

  const handleBooking = (timeSlot, skipMeal = false) => {
    if (!timeSlot) {
      alert("Please select a time slot before booking.");
      return;
    }

    const businessId = userId;
    const remainingBalance = (totalPrice - advancePayment).toFixed(2);
    let bookingDetails = {
      business_id: businessId,
      user_id: localStorage.getItem("userId"),
      date: selectedDate.toISOString().split("T")[0],
      time_slot: timeSlot,
      num_of_people: category === "Hall" ? numOfPeople : null,
      total_price: totalPrice,
      advance_payment: advancePayment,
      remaining_balance: remainingBalance,
    };

    if (category === "Hall" && !skipMeal) {
      const meal_image = selectedMeal ? `/uploads/${selectedMeal.image}` : null;

      bookingDetails = {
        ...bookingDetails,
        meal_name: selectedMeal?.name || null,
        meal_price: selectedMeal?.price || null,
        meal_image: meal_image || null,
      };
    }

    // Step 1: Create PayPal Order
    fetch(`/api/paypal/create-paypal-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalPrice }),
    })
      .then((response) => response.json())
      .then((data) => {
        const orderID = data.id;

        // Step 2: Render PayPal Button and Capture Order
        window.paypal
          .Buttons({
            createOrder: function () {
              return orderID;
            },
            onApprove: function (data, actions) {
              return actions.order.capture().then(function (details) {
                // Payment successful, complete the booking
                alert(
                  "Transaction completed by " + details.payer.name.given_name
                );

                // Capture the payment
                fetch(`/api/paypal/capture-paypal-order`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderID: data.orderID }),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    console.log("Payment captured:", data);
                    // Proceed with the booking process
                    fetch(`/api/profile/business/bookings/regular`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(bookingDetails),
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        if (data.message === "Booking created successfully") {
                          alert("Booking successfully created!");
                          closeForm(); // Reset the form after booking
                        } else {
                          alert(data.message);
                        }
                      })
                      .catch((error) => {
                        console.error(
                          "Error storing date selection:",
                          error.message
                        );
                        alert(
                          "Error storing date selection. Please try again later."
                        );
                      });
                  })
                  .catch((err) => {
                    console.error("Error capturing payment:", err);
                  });
              });
            },
            onError: function (err) {
              console.error("PayPal error:", err);
              alert("Something went wrong with the payment. Please try again.");
            },
          })
          .render("#paypal-button-container"); // Replace with the actual container ID
      })
      .catch((error) => {
        console.error("Error creating PayPal order:", error.message);
        alert("Error creating PayPal order. Please try again later.");
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const dayBooking = bookingStatus.some(
    (booking) => booking.time_slot === "day"
  );
  const nightBooking = bookingStatus.some(
    (booking) => booking.time_slot === "night"
  );

  return (
    <div className='dates'>
      <NavbarBooking userId={userId} />
      <h2>Booked Dates</h2>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        defaultView='month'
        views={["month", "agenda"]}
        style={{ height: 500 }}
        components={{
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
            </div>
          ),
        }}
      />
      {showModal && (
        <div className='modal'>
          <div className='modal-content'>
            <h3>
              Select Time Slot for {moment(selectedDate).format("MMMM Do YYYY")}
            </h3>
            {category === "Hall" && (
              <div>
                <label>Number of People:</label>
                <input
                  type='number'
                  value={numOfPeople}
                  onChange={(e) => setNumOfPeople(e.target.value)}
                  min={minGuests || 1}
                  max={hallCapacity || 1}
                  required
                />
              </div>
            )}
            {!dayBooking && (
              <button onClick={() => handleTimeSelection("day")}>
                Book Day Slot
              </button>
            )}
            {!nightBooking && (
              <button onClick={() => handleTimeSelection("night")}>
                Book Night Slot
              </button>
            )}
            <h4>Price per Event: ${pricePerEvent}</h4>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <Modal
        isOpen={showMealsSelection}
        onClose={() => setShowMealsSelection(false)}
      >
        <h3>Select a Meal for Your Event</h3>
        <div className='meals-container'>
          <div className='meals-container'>
            <h4>Exclusive Meals</h4>
            <ul>
              {exclusiveMeal && (
                <li
                  key={exclusiveMeal.id}
                  className={`meal-option ${
                    selectedMeal?.id === exclusiveMeal.id ? "selected" : ""
                  }`}
                  onClick={() => handleMealSelection(exclusiveMeal)}
                >
                  <input
                    type='radio'
                    name='meal'
                    value={exclusiveMeal.id}
                    checked={selectedMeal?.id === exclusiveMeal.id}
                    onChange={() => handleMealSelection(exclusiveMeal)}
                  />
                  {exclusiveMeal.name} - ${exclusiveMeal.price}
                  <img
                    src={exclusiveMeal.image}
                    alt={exclusiveMeal.name}
                    className='meal-photo'
                  />
                </li>
              )}
            </ul>

            <h4>Regular Meals</h4>
            <ul>
              {regularMeals.map((meal) => (
                <li
                  key={meal.id}
                  className={`meal-option ${
                    selectedMeal?.id === meal.id ? "selected" : ""
                  }`}
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
        </div>
        <h4>Total Price: ${totalPrice}</h4>
        <h4>Advance Payment (5%): ${advancePayment}</h4>
        <div id='paypal-button-container'>
          {useNewPayPalButton ? (
            <PayPalScriptProvider
              options={{ "client-id": "Abh--yzg5qvXE2RdVttNvIaka_bqq0usPz38CZJV4CgXV9i11QdadmPsL6-XrRY9lybpCKDWnZ9cDP6s" }}
            >
              <PayPalButtons
                amount={profit} // Use the profit instead of totalPrice
                onSuccess={(details, data) => {
                  alert(
                    "Transaction completed by " + details.payer.name.given_name
                  );
                  handleBooking(selectedTimeSlot);
                }}
                onError={(err) => {
                  console.error("PayPal error:", err);
                  alert("An error occurred with the PayPal transaction. Please try again.");
                }}
                onCancel={() => {
                  alert("Payment process was canceled.");
                }}
                options={{
                  clientId: "Abh--yzg5qvXE2RdVttNvIaka_bqq0usPz38CZJV4CgXV9i11QdadmPsL6-XrRY9lybpCKDWnZ9cDP6s", // Replace with your actual PayPal client ID
                  currency: "USD",
                }}
              />
            </PayPalScriptProvider>
          ) : (
            <PayPalButton
              amount={profit} // Use the profit instead of totalPrice
              onSuccess={(details, data) => {
                alert(
                  "Transaction completed by " + details.payer.name.given_name
                );
                handleBooking(selectedTimeSlot);
              }}
              options={{
                clientId: "YOUR_PAYPAL_CLIENT_ID", // Replace with your actual PayPal client ID
                currency: "USD",
              }}
            />
          )}
        </div>

        <button type='button' onClick={closeForm}>
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default Dates;
