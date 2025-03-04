import axios from "axios";

const API_URL = "http://localhost:5000/api"; 
 
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");
const setAccessToken = (token) => localStorage.setItem("accessToken", token);

const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login"; 
}; 
const api = axios.create({
  baseURL: API_URL,
});
 
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);
 
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(originalRequest); 
      } catch (refreshError) {
        logout();
      }
    }
    return Promise.reject(error);
  }
);
 
export const register = (userData) => api.post("/auth/register", userData);
export const login = (userData) => api.post("/auth/login", userData);
export const refreshAccessToken = () => api.post("/auth/refresh", { refreshToken: getRefreshToken() });
export const fetchTasks = (userId) => api.get(`/tasks?parentId=${userId}`);
export const createTask = (taskData) => api.post("/tasks", taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const updateTaskStatus = (id, status) => api.put(`/tasks/${id}/status`, { status });
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const assignTask = (taskId, userId) => api.put(`/tasks/${taskId}/assign`, { userId });
export const fetchUsers = (userId) => api.get(`/users?parentId=${userId}`);
export const createUser = (userData) => api.post("/users", userData);
export const updateUser = (userId, userData) => api.put(`/users/${userId}`, userData);
export const deleteUser = (userId) => api.delete(`/users/${userId}`);

export default api;
