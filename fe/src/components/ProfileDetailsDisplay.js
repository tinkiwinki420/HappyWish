import React from 'react';

const ProfileDetailsDisplay = ({ userDetails, setEditing }) => {
  return (
    <div>
      <p><strong>First Name:</strong> {userDetails.firstName}</p>
      <p><strong>Last Name:</strong> {userDetails.lastName}</p>
      <p><strong>ID:</strong> {userDetails.id}</p>
      <p><strong>Number:</strong> {userDetails.number}</p>
      <p><strong>Address:</strong> {userDetails.address}</p>
      <p><strong>Date of Birth:</strong> {userDetails.dob}</p>
      <p><strong>Email:</strong> {userDetails.email}</p>
      <p><strong>Badge:</strong> {userDetails.badge || 'N/A'}</p>
      <button onClick={() => setEditing(true)}>Edit</button>
    </div>
  );
};

export default ProfileDetailsDisplay;
