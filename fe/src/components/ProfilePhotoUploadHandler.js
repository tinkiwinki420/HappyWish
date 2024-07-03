import { API_URL } from '../constans';

export const handleProfilePhotoChange = (e, setNewProfilePhoto) => {
  setNewProfilePhoto(e.target.files[0]);
};

export const handleProfilePhotoUpload = async (e, userId, newProfilePhoto, setProfilePhoto, setNewProfilePhoto, userType = 'regular') => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('profilePhoto', newProfilePhoto);

  try {
    const response = await fetch(`${API_URL}/api/profile/${userType}/${userId}/profile-photo`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    alert(data.message);
    setNewProfilePhoto(null);
    setProfilePhoto(data.profilePhoto);
  } catch (error) {
    console.error('Error uploading profile photo:', error);
  }
};
