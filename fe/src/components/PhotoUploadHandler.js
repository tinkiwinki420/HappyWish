// src/components/PhotoUploadHandler.js
import { API_URL } from '../constans';

export const handlePhotoUpload = (e, userId, newPhotos, setNewPhotos, setPhotos, userType) => {
  e.preventDefault();
  const formData = new FormData();
  for (let i = 0; i < newPhotos.length; i++) {
    formData.append('photos', newPhotos[i]);
  }
  fetch(`${API_URL}/api/profile/${userType}/${userId}/photos`, {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      setNewPhotos([]);
      fetch(`${API_URL}/api/profile/${userType}/${userId}`)
        .then((response) => response.json())
        .then((data) => setPhotos(data.photos || []));
    })
    .catch((error) => console.error('Error uploading photos:', error));
};
