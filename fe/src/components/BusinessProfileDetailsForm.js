import React from "react";

const BusinessProfileDetailsForm = ({
  formData,
  handleInputChange,
  handleSubmit,
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
      <button type='submit'>Save</button>
    </form>
  );
};

export default BusinessProfileDetailsForm;
