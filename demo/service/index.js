// import axios from 'axios';
// import { API_WITHOUT_TOKEN } from '../../pages/commons/Utils';
//
// axios.defaults.timeout = 5 * 60 * 1000;
// axios.interceptors.request.use((req) => {
//         console.log('request_data:: >>', req);
//         const regex = /\/recruitment/;
//         if (regex.test(req.url)) {
//             console.log("URL contains '/recruitment/mask'");
//             return req;
//         }
//         if (!API_WITHOUT_TOKEN.includes(req.url)) {
//             req.headers.Authorization = `Bearer ${localStorage.getItem('accessToken') ?? null}`;
//         }
//
//         return req;
//     },
//     (error) => {
//         console.log('error_data :: >> ', error);
//         return Promise.reject(error);
//     }
// );
//
// axios.interceptors.response.use(
//     (response) => {
//         console.log('Response_data :: >>', response);
//         return response;
//     },
//     async (error) => {
//         const accessToken = localStorage.getItem('accessToken');
//         if (error?.response?.status === 401 && accessToken != null) {
//             localStorage.clear();
//             window.location.href = '';
//         }
//         return Promise.reject(error);
//     }
// );
