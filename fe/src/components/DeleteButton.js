// src/components/DeleteButton.js
import React from 'react';
import deleteIcon from "../styles/logos/3334328.png";
const DeleteButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="delete-button">
       <img src={deleteIcon} alt="icon" width="34px" height="34px"></img>
    </button>
  );
};

export default DeleteButton;
