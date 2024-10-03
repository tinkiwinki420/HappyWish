import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavbarBooking from '../components/NavbarBooking';
import '../styles/CategoryUserProfile.css';

const CategoryUserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await fetch(`/api/profile/business/${userId}`);
                if (!userResponse.ok) {
                    throw new Error('User data fetch failed');
                }
                const userData = await userResponse.json();
                setUser(userData);

                const photosResponse = await fetch(`/api/profile/business/users/${userId}/photos`);
                if (!photosResponse.ok) {
                    throw new Error('Photos fetch failed');
                }
                const photosData = await photosResponse.json();
                setPhotos(photosData.photos);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>No user data available</p>;
    }

    return (
        <div className="category-user-profile">
            <NavbarBooking userId={userId} />
            {user.profilePhoto ? (
                <img src={user.profilePhoto} alt={`${user.businessName} profile`} />
            ) : (
                <div className="profile-photo-placeholder">No Profile Photo</div>
            )}
            <h2>{user.businessName}</h2>
            <p>Address: {user.address}</p>
            <p>Email: {user.email}</p>
            {/* Display Hall Capacity only for users in the "Hall" category */}
            {user.category_name === "Hall" && (
                <div className='form-group'>
                    <label>Hall Capacity:</label>
                    <p>{user.hallCapacity || "N/A"}</p>
                    <label>minGuests:</label>
                    <p>{user.minGuests || "N/A"}</p>
                </div>
                
            )}
            
            <div className="user-photos">
                {photos.length > 0 ? (
                    photos.map((photo, index) => (
                        <img key={index} src={photo} alt={`User photo ${index + 1}`} />
                    ))
                ) : (
                    <p>No photos available</p>
                )}
            </div>
        </div>
    );
};

export default CategoryUserProfile;
