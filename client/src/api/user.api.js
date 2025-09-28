import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/users`;


// function to get user
export const getUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-user`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting user details:", error.response?.data?.message);
    throw error;
  }
};

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error.response?.data?.error);
    throw error;
  }
};

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error.response?.data?.message);
    throw error;
  }
};

// Edit User
export const editUser = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/edit`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error.response?.data?.message);
    throw error;
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/logout`,
      {},
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error logging out user:", error.response?.data?.message);
    throw error;
  }
};