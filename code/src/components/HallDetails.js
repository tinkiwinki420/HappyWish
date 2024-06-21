// src/components/HallDetails.js
import React from "react";
import { useParams, Link } from "react-router-dom";
import halls from "../data/halls";

const HallDetails = () => {
  const { id } = useParams();
  const hall = halls.find((h) => h.id === parseInt(id));

  if (!hall) {
    return <div>Hall not found!</div>;
  }

  return (
    <div>
      <h2>{hall.name}</h2>
      <p>{hall.description}</p>
      <p>Location: {hall.location}</p>
      <p>Price: ${hall.price}</p>
      <Link to={`/book/${hall.id}`}>Book Now</Link>
    </div>
  );
};

export default HallDetails;
