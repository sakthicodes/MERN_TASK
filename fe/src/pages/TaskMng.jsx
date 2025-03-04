import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { fetchTasks, deleteTask, assignTask } from "../api/api";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchUsers } from "../api/api";
import { FiEdit, FiTrash, FiPlus, FiUserPlus } from "react-icons/fi";
import useAuthStore from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";
import AssignTaskModal from "./Modal/AssignTaskModal";
import TaskModal from "./Modal/TaskModal";
const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [assingnmodalOpen, setassingnmodalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null);
  const { userId, accessToken } = useAuthStore();

  const { darkMode } = useThemeStore();
  const customStyles = {
    headCells: {
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        backgroundColor: darkMode ? "#1f2937" : "#f3f4f6",
        color: darkMode ? "#ffffff" : "#111827",
      },
    },
    cells: {
      style: {
        fontSize: "15px",
        color: darkMode ? "#e5e7eb" : "#1f2937",
        backgroundColor: darkMode ? "#111827" : "#ffffff",
      },
    },
    rows: {
      style: {
        fontSize: "15px",
        backgroundColor: darkMode ? "#111827" : "#ffffff",
        color: darkMode ? "#e5e7eb" : "#1f2937",
      },
    },
    pagination: {
      style: {
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        color: darkMode ? "#e5e7eb" : "#1f2937",
      },
      pageButtonsStyle: {
        fill: darkMode ? "#e5e7eb" : "#1f2937",
        color: darkMode ? "#ffffff" : "#111827",
        "&:hover": {
          backgroundColor: darkMode ? "#374151" : "#e5e7eb", 
        },
      },
    },
  };
  
  
  const handleTaskCreated = async () => {
    await loadTasks(); 
   };
  
  
  useEffect(() => {
    loadTasks();
    loadUsers();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchTasks(userId,accessToken);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    setIsLoading(false);
  };

  const loadUsers = async () => {
    try {
      const { data } = await fetchUsers(userId,accessToken);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const assingnhandleOpenModal = (task = null) => {
    setSelectedTask(task);
    setassingnmodalOpen(true);
  };

  const handleEditOpenModal = (task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };

  const handleOpenModal = () => {
    setModalOpen(true);

  };
  const handleAssignTask = async (taskId, userId) => {
    try {
      await assignTask(taskId, userId, accessToken);
      setTasks(tasks.map((task) => (task._id === taskId ? { ...task, assignedTo: userId } : task)));
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };
  const handleDeleteTask = async (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This task will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTask(taskId, accessToken);
          setTasks(tasks.filter((task) => task._id !== taskId));
          Swal.fire("Deleted!", "Your task has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete the task.", "error");
        }
      }
    });
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "2%",
    },
    
    {
      name: "Task Title",
      selector: (row) => row.title,
      sortable: true,
      width: "20%",

    },
    {
      name: "Assigned User",
      selector: (row) => users.find((u) => u._id === row.assignedTo)?.name || "Unassigned",
      sortable: true,
      width: "20%",
    },
    {
      name: "Status",
      cell: (row) => (
        <div className="w-full bg-gray-200 rounded-full overflow-hidden relative">
        <div
          className={`text-xs leading-none py-1 text-center text-white rounded-full transition-all duration-300 ${
            row.status === "completed" ? "bg-green-500 w-full" :
            row.status === "in-progress" ? "bg-blue-500 w-2/3" :
            "bg-yellow-500 w-1/3"
          }`}
        >
          {row.status}
        </div>
      </div>
      ),
      sortable: true,
      width: "20%",

    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-5">
          <button className="text-blue-500" onClick={() => assingnhandleOpenModal(row)}>
            <FiUserPlus size={25}/>
          </button>
          <button className="text-blue-500" onClick={() => handleEditOpenModal(row)}>
            <FiEdit size={20} />
          </button>
          <button className="text-red-500" onClick={() => handleDeleteTask(row._id)}>
            <FiTrash size={20} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "35%",

    },
  ];
 
  

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Task Management</h3>
    

      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4 flex items-center" onClick={() => handleOpenModal()}>
        <FiPlus className="mr-2" /> Create Task
      </button>

      {isLoading ? (
        <div>
          <Skeleton height={30} count={1} />
          <Skeleton height={30} count={1} />
          <Skeleton height={100} count={2} />

        </div>
      ) : (
        <DataTable
          columns={columns}
          data={tasks}
          pagination
          highlightOnHover
          responsive
          customStyles={customStyles}
        />
      )} 

      {assingnmodalOpen && (
        <AssignTaskModal isOpen={assingnmodalOpen} onClose={() => setassingnmodalOpen(false)} onTaskCreated={handleTaskCreated} task={selectedTask} users={users} onAssign={handleAssignTask} />
      )}
         {modalOpen && (
          <TaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onTaskCreated={handleTaskCreated} />

      )}
       {editModalOpen && (
  <TaskModal 
    isOpen={editModalOpen} 
    onClose={() => setEditModalOpen(false)} 
    onTaskCreated={loadTasks} 
    task={selectedTask} 
  />
)}
    </div>
  );
};

export default TaskManagement;
