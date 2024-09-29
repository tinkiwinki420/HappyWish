import React, { useState } from "react";

const Profile = () => {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [password, setPassword] = useState("password");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  const handleUpdate = (e) => {
    e.preventDefault();
    // Handle update logic here, e.g., send data to the server
    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-container">
      <h1 className="profile-header">Profile</h1>
      <form onSubmit={handleUpdate} className="profile-form">
        <div className="profile-form-group">
          <label className="profile-label">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="profile-input"
          />
        </div>
        <div className="profile-form-group">
          <label className="profile-label">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="profile-input"
          />
        </div>
        <div className="profile-form-group">
          <label className="profile-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="profile-input"
          />
        </div>
        <div className="profile-form-group">
          <label className="profile-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="profile-input"
          />
        </div>
        <div className="profile-form-group">
          <label className="profile-label">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="profile-select"
          >
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        <button type="submit" className="profile-button">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
