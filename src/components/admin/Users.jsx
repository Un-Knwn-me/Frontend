import React, { useState, useEffect } from "react";
import editIcon from "../../assets/edit-icon.svg";
import addusersIcon from "../../assets/add-users-icon.svg";
import TopLayer from "../shared/TopLayer";
import AddUserModal from "./AddUserModal";
// import EditModal from "./EditUsersModal";
import EditUsersModal from "./EditUsersModal";
import apiService from "../../apiService";
import tickIcon from "../../assets/tick-icon.svg";
import deleteIcon from "../../assets/delete-icon.svg";
import { TbLockAccess } from "react-icons/tb";
import { CiEdit } from "react-icons/ci";
import EditUserProfileModal from "./EditUserProfileModal";

const UsersTable = ({searchQuery}) => {
  const [initialData, setInitialData] = useState([]);
  const [filteredData, setFilteredData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUserEditOpen, setIsUserEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [selectedUsersId, setSelectedUsersId] = useState(null);
  const [permissions, setPermissions] = useState([]);


  useEffect(() => {
    getAllUsers();
    getPermissions();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, users]);

  // const permissions = [
  //   "ADMIN",
  //   "PURCHASE ORDER",
  //   "STOCK IN",
  //   "STOCK OUT",
  //   "PRODUCT MASTER",
  //   "REPORTS",
  // ];

  const getAllUsers = async () => {
    try {
      const response = await apiService.get(`/users/getall`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setUsers(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

    // Fetch permissions data
    const getPermissions = async () => {
      try {
        const response = await apiService.get(`/users/depart/getall`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setPermissions(response.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
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

  const handleDelete = (userData) => {};

  // const openEditModal = (user) => {
  //   setSelectedUser(user);
  //   setIsEditModalOpen(true);
  // };

  // Function to open the edit user modal and fetch user data
  const openEditModal = async (user) => {
    try {
      const response = await apiService.get(`/users/${user.id}`);
      console.log(response.data); 
      setSelectedUser(response.data);
      setSelectedUsersId(user.id);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error(`Error fetching user ${user.id}:`, error);
    }
  };

  

   // Function to open the edit user modal and fetch user data
   const openEditUserModal = async (user) => {
    try {
      const response = await apiService.get(`/users/${user.id}`);
      console.log(response.data); 
        setSelectedUser(response.data);
        setSelectedUsersId(user.id);
      setIsUserEditOpen(true);
    } catch (error) {
      console.error(`Error fetching user ${user.id}:`, error);
    }
  };

   // handle save button click
   const handleSaveClick = async (index, id) => {
    console.log('save clicked')
    // try {
    //   const response = await apiService.put(`/users/${id}`, {
    //     brandName: editedBrandName,
    //   }, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   if (response.status === 200) {
    //     getAllUsers();
    //     setEditIndex(null);
    //   }
    // } catch (error) {
    //   console.error(`Error saving brand with ID ${id}:`, error);
    //   // Handle error as needed
    // }
  };

  // Function to handle user update from EditUsersModal
  const handleEditUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (
      direction === "next" &&
      currentPage < Math.ceil(users.length / recordsPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = (searchValue) => {
    if (searchValue) {
      const filtered = users.filter(item =>
        item.full_name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(users);
    }
    setCurrentPage(1); // Reset to first page on new search
  };

 

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <>
      <TopLayer
        isSearch={true}
        onSearch={handleSearch}
        isAddButton={true}
        addButtonIcon={addusersIcon}
        addButtonText="Add User "
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
          selectedUsersId={selectedUsersId}
        />
      )}
      {isUserEditOpen && (
        <EditUserProfileModal
          // user={users[0]}
          user={selectedUser}
          onClose={() => setIsUserEditOpen(false)}
          permissions={permissions}
          onUpdate={handleEditUser}
          userId={selectedUsersId}
        />
      )}
      <div className="mt-3 overflow-y-auto max-h-[70vh] pb-5">
      <table className="min-w-full divide-y divide-gray-200">
          <thead className="w-full bg-gray-50">
            <tr>
              <th className="w-20 px-6 py-2 font-medium text-center text-black uppercase text-md">
                Si No
              </th>
              <th className="px-6 py-2 font-medium text-left text-black uppercase text-md w-28">
                Profile
              </th>
              <th className="w-64 px-6 py-2 font-medium text-left text-black uppercase text-md">
                User Name
              </th>
              <th className="px-6 py-2 font-medium text-left text-black uppercase text-md">
                Module Access
              </th>
              <th className="w-40 px-6 py-2 font-medium text-center text-black uppercase text-md">
                Permission
              </th>
              <th className="w-40 px-6 py-2 font-medium text-center text-black uppercase text-md">
                Action
              </th>
              <th className="w-32 px-2 py-2 font-bold text-center text-black uppercase text-md">
                <button onClick={handleDelete} className="text-red-500">
                  <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData?.map((row, index) => (
              <tr key={row.id} style={{ maxHeight: "50px" }}>
                <td className="w-20 px-2 py-2 text-center text-black whitespace-nowrap text-md">
                  {startIndex + index + 1}
                </td>
                <td className="px-2 py-2 text-center text-black whitespace-nowrap text-md w-28">
                      <div className="flex items-center justify-center">
                      {row.profile ? (
                                <img
                                    src={row.profile}
                                    alt={row.full_name}
                                    className="object-cover w-16 h-16 mr-4 rounded-full"
                                />
                            ) : (
                                <div
                                    className={`w-16 h-16 rounded-full flex items-center justify-center bg-blue-500 text-white mr-4 text-2xl`}
                                >
                                    {row.full_name.charAt(0).toUpperCase()}
                                </div>
                            )}
                      </div>
                    </td>
                <td className="w-64 px-6 py-2 text-left text-black whitespace-nowrap text-md">
                    {row.full_name}
                </td>
                <td className="flex items-center content-center gap-2 px-6 py-6 text-lg font-medium text-left text-black uppercase">
                  {row.is_admin ? 
                    <span className="p-2 text-xs font-semibold text-black bg-blue-200 rounded-md">
                      Admin
                    </span>
                    : ''}
                </td>
                <td className="w-40 px-2 py-2 text-center text-black whitespace-nowrap text-md">
                  {editIndex === row.id ? (
                    <button
                      onClick={() => handleSaveClick(index, row.id)}
                      className="flex px-2 py-1 bg-green-200 border border-green-500 rounded-lg"
                    >
                      <img src={tickIcon} alt="" className="mt-1 mr-2" />
                      <span className="text-xs">Update</span>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        openEditModal({
                          id: row.id,
                        })
                      }
                      className="text-center text-blue-500"
                    >
                    <TbLockAccess color="black" className="h-6 w-7"/>
                    </button>
                  )}
                </td>
                <td className="w-40 px-2 py-2 text-center text-black whitespace-nowrap text-md">
                  {editIndex === row.id ? (
                    <button
                      onClick={() => handleSaveClick(index, row.id)}
                      className="flex px-2 py-1 bg-green-200 border border-green-500 rounded-lg"
                    >
                      <img src={tickIcon} alt="" className="mt-1 mr-2" />
                      <span className="text-xs">Update</span>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        openEditUserModal({
                          id: row.id,
                        })
                      }
                      className="text-center text-blue-500"
                    >
                    <CiEdit color="black" className="h-6 w-7"/>
                    </button>
                  )}
                </td>
                <td className="w-32 px-2 py-2 text-center text-black whitespace-nowrap text-md">
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="text-red-500"
                  >
                    <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
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