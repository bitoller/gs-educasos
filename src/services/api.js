import axios from 'axios';

// When using Vite's proxy, we use relative URLs
const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Log the request for debugging
    console.log('Making request to:', config.url, 'with method:', config.method);
    
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log('Received response:', response.status, response.data);
    
    // Store user role if it's a login response
    if (response.config.url === '/login' && response.data.role) {
      localStorage.setItem('userRole', response.data.role);
    }
    
    return response;
  },
  (error) => {
    // Log error response
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });

    // Só redireciona para o login em caso de erro 401 se NÃO for uma rota pública
    if (error.response?.status === 401 && !isPublicRoute(error.config.url)) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Função para verificar se é uma rota pública
const isPublicRoute = (url) => {
  const publicRoutes = [
    '/content',
    '/content/disaster'
  ];
  return publicRoutes.some(route => url.startsWith(route));
};

// Auth API
export const auth = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
};

// Content API
export const content = {
  getAll: () => api.get('/content'),
  getByDisasterType: (type) => api.get(`/content/disaster/${type}`),
  create: (data) => api.post('/content', data),
  update: (id, data) => api.put(`/content/${id}`, data),
  delete: (id) => api.delete(`/content/${id}`),
};

// Kit API
export const kits = {
  getAll: () => api.get('/kit'),
  getByHouseType: (type) => api.get(`/kit/house/${type}`),
  getByRegion: (region) => api.get(`/kit/region/${region}`),
  create: (data) => api.post('/kit', data),
  update: (id, data) => api.put(`/kit/${id}`, data),
  delete: (id) => api.delete(`/kit/${id}`),
};

// Quiz API
export const quiz = {
  getAll: () => api.get('/quizzes'),
  getById: (id) => api.get(`/quizzes/${id}`),
  submitAnswers: (quizId, submittedAnswers) => 
    api.post('/quizzes/submit', { quizId, submittedAnswers }),
};

// Leaderboard API
export const leaderboard = {
  get: () => api.get('/leaderboard'),
};

// Admin API
export const admin = {
  getAllUsers: () => api.get('/admin/users'),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateUserScore: (userId, score) => 
    api.put('/admin/user/score', { userId, score }),
};

export default api; 