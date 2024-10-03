import React from 'react';

// Define sixteenYearsAgo
const today = new Date();
const sixteenYearsAgo = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate()).toISOString().split('T')[0];

const ProfileDetailsForm = ({ formData, handleInputChange, handleSubmit, handleCancel }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Number:</label>
        <input
          type="text"
          name="number"
          value={formData.number || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob || ''}
          max={sixteenYearsAgo}  // User must be at least 16 years old
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Badge (optional):</label> {/* New input for badge */}
        <input
          type="text"
          name="badge"
          value={formData.badge || ''}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Save</button>
      <button type="button" onClick={handleCancel}>Cancel</button> {/* Cancel button */}
    </form>
  );
};

export default ProfileDetailsForm;
