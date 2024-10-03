import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BusinessProfileDetailsDisplay from "../components/BusinessProfileDetailsDisplay";
import BusinessProfileDetailsForm from "../components/BusinessProfileDetailsForm";
import { handleSubmit } from "../components/FormSubmitHandler";
import { handleInputChange } from "../components/InputChangeHandler";
import { handleLogout } from "../components/LogoutHandler";
import PhotoGallerySection from "../components/PhotoGallerySection";
import { handlePhotoUpload } from "../components/PhotoUploadHandler";
import ProfilePhotoSection from "../components/ProfilePhotoSection";
import useFetchProfileEffect from "../hooks/useFetchProfileEffect";
import "../styles/BusinessNavbar.css";
import "../styles/BusinessProfile.css";
import "../styles/footer.css";
import "../styles/header.css";

const BusinessProfile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [photos, setPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [isOnline, setIsOnline] = useState(true); // On/Off toggle state
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userType = "business";

  const handleCancel = () => {
    setEditing(false); // Close the form
    setFormData(userDetails); // Optionally reset the form data to current userDetails
  };
  useFetchProfileEffect(
    userId,
    setUserDetails,
    setFormData,
    setProfilePhoto,
    setPhotos,
    userType
  );

  if (!userId) {
    return <p>Error: No user ID provided</p>;
  }

  if (userDetails.error) {
    return <p>{userDetails.error}</p>;
  }

  return (
    <div className='profile-container'>
      <div className="profile-header">
        <h1>{userDetails.businessName || "Business Profile"}</h1>{" "}
        {/* Display business name or fallback to 'Business Profile' */}
        <div className="toggle-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isOnline}
              onChange={() => setIsOnline(!isOnline)}
            />
            <span className="slider"></span>
          </label>
          <span className="toggle-label">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <ProfilePhotoSection
        profilePhoto={profilePhoto}
        setNewProfilePhoto={setNewProfilePhoto}
        setProfilePhoto={setProfilePhoto}
        userId={userId}
        userType={userType}
      />
      {editing ? (
        <BusinessProfileDetailsForm
          formData={formData}
          handleInputChange={(e) => handleInputChange(e, setFormData)}
          handleSubmit={(e) =>
            handleSubmit(
              e,
              userId,
              formData,
              setEditing,
              setUserDetails,
              userType
            )
          }
          handleCancel={handleCancel}
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
        handlePhotoUpload={(e) =>
          handlePhotoUpload(
            e,
            userId,
            newPhotos,
            setNewPhotos,
            setPhotos,
            userType
          )
        }
      />
      <button onClick={() => handleLogout(navigate)} className='logout-button'>
        Logout
      </button>
    </div>
  );
};

export default BusinessProfile;
