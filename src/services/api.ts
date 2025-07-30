import axios from "axios";
import { config } from "../config/env";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (email: string, password: string, name: string) => {
    const response = await api.post("/auth/register", {
      email,
      password,
      name,
    });
    return response.data;
  },

  googleAuth: async (token: string) => {
    const response = await api.post("/auth/google", { token });
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get("/auth/verify");
    return response.data;
  },
};

// Books API
export const booksAPI = {
  getAll: async () => {
    const response = await api.get("/books");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  create: async (bookData: FormData) => {
    const response = await api.post("/books", bookData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  update: async (id: string, bookData: FormData) => {
    const response = await api.put(`/books/${id}`, bookData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  getPdfUrl: async (id: string) => {
    const response = await api.get(`/books/${id}/pdf`);
    return response.data;
  },
};

// Stripe API
export const stripeAPI = {
  createCheckoutSession: async (plan: "monthly" | "yearly") => {
    const response = await api.post("/stripe/checkout-session", { plan });
    return response.data;
  },

  createPortalSession: async () => {
    const response = await api.post("/stripe/portal-session");
    return response.data;
  },

  getSubscriptionStatus: async () => {
    const response = await api.get("/stripe/subscription-status");
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get("/user/profile");
    return response.data;
  },

  updateProfile: async (userData: any) => {
    const response = await api.put("/user/profile", userData);
    return response.data;
  },

  updateReadingProgress: async (bookId: string, page: number) => {
    const response = await api.post("/user/reading-progress", { bookId, page });
    return response.data;
  },
};

export default api;
