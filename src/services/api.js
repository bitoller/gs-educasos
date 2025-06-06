import axios from "axios";

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));
    return payload;
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
};

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const isPublicRoute = (url) => {
  const publicRoutes = ["/content", "/content/disaster"];
  return publicRoutes.some((route) => url.startsWith(route));
};

export const auth = {
  login: async (credentials) => {
    try {
      const response = await api.post("/login", credentials);

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
      }
      return response;
    } catch (error) {
      throw error;
    }
  },
  register: (userData) => api.post("/register", userData),
  getUserData: async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        throw new Error("User data not found in localStorage");
      }

      const userData = JSON.parse(storedUser);

      const leaderboardResponse = await api.get("/leaderboard");
      const userScore = leaderboardResponse.data.find(
        (item) => item.userId === userData.id || item.userId === userData.userId
      );

      if (userScore) {
        const updatedUserData = {
          ...userData,
          score: userScore.score,
          totalScore: userScore.score,
          completedQuizzes:
            userScore.completedQuizzes || userData.completedQuizzes || 0,
        };
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        return { data: updatedUserData };
      }

      return { data: userData };
    } catch (error) {
      const storedData = JSON.parse(localStorage.getItem("user"));
      if (storedData) {
        return { data: storedData };
      }
      throw error;
    }
  },
};

export const content = {
  getAll: () => api.get("/content"),
  getByDisasterType: (type) => api.get(`/content/disaster/${type}`),
  create: (data) => api.post("/content", data),
  update: (id, data) => api.put(`/content/${id}`, data),
  delete: (id) => api.delete(`/content/${id}`),
};

export const kits = {
  getAll: async () => {
    try {
      const response = await api.get("/kit");

      if (response.data) {
        const processedKits = Array.isArray(response.data)
          ? response.data.map((kit) => {
              return {
                ...kit,
                numResidents: kit.numResidents ? Number(kit.numResidents) : 0,
                hasChildren: Boolean(kit.hasChildren),
                hasElderly: Boolean(kit.hasElderly),
                hasPets: Boolean(kit.hasPets),
                isCustom: Boolean(kit.isCustom),
              };
            })
          : [];

        return { ...response, data: processedKits };
      }

      return response;
    } catch (error) {
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/kit/${id}`);

      if (response.data) {
        const kitData = response.data.kit || response.data;

        const processedKit = {
          ...kitData,
          numResidents: kitData.numResidents ? Number(kitData.numResidents) : 0,
          hasChildren: Boolean(kitData.hasChildren),
          hasElderly: Boolean(kitData.hasElderly),
          hasPets: Boolean(kitData.hasPets),
          isCustom: Boolean(kitData.isCustom),
        };

        return { ...response, data: processedKit };
      }

      return response;
    } catch (error) {
      throw error;
    }
  },
  getByHouseType: (type) => api.get(`/kit/house/${type}`),
  getByRegion: (region) => api.get(`/kit/region/${region}`),
  create: async (kitData) => {
    try {
      const processedData = {
        ...kitData,
        numResidents: Number(kitData.numResidents || 0),
      };

      const response = await api.post("/kit", processedData);

      if (response.data) {
        const data = response.data.kit || response.data;

        const processedKit = {
          ...data,
          numResidents: data.numResidents ? Number(data.numResidents) : 0,
          hasChildren: Boolean(data.hasChildren),
          hasElderly: Boolean(data.hasElderly),
          hasPets: Boolean(data.hasPets),
          isCustom: Boolean(data.isCustom),
        };

        return { ...response, data: processedKit };
      }

      return response;
    } catch (error) {
      throw error;
    }
  },
  update: (id, data) => api.put(`/kit/${id}`, data),
  delete: (id) => api.delete(`/kit/${id}`),
  addItem: (kitId, item) => api.post(`/kit/${kitId}/items`, item),
  updateItem: (kitId, itemId, item) =>
    api.put(`/kit/${kitId}/items/${itemId}`, item),
  deleteItem: (kitId, itemId) => api.delete(`/kit/${kitId}/items/${itemId}`),
  getRecommendations: (kitId) => api.get(`/kit/${kitId}/recommendations`),
  getItemsByCategory: (category) => api.get(`/kit/items/category/${category}`),
  getCategories: () => api.get("/kit/categories"),
  getUnits: () => api.get("/kit/units"),
  validateKit: (kitId) => api.post(`/kit/${kitId}/validate`),
  exportKit: (kitId, format) =>
    api.get(`/kit/${kitId}/export?format=${format}`),
  importKit: (data) => api.post("/kit/import", data),
  shareKit: (kitId, userId) => api.post(`/kit/${kitId}/share`, { userId }),
  getSharedKits: () => api.get("/kit/shared"),
  getKitHistory: (kitId) => api.get(`/kit/${kitId}/history`),
  restoreKitVersion: (kitId, versionId) =>
    api.post(`/kit/${kitId}/restore/${versionId}`),
};

export const quiz = {
  getAll: () => api.get("/quizzes"),
  getById: (id) => api.get(`/quizzes/${id}`),
  submitAnswers: (quizId, submittedAnswers) =>
    api.post("/quizzes/submit", { quizId, submittedAnswers }),
};

export const leaderboard = {
  get: () => api.get("/leaderboard"),
};

export const admin = {
  getAllUsers: () => api.get("/admin/users"),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateUserScore: (userId, score) =>
    api.put("/admin/user/score", { userId, score }),
};

export { api };
