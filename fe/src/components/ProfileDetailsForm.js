import React from 'react';

const ProfileDetailsForm = ({ formData, handleInputChange, handleSubmit }) => {
  // Calculate the date 16 years ago from today
  const today = new Date();
  const sixteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 16)).toISOString().split('T')[0];

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
        <label>ID:</label>
        <input
          type="text"
          name="id"
          value={formData.id || ''}
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
      <button type="submit" className="edit-button">Save</button>
    </form>
  );
};

export default ProfileDetailsForm;
