import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { fetchUsers, createUser, deleteUser, updateUser } from "../api/api";
import Swal from "sweetalert2";
import { FiEdit, FiTrash, FiPlus } from "react-icons/fi";
import useAuthStore from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";
import UserModal from "./Modal/UserModal";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { accessToken, userId } = useAuthStore();
  const { darkMode } = useThemeStore();

  const customStyles = {  };
 
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await fetchUsers(userId,accessToken);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUserCreated = async () => {
    await loadUsers();
  };

  const handleEditOpenModal = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleDeleteUser = async (userId, accessToken) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(userId, accessToken);
          setUsers(users.filter((user) => user._id !== userId));
          Swal.fire("Deleted!", "User has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete the user.", "error");
        }
      }
    });
  };

  const columns = [
    { name: "S.No", selector: (row, index) => index + 1, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Role", selector: (row) => row.role, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-5">
          <button className="text-blue-500" onClick={() => handleEditOpenModal(row)}>
            <FiEdit size={20} />
          </button>
          <button className="text-red-500" onClick={() => handleDeleteUser(row._id)}>
            <FiTrash size={20} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">User Management</h3>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4 flex items-center" onClick={handleOpenModal}>
        <FiPlus className="mr-2" /> Create User
      </button>
      <DataTable columns={columns} data={users} pagination highlightOnHover responsive customStyles={customStyles} />
      {modalOpen && <UserModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onUserCreated={handleUserCreated} parentId={userId} />}
      {editModalOpen && (
        <UserModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} onUserCreated={loadUsers} user={selectedUser} />
      )}
    </div>
  );
};

export default UserManagement;
