import React, { useEffect } from "react";

const BusinessProfileDetailsDisplay = ({ userDetails, setEditing }) => {
  useEffect(() => {
    // Store categoryName in localStorage if it's available in userDetails
    if (userDetails.category_name) {
      localStorage.setItem("categoryName", userDetails.category_name);
    }
  }, [userDetails.category_name]);

  const category_name = localStorage.getItem("category");

  return (
    <div>
      <p>
        <strong>Business Name:</strong> {userDetails.businessName}
      </p>
      <p>
        <strong>Address:</strong> {userDetails.address}
      </p>
      <p>
        <strong>Email:</strong> {userDetails.email}
      </p>
      <p>
        <strong>Category:</strong> {category_name}
      </p>
      <p>
        <strong>Price per Event:</strong> {userDetails.price_per_event || "N/A"}
      </p>

      {/* Conditionally render hall capacity and minimum guests if category is "Hall" */}
      {category_name === "Hall" && (
        <>
          <p>
            <strong>Hall Capacity:</strong> {userDetails.hallCapacity || "N/A"}
          </p>
          <p>
            <strong>Minimum Guests:</strong> {userDetails.minGuests || "N/A"}
          </p>
          <p>
            <strong>Num Of Reservations:</strong> {userDetails.numOfBookings || "N/A"}
          </p>
        </>
      )}

      <button onClick={() => setEditing(true)}>Edit</button>
    </div>
  );
};

export default BusinessProfileDetailsDisplay;
