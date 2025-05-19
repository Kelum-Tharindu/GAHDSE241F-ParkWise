import axios from 'axios';

// Define interfaces for the data types
export interface UserProfile {
  _id: string;  // Changed from id: number to match backend
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  country: string;
  city: string;
  postalCode: string;
  taxId: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
}

// API base URL - replace with your actual backend URL
const API_BASE_URL = 'http://localhost:5000/api';

// Function to fetch user profile data
export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    console.log('Fetching user profile for ID:', userId);
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/profile`);
    console.log('User profile data received:', response.data);
    
    // Transform the data to ensure all required fields are present
    const userData = {
      ...response.data,
      socialLinks: response.data.socialLinks || {
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: ''
      },
      firstName: response.data.firstName || '',
      lastName: response.data.lastName || '',
      phone: response.data.phone || '',
      country: response.data.country || '',
      city: response.data.city || '',
      postalCode: response.data.postalCode || '',
      taxId: response.data.taxId || ''
    };
    
    return userData;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Function to update user profile data
export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    console.log('Updating user profile for ID:', userId);
    console.log('Update data:', profileData);
    const response = await axios.put(`${API_BASE_URL}/users/${userId}/profile`, profileData);
    console.log('Profile update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Function to update user social links
export const updateUserSocialLinks = async (userId: string, socialLinks: UserProfile['socialLinks']): Promise<UserProfile> => {
  try {
    console.log('Updating social links for user ID:', userId);
    console.log('Social links data:', socialLinks);
    const response = await axios.put(`${API_BASE_URL}/users/${userId}/social-links`, socialLinks);
    console.log('Social links update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating social links:', error);
    throw error;
  }
};

// Function to update user address information
export const updateUserAddress = async (userId: string, addressData: Pick<UserProfile, 'country' | 'city' | 'postalCode' | 'taxId'>): Promise<UserProfile> => {
  try {
    console.log('Updating address for user ID:', userId);
    console.log('Address data:', addressData);
    const response = await axios.put(`${API_BASE_URL}/users/${userId}/address`, addressData);
    console.log('Address update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
}; 