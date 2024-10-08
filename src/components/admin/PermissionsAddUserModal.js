import React, { useState, useEffect } from "react";
import closeIcon from "../../assets/close-modal-icon.svg";
import apiService from "../../apiService";

const PermissionsAddUserModal = ({
  isVisible,
  onClose,
  selectedDeptId,
  fetchUsers,
  fetchAminUsers
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissionsUsers, setPermissionsUsers] = useState("");

  // Suggestion PermissionsUsers states
  const [permissionsUsersDropdown, setPermissionsUsersDropdown] =
    useState(false);
  const [permissionsUsersSuggestions, setPermissionsUsersSuggestions] =
    useState([]);
  const [selectedPermissionsUsersId, setSelectedPermissionsUsersId] =
    useState(null);

  const [isAdmin, setIsAdmin] = useState(false);

  const fetchPermissionsUsersSuggestions = async (permissionsUsersInput) => {
    try {
      if (permissionsUsersInput.length > 0) {
        const response = await apiService.get("/users/getall");
        const filteredPermissionsUsers = response.data.filter((b) =>
          b.full_name
            .toLowerCase()
            .startsWith(permissionsUsersInput.toLowerCase())
        );
        console.log(filteredPermissionsUsers);
        setPermissionsUsersSuggestions(filteredPermissionsUsers);
      } else {
        setPermissionsUsersSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching PermissionsUsers:", error);
    }
  };

  const handlePermissionsUsersChange = (e) => {
    const permissionsUsersInput = e.target.value;
    setPermissionsUsers(permissionsUsersInput);
    setPermissionsUsersDropdown(true);
    fetchPermissionsUsersSuggestions(permissionsUsersInput);
    if (permissionsUsersInput === "") {
      setSelectedPermissionsUsersId(null);
    }
  };

  const handlePermissionsUsersSelect = (user) => {
    setPermissionsUsers(user.full_name);
    setSelectedPermissionsUsersId(user.id);
    setPermissionsUsersSuggestions([]);
    setPermissionsUsersDropdown(false);
    setSelectedUser(user.full_name);
    setIsAdmin(user.is_admin);
  };

  const handleAddNewPermissionsUsers = async () => {
    console.log(selectedDeptId);
    console.log("Adding new user:", selectedPermissionsUsersId);

    let updatedData = {
      user_id: selectedPermissionsUsersId,
      department_id: selectedDeptId,
    };

    try {
      const response = await apiService.post(
        "/users/newPermission",
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        console.log("User added successfully.");
        onClose();
        setPermissionsUsers("");
        fetchUsers(selectedDeptId);
      } else {
        console.error("Failed to add new user:", response.data);
      }
    } catch (error) {
      console.error("Error adding new user:", error);
    }
  };

  const handleAddNewAdmin = async () => {
    const newAdmin = !isAdmin;

    try {
      const response = await apiService.put(
        `/users/${selectedPermissionsUsersId}`,
        { is_admin: newAdmin },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Admin status updated", response.data);
        onClose(); 
        setPermissionsUsers("");
        fetchAminUsers();
      } else {
        console.warn("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Update failed:", error.response || error.message);
      onClose(); 
    }
  };

  const handleClose = () => {
    setPermissionsUsers("");
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-3/5 h-56 max-w-2xl p-4 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Add User</h2>
          <button onClick={handleClose} className="text-2xl font-bold">
            <img src={closeIcon} alt="Close" />
          </button>
        </div>
        <div className="relative flex items-center mt-4 space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by Username..."
              className="w-full p-2 pl-4 pr-10 text-sm text-gray-700 bg-gray-100 rounded-md outline-none"
              value={permissionsUsers}
              onChange={handlePermissionsUsersChange}
            />
            {permissionsUsersDropdown && permissionsUsers && (
              <ul className="absolute left-0 z-10 w-full mt-2 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg top-full max-h-60">
                {permissionsUsersSuggestions.length > 0 ? (
                  permissionsUsersSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      className="px-2 py-1 cursor-pointer hover:bg-gray-200"
                      onClick={() => handlePermissionsUsersSelect(suggestion)}
                    >
                      {suggestion.full_name}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-sm text-blue-600 cursor-pointer hover:bg-gray-200">
                    Add New Users: "{permissionsUsers}"
                  </li>
                )}
              </ul>
            )}
          </div>
          <button
            onClick={() => {
              handleAddNewPermissionsUsers();
              handleAddNewAdmin();
            }}
            className="px-4 py-2 text-white bg-blue-500 rounded-md"
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsAddUserModal;