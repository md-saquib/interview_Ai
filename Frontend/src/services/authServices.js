

import axios from "axios";


const API_URL = 'http://localhost:3000/api/auth';

export const register = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/registerUser`, credentials, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Registration failed");

    }
}

export const login = async (userData) => {

    try {
        const response = await axios.post(`${API_URL}/loginUser`, userData, { withCredentials: true });


        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Login failed");

    }
}
export const logout = async () => {
    try {
        const response = await axios.post(`${API_URL}/logoutUser`, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Logout failed");

    }
}

export const currentUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/getCurrentUser`, { withCredentials: true });
        return response.data.user;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch current user");
    }
}
