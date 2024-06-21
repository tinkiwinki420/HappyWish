// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HallList from "./components/HallList";
import HallDetails from "./components/HallDetails";
import BookingForm from "./components/BookingForm";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HallList />} />
          <Route path="/hall/:id" element={<HallDetails />} />
          <Route path="/book/:id" element={<BookingForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
