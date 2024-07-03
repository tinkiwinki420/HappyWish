// src/hooks/useFetchProfileEffect.js
import { useEffect } from 'react';
import { fetchProfile } from '../components/FetchProfileHandler';

const useFetchProfileEffect = (userId, setUserDetails, setFormData, setProfilePhoto, setPhotos, userType) => {
  useEffect(() => {
    if (!userId) {
      console.error('No user ID provided');
      return;
    }
    fetchProfile(userId, setUserDetails, setFormData, setProfilePhoto, userType)
      .then(data => setPhotos(data.photos || []))
      .catch(error => console.error('Error fetching user details:', error));
  }, [userId, userType, setUserDetails, setFormData, setProfilePhoto, setPhotos]);
};

export default useFetchProfileEffect;
