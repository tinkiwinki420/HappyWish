// fe/src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        userType: 'normal' // Default user type
    });

    const { username, email, password, password2, userType } = formData;
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password2) {
            console.log('Passwords do not match');
        } else {
            const newUser = {
                username,
                email,
                password,
                userType
            };

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                const body = JSON.stringify(newUser);

                const res = await axios.post('/api/auth/register', body, config);

                // Store token in localStorage and redirect to dashboard
                localStorage.setItem('token', res.data.token);
                navigate('/dashboard'); // Redirect after successful registration
            } catch (err) {
                console.error(err.response.data);
            }
        }
    };

    return (
        <form onSubmit={e => onSubmit(e)}>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={username}
                    onChange={e => onChange(e)}
                    required
                />
            </div>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={e => onChange(e)}
                    required
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={e => onChange(e)}
                    required
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="password2"
                    value={password2}
                    onChange={e => onChange(e)}
                    required
                />
            </div>
            <div>
                <select name="userType" value={userType} onChange={e => onChange(e)} required>
                    <option value="normal">Normal User</option>
                    <option value="business">Business User</option>
                </select>
            </div>
            <input type="submit" value="Register" />
        </form>
    );
};

export default Register;
