import { useEffect } from "react";

const useFetchDatesEffect = (
  userId,
  setCategory,
  setEvents,
  setUserType,
  setHallCapacity,
  setMinGuests,
  setPricePerEvent,
  setRegularMeals,
  setExclusiveMeal
) => {
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
      } catch (error) {
        console.error("Error fetching hall details:", error.message);
        alert("Error fetching hall details. Please try again later.");
      }
    };

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
      }
    };

    const fetchMeals = async () => {
      try {
        const regularMealsResponse = await fetch(
          `/api/meals/regular/user/${userId}`
        );
        const exclusiveMealsResponse = await fetch(
          `/api/meals/exclusive/user/${userId}`
        );

        if (!regularMealsResponse.ok || !exclusiveMealsResponse.ok) {
          throw new Error("Failed to fetch meals");
        }

        const regularMealsData = await regularMealsResponse.json();
        const exclusiveMealsData = await exclusiveMealsResponse.json();

        setRegularMeals(regularMealsData);
        setExclusiveMeal(exclusiveMealsData[0]);
      } catch (error) {
        console.error("Error fetching meals:", error.message);
        alert("Error fetching meals. Please try again later.");
      }
    };

    fetchUserType();
    fetchCategory();
    fetchHallDetails();
    fetchBookedDates();
    fetchMeals();
  }, [userId]);
};

export default useFetchDatesEffect;
