import React, { useEffect, useState } from "react";
import { fetchUserBookings } from "../hooks/FetchUserBookingsHandler"; // Fetch bookings handler
import "../styles/RecentBookings.css"; // Add your styles for this page.

const RecentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      console.error("No user ID found");
      return;
    }

    fetchUserBookings(userId, setBookings); // Fetch the user's bookings
  }, [userId]);

  if (!userId) {
    return <p>Error: No user ID found</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats to a human-readable date without time
  };

  return (
    <div className="recent-bookings-container">
      <h1>Your Recent Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>ID Number</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Total Price</th>
              <th>Paid</th>
              <th>Price Remaining</th>
              <th>Number of People</th>
              <th>Meal Name</th>
              <th>Meal Price</th>
              <th>Meal Photo</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.book_id}>
                <td data-label="First Name">{booking.firstName}</td>
                <td data-label="Last Name">{booking.lastName}</td>
                <td data-label="ID Number">{booking.idNum}</td>
                <td data-label="Phone Number">{booking.phoneNumber}</td>
                <td data-label="Email">{booking.email}</td>
                <td data-label="Date">{formatDate(booking.date)}</td>
                <td data-label="Time Slot">{booking.time_slot}</td>
                <td data-label="Total Price">{booking.total_price}</td>
                <td data-label="Paid">{booking.paid}</td>
                <td data-label="Price Remaining">{booking.price_remaining}</td>
                <td data-label="Number of People">{booking.num_of_people}</td>

                {/* Check if meal_name and meal_price are available */}
                <td data-label="Meal Name">
                  {booking.meal_name ? booking.meal_name : <span>No Meal</span>}
                </td>
                <td data-label="Meal Price">
                  {booking.meal_price ? booking.meal_price : <span>No Price</span>}
                </td>

                {/* Check if meal_photo is available */}
                <td data-label="Meal Photo">
                  {booking.meal_photo ? (
                    <img src={booking.meal_photo} alt="Meal" style={{ width: "100px" }} />
                  ) : (
                    <span>No Photo</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecentBookings;
