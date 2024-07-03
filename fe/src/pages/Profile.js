import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePhotoSection from '../components/ProfilePhotoSection';
import ProfileDetailsForm from '../components/ProfileDetailsForm';
import ProfileDetailsDisplay from '../components/ProfileDetailsDisplay';
import { handleInputChange } from '../components/InputChangeHandler';
import { handleProfilePhotoChange, handleProfilePhotoUpload } from '../components/ProfilePhotoUploadHandler';
import { handleSubmit } from '../components/FormSubmitHandler';
import { handleLogout } from '../components/LogoutHandler';
import { fetchProfile } from '../components/FetchProfileHandler';
import '../styles/styles.css';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType') || 'regular';

  useEffect(() => {
    if (!userId) {
      console.error('No user ID provided');
      return;
    }
    fetchProfile(userId, setUserDetails, setFormData, setProfilePhoto, userType);
  }, [userId, userType]);

  if (!userId) {
    return <p>Error: No user ID provided</p>;
  }

  if (userDetails.error) {
    return <p>{userDetails.error}</p>;
  }

  return (
    <div className="profile-container">
      <h1>{userType === 'business' ? 'Business' : 'Regular'} User Profile</h1>
      <ProfilePhotoSection
        profilePhoto={profilePhoto}
        handleProfilePhotoChange={(e) => handleProfilePhotoChange(e, setNewProfilePhoto)}
        handleProfilePhotoUpload={(e) => handleProfilePhotoUpload(e, userId, newProfilePhoto, setProfilePhoto, setNewProfilePhoto, userType)}
      />
      {editing ? (
        <ProfileDetailsForm
          formData={formData}
          handleInputChange={(e) => handleInputChange(e, setFormData)}
          handleSubmit={(e) => handleSubmit(e, userId, formData, setEditing, setUserDetails, userType)}
        />
      ) : (
        <ProfileDetailsDisplay
          userDetails={userDetails}
          setEditing={setEditing}
        />
      )}
      <button onClick={() => handleLogout(navigate)} className="logout-button">Logout</button>
    </div>
  );
};

export default Profile;
