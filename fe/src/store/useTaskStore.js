import { create } from "zustand";
import { fetchTasks } from "../api/api";

const useTaskStore = create((set) => ({
  tasks: [],
  loadTasks: async () => {
    const { data } = await fetchTasks();
    set({ tasks: data });
  },
}));

export default useTaskStore;
