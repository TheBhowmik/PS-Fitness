import axios from 'axios';

// Point this to your Spring Boot server port
const api = axios.create({
    baseURL: 'http://localhost:8081/api',
});

// Intercept requests to automatically attach the JWT token if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;