import React from "react";
import { Agenda } from "react-big-calendar";

const CustomAgenda = (props) => {
  return (
    <Agenda
      {...props}
      titleAccessor={(event) => `${event.firstName} ${event.lastName}`}
      dateAccessor={(event) => event.date}
      agendaHeaderFormat={{ week: "ddd MMM DD", day: "dddd, MMM DD" }}
      eventPropGetter={(event) => ({
        className: event.className,
        style: { backgroundColor: event.color },
      })}
    />
  );
};

export default CustomAgenda;
