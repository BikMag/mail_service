import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.BASE_URL || '',
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

// Добавить токен авторизации, если он есть
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default instance;
