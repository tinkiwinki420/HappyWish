import React from 'react';

const ProfilePhotoSection = ({ profilePhoto, handleProfilePhotoChange, handleProfilePhotoUpload }) => (
  <div className="profile-photo-section">
    {profilePhoto && console.log(profilePhoto)}
    {profilePhoto ? (
      <img src={profilePhoto} alt="Profile" className="profile-photo" />
    ) : (
      <div className="profile-photo-placeholder">No Profile Photo</div>
    )}
    <form onSubmit={handleProfilePhotoUpload}>
      <input type="file" onChange={handleProfilePhotoChange} />
      <button type="submit">Upload Profile Photo</button>
    </form>
  </div>
);

export default ProfilePhotoSection;
