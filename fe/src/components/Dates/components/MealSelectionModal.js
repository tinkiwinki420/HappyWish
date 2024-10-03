import React from "react";
import Modal from "./Modal"; // Assuming Modal is a basic modal component

const MealSelectionModal = ({
  showMealsSelection,
  regularMeals,
  exclusiveMeal,
  selectedMeal,
  handleMealSelection,
  totalPrice,
  advancePayment,
  handleBooking,
  closeForm,
}) => {
  return (
    <Modal isOpen={showMealsSelection} onClose={closeForm}>
      <h3>Select a Meal for Your Event</h3>
      <div className="meals-container">
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
                type="radio"
                name="meal"
                value={exclusiveMeal.id}
                checked={selectedMeal?.id === exclusiveMeal.id}
                onChange={() => handleMealSelection(exclusiveMeal)}
              />
              {exclusiveMeal.name} - ${exclusiveMeal.price}
              <img
                src={exclusiveMeal.image}
                alt={exclusiveMeal.name}
                className="meal-photo"
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
                type="radio"
                name="meal"
                value={meal.id}
                checked={selectedMeal?.id === meal.id}
                onChange={() => handleMealSelection(meal)}
              />
              {meal.name} - ${meal.price}
              <img
                src={meal.image}
                alt={meal.name}
                className="meal-photo"
              />
            </li>
          ))}
        </ul>
      </div>
      <h4>Total Price: ${totalPrice}</h4>
      <h4>Advance Payment (5%): ${advancePayment}</h4>
      <button onClick={() => handleBooking()}>Confirm and Book</button>
      <button type="button" onClick={closeForm}>Cancel</button>
    </Modal>
  );
};

export default MealSelectionModal;
