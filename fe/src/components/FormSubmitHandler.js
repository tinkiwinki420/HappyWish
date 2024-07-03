import { API_URL } from "../constans";

export const handleSubmit = async (
  e,
  userId,
  formData,
  setEditing,
  setUserDetails,
  userType = "regular"
) => {
  e.preventDefault();
  try {
    const response = await fetch(
      `${API_URL}/api/profile/${userType}/${userId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    const data = await response.json();
    alert(data.message);
    setEditing(false);
    setUserDetails(formData);
  } catch (error) {
    console.error("Error updating user details:", error);
  }
};
