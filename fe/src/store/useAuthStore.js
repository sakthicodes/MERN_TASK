import { create } from "zustand";

const useAuthStore = create((set) => ({
  userId: localStorage.getItem("userId") || null, 
  accessToken: localStorage.getItem("accessToken") || null,
  role: localStorage.getItem("role") || null,
  login: (userId, accessToken,role) => {
    localStorage.setItem("userId", userId); 
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("role", role);
    set({ userId, accessToken,role });
  },

  logout: () => {
    localStorage.removeItem("userId"); 
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    set({ userId: null, accessToken: null,role:null });
  },
}));

export default useAuthStore;
