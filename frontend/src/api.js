import axios from 'axios';

const api = axios.create({
  baseUrl : 'https://heligp.pythonanywhere.com',
});

export default api;