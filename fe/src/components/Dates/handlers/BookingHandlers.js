export const handleMealSelection = ({
  meal,
  selectedMeal,
  setSelectedMeal,
  setTotalPrice,
  pricePerEvent,
  setAdvancePayment,
  numOfPeople,  // Ensure numOfPeople is passed correctly
}) => {
  // Convert numOfPeople to a valid number, default to 1 if invalid
  const validNumOfPeople = Number(numOfPeople) > 0 ? Number(numOfPeople) : 1;
  const mealPrice = meal.price || 0;

  console.log("Meal Selection:", { mealPrice, validNumOfPeople, pricePerEvent });

  if (selectedMeal && selectedMeal.id === meal.id) {
    // Deselect the meal

    console.log("validNumOfPeople1:"+validNumOfPeople);
    console.log("pricePerEvent:"+pricePerEvent);
    setSelectedMeal(null);
    setTotalPrice(pricePerEvent); // Only event price is considered
    setAdvancePayment(pricePerEvent * 0.05); // Calculate 5% advance payment
  } else {
    // Select the meal and calculate the total price and advance payment
    setSelectedMeal(meal);
    const total = mealPrice * validNumOfPeople + pricePerEvent;
    setTotalPrice(total); // Calculate total price
    console.log("total:"+total);
    console.log("validNumOfPeople2:"+validNumOfPeople);
    console.log("pricePerEvent:"+pricePerEvent);
    setAdvancePayment((total * 0.05).toFixed(2)); // 5% advance payment
  }
};

export const handleTimeSelection = ({
  time,
  category,
  numOfPeople,
  minGuests,
  hallCapacity,
  setShowModal,
  setShowMealsSelection,
  setTotalPrice,
  pricePerEvent,
  handleBooking,
}) => {
  const validNumOfPeople = Number(numOfPeople) > 0 ? Number(numOfPeople) : 1;

  console.log("Time Selection:", { validNumOfPeople, minGuests, hallCapacity });

  if (category === "Hall") {
    // Validate the number of people
    if (validNumOfPeople < minGuests || validNumOfPeople > hallCapacity) {
      alert(`The number of people must be between ${minGuests} and ${hallCapacity}.`);
      return;
    }
    setShowModal(false); // Close time selection modal
    setShowMealsSelection(true); // Show meal selection modal
  } else {
    // Non-Hall booking
    setTotalPrice(pricePerEvent); // Set total price as event price
    setShowModal(false); // Close modal
    handleBooking(time);
  }
};

export const handleBooking = ({
  timeSlot,
  selectedMeal,
  category,
  numOfPeople,
  userId,
  selectedDate,
  totalPrice,
  advancePayment,
  closeForm,
}) => {
  const validNumOfPeople = Number(numOfPeople) > 0 ? Number(numOfPeople) : 1;

  console.log("Booking:", { validNumOfPeople, totalPrice, advancePayment });

  if (!timeSlot) {
    alert("Please select a time slot before booking.");
    return;
  }

  // Calculate remaining balance
  const remainingBalance = (totalPrice - advancePayment).toFixed(2);
  
  // Create booking details object
  let bookingDetails = {
    business_id: userId,
    user_id: localStorage.getItem("userId"),
    date: selectedDate.toISOString().split("T")[0],
    time_slot: timeSlot,
    num_of_people: category === "Hall" ? validNumOfPeople : null,
    total_price: totalPrice,
    advance_payment: advancePayment,
    remaining_balance: remainingBalance,
  };

  // Include meal details if Hall booking
  if (category === "Hall" && selectedMeal) {
    bookingDetails = {
      ...bookingDetails,
      meal_name: selectedMeal.name,
      meal_price: selectedMeal.price,
      meal_image: `/uploads/${selectedMeal.image}`,
    };
  }

  // Send booking details to the server
  fetch(`/api/profile/business/bookings/regular`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingDetails),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Booking created successfully") {
        alert("Booking successfully created!");
        closeForm(); // Reset form after booking
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error("Error storing date selection:", error.message);
      alert("Error storing date selection. Please try again later.");
    });
};
