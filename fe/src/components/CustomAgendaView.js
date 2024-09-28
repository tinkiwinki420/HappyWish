import moment from "moment";
import React from "react";

const CustomAgendaView = ({ events }) => {
  return (
    <div className='agenda-table'>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
            <th>Number of People</th>
            <th>Date</th>
            <th>Time Slot</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              <td>{event.firstName}</td>
              <td>{event.lastName}</td>
              <td>{event.phoneNumber}</td>
              <td>{event.num_of_people}</td>
              <td>{moment(event.start).format("MMMM Do YYYY")}</td>
              <td>{event.time_slot}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomAgendaView;