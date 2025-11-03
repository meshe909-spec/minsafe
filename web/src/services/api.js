import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080' });

export async function registerChild(formData) {
  const res = await api.post('/registerChild', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function triggerAlert(payload) {
  const res = await api.post('/alert', payload);
  return res.data;
}

export async function resolveAlert(alertId) {
  const res = await api.post('/resolveAlert', { alertId });
  return res.data;
}

export default api;




