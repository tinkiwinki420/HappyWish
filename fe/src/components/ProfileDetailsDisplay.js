import React from "react";
import "../styles/Profile.css"; // Link to your CSS file

const ProfileDetailsDisplay = ({ userDetails, setEditing }) => {
  // Format the date of birth to show just the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // This will show the date in MM/DD/YYYY format by default
  };

  return (
    <div>
      <p>
        <strong>First Name:</strong> {userDetails.firstName}
      </p>
      <p>
        <strong>Last Name:</strong> {userDetails.lastName}
      </p>
      <p>
        <strong>ID:</strong> {userDetails.id}
      </p>
      <p>
        <strong>Number:</strong> {userDetails.number}
      </p>
      <p>
        <strong>Address:</strong> {userDetails.address}
      </p>
      <p>
        <strong>Date of Birth:</strong> {formatDate(userDetails.dob)}
      </p>{" "}
      <p>
        <strong>Email:</strong> {userDetails.email}
      </p>
      <p>
        <strong>Badge:</strong> {userDetails.badge || "N/A"}
      </p>
      <button onClick={() => setEditing(true)}>Edit</button>
    </div>
  );
};

export default ProfileDetailsDisplay;
