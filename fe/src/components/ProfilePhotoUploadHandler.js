// src/components/ProfilePhotoUploadHandler.js

export const handleProfilePhotoChange = (e, setNewProfilePhoto) => {
  setNewProfilePhoto(e.target.files[0]);
};

export const handleProfilePhotoUpload = async (e, userId, newProfilePhoto, setProfilePhoto, setNewProfilePhoto, userType) => {
  if (!newProfilePhoto) return;

  const formData = new FormData();
  formData.append('profilePhoto', newProfilePhoto);

  try {
    const response = await fetch(`/api/profile/${userType}/${userId}/profile-photo`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setProfilePhoto(data.profilePhoto);
    setNewProfilePhoto(null);
  } catch (error) {
    console.error('Error uploading profile photo:', error);
  }
};
