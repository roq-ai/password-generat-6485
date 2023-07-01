import axios from 'axios';
import queryString from 'query-string';
import { PasswordInterface, PasswordGetQueryInterface } from 'interfaces/password';
import { GetQueryInterface } from '../../interfaces';

export const getPasswords = async (query?: PasswordGetQueryInterface) => {
  const response = await axios.get(`/api/passwords${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPassword = async (password: PasswordInterface) => {
  const response = await axios.post('/api/passwords', password);
  return response.data;
};

export const updatePasswordById = async (id: string, password: PasswordInterface) => {
  const response = await axios.put(`/api/passwords/${id}`, password);
  return response.data;
};

export const getPasswordById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/passwords/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePasswordById = async (id: string) => {
  const response = await axios.delete(`/api/passwords/${id}`);
  return response.data;
};
