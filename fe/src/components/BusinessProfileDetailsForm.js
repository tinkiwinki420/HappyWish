import React from "react";
import '../styles/BusinessProfileDetailsDisplay.css'; // Ensure you link to your CSS file

const category = localStorage.getItem('category');

const BusinessProfileDetailsForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  handleCancel,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label>Business Name:</label>
        <input
          type='text'
          name='businessName'
          value={formData.businessName || ""}
          onChange={handleInputChange}
        />
      </div>
      <div className='form-group'>
        <label>Address:</label>
        <input
          type='text'
          name='address'
          value={formData.address || ""}
          onChange={handleInputChange}
        />
      </div>
      <div className='form-group'>
        <label>Email:</label>
        <input
          type='email'
          name='email'
          value={formData.email || ""}
          onChange={handleInputChange}
        />
      </div>
      
      {/* Conditionally render hall capacity and minimum guests if category is "Hall" */}
      {category === "Hall" && (
        <>
          <div className='form-group'>
            <label>Hall Capacity:</label>
            <input
              type='text'
              name='hallCapacity'
              value={formData.hallCapacity || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className='form-group'>
            <label>Minimum Guests:</label>
            <input
              type='text'
              name='minGuests'
              value={formData.minGuests || ""}
              onChange={handleInputChange}
            />
          </div>
        </>
      )}
      
      <div className='form-group'>
        <label>Price per Event:</label>
        <input
          type='text'
          name='price_per_event'
          value={formData.price_per_event || ""}
          onChange={handleInputChange}
        />
      </div>
      <div className='form-actions'>
          <button type='submit'>Save</button>
          <button type='button' onClick={handleCancel}>
            Cancel
          </button>{" "}
        </div>
    </form>
  );
};

export default BusinessProfileDetailsForm;
