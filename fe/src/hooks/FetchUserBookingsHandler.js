export const fetchUserBookings = async (userId, setBookings) => {
    try {
      const response = await fetch(`/api/profile/business/bookings/recent-bookings/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };
  