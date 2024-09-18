import React from 'react';
import '../styles/Profile.css'; // Link to your CSS file

const ProfileDetailsDisplay = ({ userDetails, setEditing }) => {
  return (
    <div className="details-container">
      <div className="details-card">
        <div className="details-section">
          <h2>Profile Information</h2>
          <p><strong>First Name:</strong> {userDetails.firstName}</p>
          <p><strong>Last Name:</strong> {userDetails.lastName}</p>
          <p><strong>ID:</strong> {userDetails.id}</p>
          <p><strong>Number:</strong> {userDetails.number}</p>
          <p><strong>Address:</strong> {userDetails.address}</p>
          <p><strong>Date of Birth:</strong> {userDetails.dob}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
        </div>
        <button className="edit-button" onClick={() => setEditing(true)}>Edit</button>
      </div>
    </div>
  );
};

export default ProfileDetailsDisplay;
