import React from "react";

const ProfileView = () => {
  const profileData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    paymentMethod: "Credit Card",
    membershipLevel: "Gold",
    upcomingBookings: [
      {
        venue: "Sunset Gardens",
        date: "2023-07-15",
        time: "5:00 PM",
      },
      {
        venue: "Crystal Hall",
        date: "2023-09-01",
        time: "3:00 PM",
      },
    ],
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "2rem",
          color: "#333",
          marginBottom: "20px",
        }}
      >
        Profile
      </h1>
      <div>
        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            First Name:
          </label>
          <span
            style={{
              fontSize: "2rem",
              color: "#333",
            }}
          >
            {profileData.firstName}
          </span>
        </div>
        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            Last Name:
          </label>
          <span
            style={{
              fontSize: "1rem",
              color: "#333",
            }}
          >
            {profileData.lastName}
          </span>
        </div>
        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            Email:
          </label>
          <span
            style={{
              fontSize: "1rem",
              color: "#333",
            }}
          >
            {profileData.email}
          </span>
        </div>
        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            Payment Method:
          </label>
          <span
            style={{
              fontSize: "1rem",
              color: "#333",
            }}
          >
            {profileData.paymentMethod}
          </span>
        </div>
        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            Membership Level:
          </label>
          <span
            style={{
              fontSize: "1rem",
              color: "#111",
            }}
          >
            {profileData.membershipLevel}
          </span>
        </div>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            Upcoming Bookings:
          </label>
          <ul
            style={{
              listStyleType: "none",
              padding: "0",
              margin: "0",
            }}
          >
            {profileData.upcomingBookings.map((booking, index) => (
              <li
                key={index}
                style={{
                  backgroundColor: "#fff",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "4px",
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {booking.venue}
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    color: "#666",
                  }}
                >
                  {booking.date} at {booking.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
