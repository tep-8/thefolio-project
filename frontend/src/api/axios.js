import axios from 'axios';

const instance = axios.create({
//UsesREACT_APP_API_URLfrom.env or .env.production
baseURL:process.env.REACT_APP_API_URL|| 'http://localhost:5000/api',
});


// 1. Request Interceptor (Adds the token to every request)
instance.interceptors.request.use((config)=> {
const token=localStorage.getItem('token');
if(token)config.headers.Authorization = `Bearer ${token}`;
return config;
});
export default instance;