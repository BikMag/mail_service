import axios from '../api/axios';

export const login = (email, password) => {
  return axios.post('auth/token/login/', { email, password });
};
  
export const register = (email, username, password, re_password) => {
  return axios.post('auth/users/', {
      email,
      username,
      password,
      re_password,
    });
};

export const logout = () => {
  return axios.post('auth/token/logout/');
};

export const getCurrentUser = () => {
  return axios.get('auth/users/me/');
};
