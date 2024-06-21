// src/components/HallList.js
import React from "react";
import { Link } from "react-router-dom";
import halls from "../data/halls";

const HallList = () => (
  <div>
    <h2>Available Wedding Halls</h2>
    <ul>
      {halls.map((hall) => (
        <li key={hall.id}>
          <Link to={`/hall/${hall.id}`}>{hall.name}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default HallList;
