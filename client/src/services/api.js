import axios from 'axios';

// The URL where your Node.js server is running
const API_URL = 'http://localhost:5000/api/records';

export const getRecords = () => axios.get(API_URL);
export const createRecord = (data) => axios.post(API_URL, data);
export const deleteRecord = (id) => axios.delete(`${API_URL}/${id}`);