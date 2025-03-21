import React, { useState } from 'react';
import axios from 'axios';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import '../../pages/SignUp/SignUpStyle.css';  // Import CSS file without curly braces

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user', // Default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      alert(response.data.message); // "User registered successfully"
    } catch (error) {
      alert(error.response?.data?.message || 'Error registering user');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Welcome to ParkWise!</h2>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Username"
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="inputContainer">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Button type="submit" className="button">
            Create Account
          </Button>
        </form>

        <p className="link">
          Already have an account?{' '}
          <a href="/login" className="linkText">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
