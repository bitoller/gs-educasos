import axios from 'axios';

// Function to parse JWT token
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload;
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
};

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
    console.log('Received response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    
    // Store user role if it's a login response
    if (response.config.url === '/login' && response.data?.token) {
      const tokenData = parseJwt(response.data.token);
      const role = tokenData?.isAdmin ? 'admin' : 'user';
      localStorage.setItem('userRole', role);
      console.log('Stored user role from token:', role);
    }
    
    return response;
  },
  (error) => {
    // Log error response
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
      message: error.message
    });

    // Só redireciona para o login em caso de erro 401 se NÃO for uma rota pública
    if (error.response?.status === 401 && !isPublicRoute(error.config.url)) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
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
  login: async (credentials) => {
    // Debug log before making the request
    console.log('Attempting login with credentials:', { email: credentials.email });
    
    try {
      const response = await api.post('/login', credentials);
      console.log('Login response:', response.data);
      
      // Parse the JWT token to get isAdmin flag
      if (response.data?.token) {
        const tokenData = parseJwt(response.data.token);
        if (tokenData?.isAdmin) {
          response.data.user.role = 'admin';
        } else {
          response.data.user.role = 'user';
        }
        console.log('User role set from token:', response.data.user.role);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
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
    api.post('/quizzes/submit', { quizId, submittedAnswers })
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