
import axios from 'axios';

const API_BASE_URL = 'https://quco.ysk.co.in';

const apiService = axios.create({
  baseURL: API_BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// 167.71.231.139


apiService.interceptors.request.use(
  (config) => {
 
    const token = localStorage.getItem('token'); 

  
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
   
    return Promise.reject(error);
  }
);


export default apiService;