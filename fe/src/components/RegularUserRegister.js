import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { API_URL } from '../constans';

const RegularUserRegister = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [id, setId] = useState('');
  const [number, setNumber] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/register/regular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname, lastname, id, number, address, dob, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate('/login'); // Redirect to the login page upon successful registration
      } else {
        setError(data.message || 'Error registering regular user');
      }
    } catch (error) {
      console.error('Error registering regular user:', error);
      setError('Error registering regular user. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>First Name:</label>
        <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Last Name:</label>
        <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} />
      </div>
      <div className="form-group">
        <label>ID:</label>
        <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Phone Number:</label>
        <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Address:</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Date of Birth:</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Register</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default RegularUserRegister;
