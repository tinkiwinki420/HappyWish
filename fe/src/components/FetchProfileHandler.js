import { API_URL } from "../constans";

export const fetchProfile = async (
  userId,
  setUserDetails,
  setFormData,
  setProfilePhoto,
  userType
) => {
  try {
    console.log(`Fetching profile for ${userType} user with ID: ${userId}`);
    const response = await fetch(
      `${API_URL}/api/profile/${userType}/${userId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("Fetched user details:", data);
    setUserDetails(data);
    setFormData(data);
    setProfilePhoto(data.profilePhoto);

    return data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching user details:", error);
    setUserDetails({ error: "Error fetching user details" });
    throw error;
  }
};
