import React, { useState } from "react";
import axios from "axios";

const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
                email: "user-email@example.com", // Replace with the user's email
                otp,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Error verifying OTP");
        }
    };

    return (
        <div>
            <h2>Verify OTP</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <button type="submit">Verify</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default VerifyOTP;