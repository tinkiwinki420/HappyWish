export const closeForm = ({ setSelectedMeal, setTotalPrice, setSelectedDate, setSelectedTimeSlot, setNumOfPeople, setShowModal, setShowMealsSelection, pricePerEvent }) => {
  setSelectedMeal(null);
  setTotalPrice(pricePerEvent);
  setSelectedDate(null);
  setSelectedTimeSlot(null);
  setNumOfPeople(0);
  setShowModal(false);
  setShowMealsSelection(false);
};
