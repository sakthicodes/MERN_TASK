import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { fetchTasks, updateTaskStatus } from "../api/api";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import TaskModal from "./Modal/TaskModal";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // Track modal state
  const { userId, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const getTasks = async () => {
      try {
        const { data } = await fetchTasks(userId);
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    getTasks();
  }, []);

  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const handleChangeStatus = async (taskId, newStatus) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change the task status to "${newStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateTaskStatus(taskId, newStatus); // API call to update status
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task._id === taskId ? { ...task, status: newStatus } : task
            )
          );
          Swal.fire("Updated!", "Task status has been changed.", "success");
        } catch (error) {
          console.error("Error updating task status:", error);
          Swal.fire("Error!", "Failed to update task status.", "error");
        }
      }
    });
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className={`flex-1 bg-gray-100 dark:bg-gray-900 p-6`}>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Tasks
            </h2>
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow"
            >
              + Create Task
            </button>
          </div>

          {loading ? (
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Loading tasks...
            </p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300 text-center">
              No tasks available.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow bg-gray-50 dark:bg-gray-800"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status: {task.status}
                  </p>

                  {/* Change Status Dropdown */}
                  <select
                    className="mt-2 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={task.status}
                    onChange={(e) => handleChangeStatus(task._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default Dashboard;
