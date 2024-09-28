import React from "react";
import Modal from "./Modal"; // Assuming Modal is a basic modal component

const TimeSlotModal = ({
  showModal,
  category,
  selectedDate,
  dayBooking,
  nightBooking,
  numOfPeople,
  setNumOfPeople,
  minGuests,
  hallCapacity,
  pricePerEvent,
  handleTimeSelection,
  closeModal,
}) => {
  return (
    <Modal isOpen={showModal} onClose={closeModal}>
      <h3>Select Time Slot for {selectedDate ? selectedDate.toLocaleDateString() : "N/A"}</h3>
      {category === "Hall" && (
        <div>
          <label>Number of People:</label>
          <input
            type="number"
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
      <button onClick={closeModal}>Cancel</button>
    </Modal>
  );
};

export default TimeSlotModal;
