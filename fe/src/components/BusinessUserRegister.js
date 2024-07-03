import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constans";

const BusinessUserRegister = () => {
  const [businessName, setBusinessName] = useState("");
  const [numOfBusiness, setNumOfBusiness] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]); // State to hold category options
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    // Fetch categories from the API if needed
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories`); // Adjust the URL as needed
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
          category,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate("/login"); // Redirect to the login page upon successful registration
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
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <button type='submit'>Register</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default BusinessUserRegister;
