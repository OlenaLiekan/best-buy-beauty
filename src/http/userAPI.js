import { $authHost, $host } from './index.js';
import jwt_decode from 'jwt-decode';

export const registration = async (email, password, firstName, lastName, phone) => {
  const { data } = await $host.post('api/user/registration', {
    email,
    password,
    firstName,
    lastName,
    phone,
    role: 'USER',
  });
  localStorage.setItem('token', data.token);
  return jwt_decode(data.token);
};

export const login = async (email, password) => {
  const { data } = await $host.post('api/user/login', { email, password });
  localStorage.setItem('token', data.token);
  return jwt_decode(data.token);
};

export const refreshToken = async () => {
  const { data } = await $authHost.get('api/user/auth');
  localStorage.setItem('token', data.token);
  return jwt_decode(data.token);
};

export const updateUser = async (user, id) => {
  const { data } = await $authHost.patch('api/user/' + id, user);
  return data;
};

export const fetchUsers = async () => {
  const { data } = await $authHost.get('api/user');
  return data;
};

