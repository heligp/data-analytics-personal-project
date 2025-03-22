import axios from 'axios';

const api = axios.create({
  baseURL : 'https://heligp.pythonanywhere.com',
});

export default api;