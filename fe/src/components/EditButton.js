// src/components/EditButton.js
import React from 'react';
import iconEdit from "../styles/logos/2473159-200.png";
const EditButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="edit-button">
      <img src={iconEdit} alt="icon" width="34px" height="34px"></img>
    </button>
  );
};

export default EditButton;
