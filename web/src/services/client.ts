import axios from 'axios';
import { getAccessToken, setAccessToken } from '../lib/accessToken';
import jwtDecode from 'jwt-decode';

export const client = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true,
});

export const requestWithoutToken = axios.create({
  baseURL: 'http://localhost:4000',
});

client.interceptors.request.use(async (config) => {
  const token = getAccessToken();
  let refresh = false;
  if (!token) refresh = true;
  if (token) {
    const { exp }: { exp: number } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      refresh = true;
    }
  }
  if (refresh) {
    try {
      const response = await fetch('http://localhost:4000/refresh_token', {
        method: 'post',
        credentials: 'include',
      });
      const data: { accessToken: string } = await response.json();
      setAccessToken(data.accessToken);
    } catch (err) {
      console.log(err);
      setAccessToken('');
    }
  }

  config.headers = {
    authorization: `Bearer ${getAccessToken()}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return config;
});

client.interceptors.response.use((response) => {
  console.log(response.config.url);
  return response.data;
});
