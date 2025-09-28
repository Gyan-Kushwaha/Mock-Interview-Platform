import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/ai`;

// Function to generate questions
export const generateQuestions = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/generate-questions`, data, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("Failed to generate Questions:", error);
    throw error;
  }
};

// Function to generate review
export const generateReview = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/generate-review`, data, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("Failed to generate Review:", error);
    throw error;
  }
};