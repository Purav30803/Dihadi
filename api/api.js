
import axios from 'axios';

const api = axios.create({
    baseURL: "https://dihadi-backend-purav308032814-hq7ha3hi.leapcell.dev/api",
    headers: {
        'Content-Type': 'application/json',
    },
});



// Set Authorization header on initial load
// let token = localStorage.getItem('login');

// if (token) {
//     token=JSON.parse(token);
//     api.defaults.headers.common['Authorization'] = `Bearer ${token?.token}`;
// } else {
//     api.defaults.headers.common['Authorization'] = null;
// }

// api.interceptors.request.use(
//     (config) => {
//         let token = localStorage.getItem('login');
//         if (token) {
//             token=JSON.parse(token);
//             config.headers['Authorization'] = `Bearer ${token?.token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

export default api;