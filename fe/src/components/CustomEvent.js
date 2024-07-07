// src/components/CustomEvent.js
import React from 'react';

const CustomEvent = ({ event }) => {
  return (
    <div className="custom-event">
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>ID</th>
            <th>Phone</th>
            <th>Time Slot</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{event.firstName}</td>
            <td>{event.lastName}</td>
            <td>{event.idNum}</td>
            <td>{event.phoneNumber}</td>
            <td>{event.time_slot}</td>
            <td>{new Date(event.date).toLocaleDateString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CustomEvent;
