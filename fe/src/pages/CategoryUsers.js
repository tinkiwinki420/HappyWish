import { Autocomplete, LoadScript } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CategoryUsers.css";

const CategoryUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // State for all users
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users by location
  const [autocomplete, setAutocomplete] = useState(null); // Autocomplete instance
  const [searchTerm, setSearchTerm] = useState(""); // For storing the searched term
  const selectedCategoryId = localStorage.getItem("selectedCategoryId"); // Get categoryId from localStorage

  // Fetch all users in the category
  useEffect(() => {
    fetchUsers(); // Fetch all users initially
  }, [selectedCategoryId]);

  // Fetch users based on categoryId or location
  const fetchUsers = async (location = "") => {
    let url = `/api/categories/${selectedCategoryId}/users`;

    if (location) {
      url += `?location=${encodeURIComponent(location)}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
        setFilteredUsers(data); // Show users or filtered users
      } else {
        console.error(data.message || "Error fetching users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle place selection using Google Maps Autocomplete
  const handlePlaceChanged = async () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const address = place.formatted_address;
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setSearchTerm(address); // Store the searched address

        // Fetch halls filtered by location from the backend
        try {
          const response = await fetch(
            `/api/categories/${selectedCategoryId}/users/search`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ lat, lng }), // Send lat/lng for location-based filtering
            }
          );

          const data = await response.json();
          if (response.ok) {
            setFilteredUsers(data); // Update the filtered users
          } else {
            console.error(data.message || "Error fetching filtered users");
          }
        } catch (error) {
          console.error("Error searching halls by location:", error);
        }
      }
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  return (
    <div>
      {/* Map Search Bar placed directly under the NavBar */}
      <LoadScript
        googleMapsApiKey='AIzaSyALqwRpG-DmNFzOrkZxfslXUjuMjD6c43Q'
        libraries={["places"]}
      >
        <div className='map-search-container'>
          <Autocomplete
            onLoad={(autocompleteInstance) =>
              setAutocomplete(autocompleteInstance)
            }
            onPlaceChanged={handlePlaceChanged}
          >
            <input
              type='text'
              placeholder='Search for halls by location'
              style={{ width: "300px", padding: "10px" }}
            />
          </Autocomplete>
        </div>
      </LoadScript>

      {/* Category Users Grid */}
      <div className='category-users'>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className='user-profile'
              onClick={() => handleUserClick(user.id)}
            >
              {user.profile_photo ? (
                <img
                  src={user.profile_photo}
                  alt={`${user.businessname} profile`}
                />
              ) : (
                <div className='profile-photo-placeholder'>
                  No Profile Photo
                </div>
              )}
              <p>{user.businessName}</p>
              <p>{user.address}</p>
              <p>{user.email}</p>
            </div>
          ))
        ) : (
          <p>No halls found for the selected location</p>
        )}
      </div>
    </div>
  );
};

export default CategoryUsers;
