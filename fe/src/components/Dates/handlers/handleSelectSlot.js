export const handleSelectSlot = ({ start, userType, setSelectedDate, setBookingStatus, setShowModal, userId }) => {
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
  
    fetch(`/api/profile/business/bookings/check/${userId}/${selectedDateString}`)
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data.bookedSlots)) {
          console.error("Invalid response:", data);
          return;
        }
        setBookingStatus(data.bookedSlots);
        const dayBooking = data.bookedSlots.some((booking) => booking.time_slot === "day");
        const nightBooking = data.bookedSlots.some((booking) => booking.time_slot === "night");
  
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
  