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
      data: response.data,
      headers: response.headers,
      contentType: response.headers['content-type']
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
    // Log error response with more details
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.response?.headers
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
  getAll: async () => {
    try {
      const response = await api.get('/kit');
      console.log('API Raw Response:', response);
      
      if (response.data) {
        // Log dos dados brutos antes do processamento
        console.log('Raw Kits Data:', response.data);
        
        // Processa os dados para garantir os tipos corretos
        const processedKits = Array.isArray(response.data) ? response.data.map(kit => {
          console.log('Processing kit:', kit.id, 'numResidents before:', kit.numResidents, 'type:', typeof kit.numResidents);
          
          const processedKit = {
            ...kit,
            numResidents: kit.numResidents ? Number(kit.numResidents) : 0,
            hasChildren: Boolean(kit.hasChildren),
            hasElderly: Boolean(kit.hasElderly),
            hasPets: Boolean(kit.hasPets),
            isCustom: Boolean(kit.isCustom)
          };
          
          console.log('Kit after processing:', processedKit.id, 'numResidents after:', processedKit.numResidents, 'type:', typeof processedKit.numResidents);
          return processedKit;
        }) : [];
        
        console.log('Final processed kits:', processedKits);
        return { ...response, data: processedKits };
      }
      
      return response;
    } catch (error) {
      console.error('API Error getAll:', error.response || error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/kit/${id}`);
      console.log('GetById Raw Response:', response);
      
      if (response.data) {
        const kitData = response.data.kit || response.data;
        console.log('Raw Kit Data:', kitData);
        
        // Processa os dados para garantir os tipos corretos
        const processedKit = {
          ...kitData,
          numResidents: kitData.numResidents ? Number(kitData.numResidents) : 0,
          hasChildren: Boolean(kitData.hasChildren),
          hasElderly: Boolean(kitData.hasElderly),
          hasPets: Boolean(kitData.hasPets),
          isCustom: Boolean(kitData.isCustom)
        };
        
        console.log('Processed Kit:', processedKit);
        return { ...response, data: processedKit };
      }
      
      return response;
    } catch (error) {
      console.error('API Error getById:', error.response || error);
      throw error;
    }
  },
  getByHouseType: (type) => api.get(`/kit/house/${type}`),
  getByRegion: (region) => api.get(`/kit/region/${region}`),
  create: async (kitData) => {
    try {
      // Garante que numResidents seja enviado como número
      const processedData = {
        ...kitData,
        numResidents: Number(kitData.numResidents || 0)
      };
      
      console.log('Creating kit with data:', processedData);
      const response = await api.post('/kit', processedData);
      console.log('Create Response:', response);
      
      if (response.data) {
        const data = response.data.kit || response.data;
        console.log('Raw Created Kit Data:', data);
        
        const processedKit = {
          ...data,
          numResidents: data.numResidents ? Number(data.numResidents) : 0,
          hasChildren: Boolean(data.hasChildren),
          hasElderly: Boolean(data.hasElderly),
          hasPets: Boolean(data.hasPets),
          isCustom: Boolean(data.isCustom)
        };
        
        console.log('Processed Created Kit:', processedKit);
        return { ...response, data: processedKit };
      }
      
      return response;
    } catch (error) {
      console.error('API Error create:', error.response || error);
      throw error;
    }
  },
  update: (id, data) => api.put(`/kit/${id}`, data),
  delete: (id) => api.delete(`/kit/${id}`),
  addItem: (kitId, item) => api.post(`/kit/${kitId}/items`, item),
  updateItem: (kitId, itemId, item) => api.put(`/kit/${kitId}/items/${itemId}`, item),
  deleteItem: (kitId, itemId) => api.delete(`/kit/${kitId}/items/${itemId}`),
  getRecommendations: (kitId) => api.get(`/kit/${kitId}/recommendations`),
  getItemsByCategory: (category) => api.get(`/kit/items/category/${category}`),
  getCategories: () => api.get('/kit/categories'),
  getUnits: () => api.get('/kit/units'),
  validateKit: (kitId) => api.post(`/kit/${kitId}/validate`),
  exportKit: (kitId, format) => api.get(`/kit/${kitId}/export?format=${format}`),
  importKit: (data) => api.post('/kit/import', data),
  shareKit: (kitId, userId) => api.post(`/kit/${kitId}/share`, { userId }),
  getSharedKits: () => api.get('/kit/shared'),
  getKitHistory: (kitId) => api.get(`/kit/${kitId}/history`),
  restoreKitVersion: (kitId, versionId) => api.post(`/kit/${kitId}/restore/${versionId}`)
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