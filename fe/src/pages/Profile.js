import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../components/FetchProfileHandler";
import { handleSubmit } from "../components/FormSubmitHandler";
import { handleInputChange } from "../components/InputChangeHandler";
import { handleLogout } from "../components/LogoutHandler";
import ProfileDetailsDisplay from "../components/ProfileDetailsDisplay";
import ProfileDetailsForm from "../components/ProfileDetailsForm";
import ProfilePhotoSection from "../components/ProfilePhotoSection";
import "../styles/Profile.css";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType") || "regular";

  useEffect(() => {
    if (!userId) {
      console.error("No user ID provided");
      return;
    }
    setLoading(true); // Start loading
    fetchProfile(
      userId,
      setUserDetails,
      setFormData,
      setProfilePhoto,
      userType
    ).finally(() => setLoading(false)); // Stop loading after data is fetched
  }, [userId, userType]);

  const handleCancel = () => {
    setEditing(false); // Close the form by setting editing to false
  };

  if (!userId) {
    return <p>Error: No user ID provided</p>;
  }

  if (userDetails.error) {
    return <p>{userDetails.error}</p>;
  }

  return (
    <div className='profile-container'>
      <h1>{userType === "business" ? "Business" : "Regular"} User Profile</h1>

      {loading ? (
        <p>Loading profile...</p> // Display while loading
      ) : (
        <>
          <ProfilePhotoSection
            profilePhoto={profilePhoto}
            setNewProfilePhoto={setNewProfilePhoto}
            setProfilePhoto={setProfilePhoto}
            userId={userId}
            userType={userType}
          />
          {editing ? (
            <ProfileDetailsForm
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
            <ProfileDetailsDisplay
              userDetails={userDetails}
              setEditing={setEditing}
            />
          )}
        </>
      )}

      {/* Button for navigating to Recent Bookings */}
      <button
        onClick={() => navigate("/recent-bookings")}
        className='recent-bookings-button'
      >
        Recent Bookings
      </button>

      <button onClick={() => handleLogout(navigate)} className='logout-button'>
        Logout
      </button>
    </div>
  );
};

export default Profile;
