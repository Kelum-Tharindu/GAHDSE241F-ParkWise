// src/services/bookingService.ts
import axios from 'axios';

const API_BASE = 'http://localhost:5000'; // Change if your backend runs elsewhere

export async function fetchBookingDate() {
  const res = await axios.get(`${API_BASE}/api/bookings/booking-details`);
  return res.data;
}
