import axios from 'axios';

export const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/v1`;

export default axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    withCredentials: true
});
