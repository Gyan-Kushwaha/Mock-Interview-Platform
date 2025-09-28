import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/mockinterview`;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create Interview
export const createInterview = async (interviewData) => {
  try {
    const response = await axiosInstance.post('/create', interviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating interview:', error.response?.data?.message);
    throw error;
  }
};

// Get All Interviews
export const getAllInterviews = async () => {
  try {
    const response = await axiosInstance.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching interviews:', error.response?.data?.message);
    throw error;
  }
};

// Get Interview by ID
export const getInterviewByID = async (interviewID) => {
  try {
    const response = await axiosInstance.get(`/${interviewID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching interview by ID:', error.response?.data?.message);
    throw error;
  }
};

// Edit Interview
export const editInterview = async (interviewID, interviewData) => {
  try {
    const response = await axiosInstance.put(`/edit/${interviewID}`, interviewData);
    return response.data;
  } catch (error) {
    console.error('Error editing interview:', error.response?.data?.message);
    throw error;
  }
};

// Delete Interview
export const deleteInterview = async (interviewID) => {
  try {
    const response = await axiosInstance.delete(`/delete/${interviewID}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting interview:', error.response?.data?.message);
    throw error;
  }
};