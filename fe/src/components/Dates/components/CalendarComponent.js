import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ events, onSelectSlot }) => {
  return (
    <Calendar
      localizer={localizer}
      events={events}
      selectable
      onSelectSlot={onSelectSlot}
      defaultView="month"
      views={["month", "agenda"]}
      style={{ height: 500 }}
    />
  );
};

export default CalendarComponent;
