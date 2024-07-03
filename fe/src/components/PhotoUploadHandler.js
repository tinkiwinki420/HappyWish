// src/components/PhotoUploadHandler.js
import { API_URL } from '../constans';

const handlePhotoUpload = async (e, userId, newPhotos, setNewPhotos, setPhotos) => {
  e.preventDefault();
  const formData = new FormData();
  for (let i = 0; i < newPhotos.length; i++) {
    formData.append('photos', newPhotos[i]);
  }
  try {
    const response = await fetch(`${API_URL}/api/profile/business/${userId}/photos`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    alert(data.message);
    setNewPhotos([]);
    const profileResponse = await fetch(`${API_URL}/api/profile/business/${userId}`);
    const profileData = await profileResponse.json();
    setPhotos(profileData.photos || []);
  } catch (error) {
    console.error('Error uploading photos:', error);
  }
};

export { handlePhotoUpload };
