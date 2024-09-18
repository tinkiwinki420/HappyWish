import React from 'react';
import { handleProfilePhotoChange, handleProfilePhotoUpload } from '../components/ProfilePhotoUploadHandler';

const ProfilePhotoSection = ({ profilePhoto, setNewProfilePhoto, setProfilePhoto, userId, userType }) => (
  <div className="profile-photo-section">
    {profilePhoto && console.log(profilePhoto)}
    {profilePhoto ? (
      <img src={profilePhoto} alt="Profile" className="profile-photo" />
    ) : (
      <div className="profile-photo-placeholder">No Profile Photo</div>
    )}
    <input 
      type="file" 
      id="profilePhotoInput" 
      style={{ display: 'none' }} 
      onChange={(e) => {
        handleProfilePhotoChange(e, setNewProfilePhoto); // Set the new profile photo
        handleProfilePhotoUpload(e, userId, e.target.files[0], setProfilePhoto, setNewProfilePhoto, userType); // Automatically upload after selecting a file
      }} 
    />
    <label htmlFor="profilePhotoInput" className="custom-upload-button">
      Update Profile Photo
    </label>
  </div>
);

export default ProfilePhotoSection;
