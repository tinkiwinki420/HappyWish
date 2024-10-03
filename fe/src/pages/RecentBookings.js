import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import RecentBookings from "../components/RecentBookings";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/recent-bookings" element={<RecentBookings />} />
      </Routes>
    </Router>
  );
};

export default App;
