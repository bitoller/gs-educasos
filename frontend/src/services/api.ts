import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080/disaster-awareness/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const contentService = {
  getAll: () => api.get('/content'),
  getById: (id: string) => api.get(`/content/${id}`),
  create: (data: any) => api.post('/content', data),
  update: (id: string, data: any) => api.put(`/content/${id}`, data),
  delete: (id: string) => api.delete(`/content/${id}`),
};

export const kitService = {
  getAll: () => api.get('/kits'),
  getById: (id: string) => api.get(`/kits/${id}`),
  create: (data: any) => api.post('/kits', data),
  update: (id: string, data: any) => api.put(`/kits/${id}`, data),
  delete: (id: string) => api.delete(`/kits/${id}`),
};

export const authService = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },
};

export default api; 