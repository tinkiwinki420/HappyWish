// src/components/FetchProfileHandler.js
import { API_URL } from '../constans';

export const fetchProfile = async (userId, setUserDetails, setFormData, setProfilePhoto, userType) => {
  try {
    const response = await fetch(`${API_URL}/api/profile/${userType}/${userId}`);
    const data = await response.json();
    setUserDetails(data);
    setFormData(data);
    setProfilePhoto(data.profilePhoto);
    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
};
