import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePhotoSection from '../components/ProfilePhotoSection';
import PhotoGallerySection from '../components/PhotoGallerySection';
import BusinessProfileDetailsForm from '../components/BusinessProfileDetailsForm';
import BusinessProfileDetailsDisplay from '../components/BusinessProfileDetailsDisplay';
import { handleInputChange } from '../components/InputChangeHandler';
import { handleProfilePhotoChange, handleProfilePhotoUpload } from '../components/ProfilePhotoUploadHandler';
import { handleSubmit } from '../components/FormSubmitHandler';
import { handleLogout } from '../components/LogoutHandler';
import { handlePhotoUpload } from '../components/PhotoUploadHandler'; // Import the handlePhotoUpload function
import useFetchProfileEffect from '../hooks/useFetchProfileEffect';
import '../styles/styles.css';

const BusinessProfile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [photos, setPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const userType = 'business';

  useFetchProfileEffect(userId, setUserDetails, setFormData, setProfilePhoto, setPhotos, userType);

  if (!userId) {
    return <p>Error: No user ID provided</p>;
  }

  if (userDetails.error) {
    return <p>{userDetails.error}</p>;
  }

  return (
    <div className="profile-container">
      <h1>Business Profile</h1>
      <ProfilePhotoSection
        profilePhoto={profilePhoto}
        handleProfilePhotoChange={(e) => handleProfilePhotoChange(e, setNewProfilePhoto)}
        handleProfilePhotoUpload={(e) => handleProfilePhotoUpload(e, userId, newProfilePhoto, setProfilePhoto, setNewProfilePhoto, userType)}
      />
      {editing ? (
        <BusinessProfileDetailsForm
          formData={formData}
          handleInputChange={(e) => handleInputChange(e, setFormData)}
          handleSubmit={(e) => handleSubmit(e, userId, formData, setEditing, setUserDetails, userType)}
        />
      ) : (
        <BusinessProfileDetailsDisplay
          userDetails={userDetails}
          setEditing={setEditing}
        />
      )}
      <PhotoGallerySection
        photos={photos}
        handlePhotoChange={(e) => setNewPhotos(e.target.files)}
        handlePhotoUpload={(e) => handlePhotoUpload(e, userId, newPhotos, setNewPhotos, setPhotos, userType)}
      />
      <button onClick={() => handleLogout(navigate)} className="logout-button">Logout</button>
    </div>
  );
};

export default BusinessProfile;
