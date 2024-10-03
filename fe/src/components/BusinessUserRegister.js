import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constans";

const BusinessUserRegister = () => {
  const [businessName, setBusinessName] = useState("");
  const [numOfBusiness, setNumOfBusiness] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState(""); // Initialize category state
  const [hallCapacity, setHallCapacity] = useState(""); // Initialize hallCapacity state
  const [minGuests, setMinGuests] = useState(""); // Initialize minGuests state
  const [pricePerEvent, setPricePerEvent] = useState(""); // Initialize pricePerEvent state
  const [categories, setCategories] = useState([]); // State to hold category options
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all required fields
    if (!businessName || !numOfBusiness || !address || !email || !password || !category) {
      setError("All fields are required.");
      return;
    }

    // Validate hall capacity and minimum guests if category is Hall
    if (category === "Hall") {
      if (hallCapacity < 0 || isNaN(hallCapacity)) {
        setError("Hall capacity must be a non-negative number.");
        return;
      }

      if (minGuests < 0 || isNaN(minGuests)) {
        setError("Minimum guests must be a non-negative number.");
        return;
      }

      if (parseInt(minGuests) > parseInt(hallCapacity)) {
        setError("Minimum guests cannot exceed hall capacity.");
        return;
      }
    }

    // Validate price per event
    if (pricePerEvent < 0 || isNaN(pricePerEvent)) {
      setError("Price per event must be a non-negative number.");
      return;
    }

    const categoryId = categories.find(cat => cat.name === category)?.id; // Get the category ID

    try {
      const response = await fetch(`${API_URL}/api/register/business`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          numOfBusiness,
          address,
          email,
          password,
          category_id: categoryId, // Ensure this is being sent
          hallCapacity: category === "Hall" ? hallCapacity : null,
          minGuests: category === "Hall" ? minGuests : null, // Send minGuests only if category is Hall
          price_per_event: pricePerEvent, // Ensure this is being sent
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate("/login");
      } else {
        setError(data.message || "Error registering business user");
      }
    } catch (error) {
      console.error("Error registering business user:", error);
      setError("Error registering business user. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register Business User</h2>
      <div className='form-group'>
        <label>Business Name:</label>
        <input
          type='text'
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
      </div>
      <div className='form-group'>
        <label>Business Number:</label>
        <input
          type='text'
          value={numOfBusiness}
          onChange={(e) => setNumOfBusiness(e.target.value)}
        />
      </div>
      <div className='form-group'>
        <label>Address:</label>
        <input
          type='text'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className='form-group'>
        <label>Email:</label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className='form-group'>
        <label>Password:</label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className='form-group'>
        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value=''>Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      {category === "Hall" && (
        <>
          <div className='form-group'>
            <label>Hall Capacity:</label>
            <input
              type='number'
              value={hallCapacity}
              onChange={(e) => setHallCapacity(e.target.value)}
              min="0"
            />
          </div>
          <div className='form-group'>
            <label>Minimum Guests:</label>
            <input
              type='number'
              value={minGuests}
              onChange={(e) => setMinGuests(e.target.value)}
              min="0"
            />
          </div>
        </>
      )}
      <div className='form-group'>
        <label>Price per Event:</label>
        <input
          type='number'
          value={pricePerEvent}
          onChange={(e) => setPricePerEvent(e.target.value)}
          min="0"
        />
      </div>
      <button type='submit'>Register</button>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
    </form>
  );
};

export default BusinessUserRegister;
