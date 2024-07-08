import React, { useState, useEffect } from "react";
import editIcon from "../../assets/edit-icon.svg";
import addusersIcon from "../../assets/add-users-icon.svg";
import TopLayer from "../shared/TopLayer";
import AddUserModal from "./AddUserModal";
// import EditModal from "./EditUsersModal";
import EditUsersModal from "./EditUsersModal";
import apiService from "../../apiService";

const UsersTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // const [users, setUsers] = useState([
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     moduleAccess: ["Admin", "Purchase Order", "Stock In Stock Out", "Reports"],
  //   },
  //   { id: 2, name: "Jane Smith", moduleAccess: ["Admin", "Reports"] },
  //   { id: 3, name: "Alice Johnson", moduleAccess: ["Purchase Order", "Stock In Stock Out"] },
  // ]);

  const [users, setUsers] = useState([]);

  const permissions = [
    "ADMIN",
    "PURCHASE ORDER",
    "STOCK IN",
    "STOCK OUT",
    "PRODUCT MASTER",
    "REPORTS",
  ];
  useEffect(() => {
    // Fetch all users from API when component mounts
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await apiService.get("/users/getall");
      console.log(response.data); // Log the response data to verify
      setUsers(response.data); // Update state with fetched users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Function to open the add user modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the add user modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle user creation/update from AddUserModal
  const handleUpdate = (userData) => {
    if (userData) {
      setUsers((prevUsers) => [
        ...prevUsers,
        { id: prevUsers.length + 1, ...userData },
      ]);
    }
  };

  // const openEditModal = (user) => {
  //   setSelectedUser(user);
  //   setIsEditModalOpen(true);
  // };

  // Function to open the edit user modal and fetch user data
  const openEditModal = async (user) => {
    try {
      const response = await apiService.get(`/users/${user.id}`);
      console.log(response.data); // Log the response data to verify
      setSelectedUser(response.data); // Update selectedUser state with fetched user data
      setIsEditModalOpen(true); // Open edit modal
    } catch (error) {
      console.error(`Error fetching user ${user.id}:`, error);
    }
  };

  // Function to handle user update from EditUsersModal
  const handleEditUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  return (
    <>
      <TopLayer
        isAddButton={true}
        addButtonIcon={addusersIcon}
        addButtonText="Add User"
        arrangeIconRight={true}
        onAddButtonClick={openModal}
      />
      {isModalOpen && (
        <AddUserModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onUpdate={handleUpdate}
        />
      )}
      {isEditModalOpen && (
        <EditUsersModal
          // user={users[0]}
          user={selectedUser}
          onClose={() => setIsEditModalOpen(false)}
          permissions={permissions}
          onUpdate={handleEditUser}
        />
      )}
      <div className="mt-3 overflow-y-auto max-h-[70vh] pb-5">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase">
                Si No
              </th>
              <th className="px-6 py-3 text-left text-lg font-medium text-black uppercase">
                User
              </th>
              <th className="px-6 py-3 text-left text-lg font-medium text-black uppercase">
                Module Access
              </th>
              <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase">
                Customize Permission
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-50 divide-y divide-gray-200 max-h-[80vh]">
            {users?.map((user, index) => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 text-center">
                  <span className="flex gap-2">
                    {user.moduleAccess.map((module, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-200 text-black rounded-md font-semibold text-xs"
                      >
                        {module}
                      </span>
                    ))}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-blue-500"
                  >
                    <img src={editIcon} alt="" className="w-6 h-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UsersTable;
