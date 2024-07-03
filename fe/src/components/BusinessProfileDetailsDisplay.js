import React from 'react';

const BusinessProfileDetailsDisplay = ({ userDetails, setEditing }) => {
  return (
    <div>
      <p><strong>Business Name:</strong> {userDetails.businessName}</p>
      <p><strong>Address:</strong> {userDetails.address}</p>
      <p><strong>Email:</strong> {userDetails.email}</p>
      <p><strong>Category:</strong> {userDetails.category}</p>
      <button onClick={() => setEditing(true)}>Edit</button>
    </div>
  );
};

export default BusinessProfileDetailsDisplay;
