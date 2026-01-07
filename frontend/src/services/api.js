import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API methods
export const diagnosisAPI = {
  predict: async (formData) => {
    const response = await api.post("/diagnosis/predict", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get("/diagnosis/history");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/diagnosis/${id}`);
    return response.data;
  },
};

export const patientAPI = {
  getAll: async () => {
    const response = await api.get("/patients");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  create: async (patientData) => {
    const response = await api.post("/patients", patientData);
    return response.data;
  },

  update: async (id, patientData) => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
};

// Alias for backward compatibility
export const patientsAPI = patientAPI;

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post("/auth/signup", {
      password: userData.password,
      name: userData.name,
      email: userData.email,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

export const reportAPI = {
  generate: async (diagnosisId) => {
    const response = await api.post(`/reports/generate`, {
      diagnosis_id: diagnosisId,
    });
    return response.data;
  },

  download: async (reportId) => {
    const response = await api.get(`/reports/download/${reportId}`, {
      responseType: "blob",
    });
    return response.data;
  },
};

export const prescriptionAPI = {
  generate: async (diagnosisData) => {
    const response = await api.post("/prescription/generate", diagnosisData);
    return response.data;
  },
};

export default api;
