import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Create the axios instance without Authorization header initially
const api = axios.create({
    baseURL: "https://beige-needles-smoke.loca.lt/api",
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token from AsyncStorage
// api.interceptors.request.use(
//     async (config) => {
//         const token = await AsyncStorage.getItem('token');
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

export default api;
