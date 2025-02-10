import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const driveService = {
    getAuthUrl: async () => {
        const response = await axios.get(`${API_URL}/auth-url`);
        return response.data;
    },

    listFiles: async () => {
        const response = await axios.get(`${API_URL}/files`);
        return response.data;
    },

    exportToCsv: async () => {
        const response = await axios.get(`${API_URL}/export-csv`, {
            responseType: 'blob'
        });
        return response.data;
    }
};
