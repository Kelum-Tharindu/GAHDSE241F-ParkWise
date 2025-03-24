import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaGlobe, FaGoogle } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user', // Default role
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      alert(response.data.message); // Success message
    } catch (error) {
      // Handle validation errors from the backend
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Error registering user. Please try again.");
      }
    }
  };

  // Handle Google Sign-Up
  const handleGoogleSignUp = () => {
    // Redirect the user to the backend Google OAuth endpoint
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const styles = {
    container: "min-h-screen flex items-center justify-center bg-yellow-200", // Yellow background outside the container
    wrapper: "bg-white/50 shadow-2xl rounded-lg overflow-hidden w-full max-w-5xl flex flex-col md:flex-row", // Removed background color for transparency
    imageSection: "hidden md:block md:w-1/2 bg-cover bg-center flex items-center justify-center", // Center the image vertically
    formSection: "w-full md:w-1/2 p-6 flex flex-col justify-center", // Reduced padding to p-6
    title: "text-3xl font-bold text-center text-gray-800 mb-1", // Reduced margin-bottom to mb-1
    subtitle: "text-lg text-center text-gray-600 mb-2", // Reduced margin-bottom to mb-2
    inputContainer: "relative w-full mb-3", // Reduced margin-bottom to mb-3
    input: "w-full px-10 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition-all",
    inputIcon: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500",
    button: "w-full bg-black text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-gray-900 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/50",
    googleButton: "w-full bg-white text-black font-bold py-2 px-6 rounded-lg shadow-lg border border-black hover:bg-gray-100 transition-all focus:outline-none focus:ring-4 focus:ring-gray-500/50 flex items-center justify-center",
    errorMessage: "text-red-500 text-center mb-3", // Reduced margin-bottom to mb-3
    link: "text-center text-gray-600 mt-3", // Reduced margin-top to mt-3
    linkText: "text-black font-medium hover:underline",
    checkboxContainer: "flex items-center mb-3", // Reduced margin-bottom to mb-3
    checkbox: "form-checkbox h-4 w-4 text-black rounded focus:ring-black",
    checkboxLabel: "ml-2 text-gray-700",
    divider: "flex items-center my-3", // Reduced margin to my-3
    dividerLine: "flex-grow border-t border-gray-300",
    dividerText: "mx-4 text-gray-500",
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div 
          className={styles.imageSection} 
          style={{ backgroundImage: "url('/src/assets/booking.png')", 
            backgroundSize: 'contain',  
            backgroundPosition: 'center',  
            backgroundRepeat: 'no-repeat', 
            paddingTop: '50%', 
            height: '70vh',  
          }}
        ></div>
        <div className={styles.formSection}>
          <h1 className={styles.title}>Create Your Account</h1>
          <p className={styles.subtitle}>Sign up to get started with our services.</p>

          {/* Google Sign-Up Button */}
          <button 
            type="button" 
            onClick={handleGoogleSignUp} 
            className={styles.googleButton}
          >
            <FaGoogle className="mr-2" />
            Sign up with Google
          </button>

          {/* Divider */}
          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <div className={styles.dividerText}>OR</div>
            <div className={styles.dividerLine}></div>
          </div>

          {/* Display error message if any */}
          {error && <p className={styles.errorMessage}>{error}</p>}

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            <div className={styles.inputContainer}>
              <FaUser className={styles.inputIcon} />
              <input 
                type="text" 
                name="username" 
                placeholder="Username" 
                value={formData.username} 
                onChange={handleChange} 
                className={styles.input} 
                required 
              />
            </div>

            <div className={styles.inputContainer}>
              <FaEnvelope className={styles.inputIcon} />
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={handleChange} 
                className={styles.input} 
                required 
              />
            </div>

            <div className={styles.inputContainer}>
              <FaLock className={styles.inputIcon} />
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={formData.password} 
                onChange={handleChange} 
                className={styles.input} 
                required 
              />
            </div>

            <div className={styles.inputContainer}>
              <FaGlobe className={styles.inputIcon} />
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange} 
                className={styles.input} 
                required
              >
                <option value="user">User</option>
                <option value="landowner">Land Owner</option>
              </select>
            </div>

            <button type="submit" className={styles.button}>Register</button>
          </form>

          <p className={styles.link}>
            Already have an account? <a href="/login" className={styles.linkText}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;