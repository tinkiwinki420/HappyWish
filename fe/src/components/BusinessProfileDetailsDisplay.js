import React from 'react';
import '../styles/BusinessProfileDetailsDisplay.css'; // Ensure you link to your CSS file

const BusinessProfileDetailsDisplay = ({ userDetails, setEditing }) => {
  return (
    <div className="details-container">
      <div className="details-card">
        <div className="details-section">
          <h2>Business Information</h2>
          <p><strong>Business Name:</strong> {userDetails.businessName}</p>
          <p><strong>Address:</strong> {userDetails.address}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>Category:</strong> {userDetails.category}</p>
        </div>
        <button className="edit-button" onClick={() => setEditing(true)}>Edit</button>
      </div>
    </div>
  );
};

export default BusinessProfileDetailsDisplay;
