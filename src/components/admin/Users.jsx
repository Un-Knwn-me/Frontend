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

const UsersTable = ({searchQuery}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  useEffect(() => {
    getAllUsers();
  }, []);

  const permissions = [
    "ADMIN",
    "PURCHASE ORDER",
    "STOCK IN",
    "STOCK OUT",
    "PRODUCT MASTER",
    "REPORTS",
  ];

  const getAllUsers = async () => {
    try {
      const response = await apiService.get(`/users/getall`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setUsers(response.data);
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

  const handleDelete = (userData) => {};

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

   // handle save button click
   const handleSaveClick = async (index, id) => {
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

  // const filteredData = users.filter(
  //   (item) =>
  //     item.full_name &&
  //     item.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  // const currentData = filteredData.slice(startIndex, endIndex);

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
          <thead className="bg-gray-50 w-full">
            <tr>
              <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase w-28">
                Si No
              </th>
              <th className="px-6 py-3 text-left text-lg font-medium text-black uppercase w-64">
                User Name
              </th>
              <th className="px-6 py-3 text-left text-lg font-medium text-black uppercase">
                Module Access
              </th>
              <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase w-40">
                Permission
              </th>
              <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-48">
                <button onClick={handleDelete} className="text-red-500">
                  <img src={deleteIcon} alt="Delete" className="h-5 w-5" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.map((row, index) => (
              <tr key={row.id} style={{ maxHeight: "50px" }}>
                <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-12">
                  {startIndex + index + 1}
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-md text-left text-black w-28">
                  {editIndex === row.id ? (
                    <input
                      type="text"
                      // value={editedBrandName}
                      // onChange={handleInputChange}
                      className="border border-gray-300 rounded-md w-28 px-2 py-2"
                    />
                  ) : (
                    row.full_name
                  )}
                </td>
                <td className="px-6 py-3 text-left text-lg font-medium text-black uppercase flex gap-2">
                {row.is_admin? 
                <span className="p-2 bg-blue-200 text-black rounded-md font-semibold text-xs">
                  Admin 
                </span>
                : ''}
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-40">
                  {editIndex === row.id ? (
                    <button
                      onClick={() => handleSaveClick(index, row.id)}
                      className="bg-green-200 border border-green-500 px-2 py-1 rounded-lg flex"
                    >
                      <img src={tickIcon} alt="" className="mt-1 mr-2" />
                      <span className="text-xs">Update</span>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        openEditModal({
                          id: row.id,
                          brandName: row.brandName,
                        })
                      }
                      className="text-blue-500 text-center"
                    >
                    <TbLockAccess color="black" className="h-6 w-7"/>
                      {/* <img src={LiaExpeditedssl} alt="Edit" className="h-5 w-5" /> */}
                    </button>
                  )}
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-md text-center text-black w-24">
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="text-red-500"
                  >
                    <img src={deleteIcon} alt="Delete" className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase w-28">
                Si No
              </th>
              <th className="px-6 py-3 text-left text-lg font-medium text-black uppercase w-64">
                User
              </th>
              <th className="px-6 py-3 text-left text-lg font-medium text-black uppercase">
                Module Access
              </th>
              <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase w-64">
                Edit Permission
              </th>
              <th className="px-2 py-3 text-center text-md font-bold text-black uppercase w-48">
                <button onClick={handleDelete} className="text-red-500">
                  <img src={deleteIcon} alt="Delete" className="h-5 w-5" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-50 divide-y divide-gray-200 max-h-[80vh]">
            {users?.map((user, index) => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.full_name}</td>
                {/* <td className="px-6 py-4 text-center">
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
                </td> */}
                {/* <td className="px-6 py-4 text-left">
                {user.is_admin? 
                <span className="p-2 bg-blue-200 text-black rounded-md font-semibold text-xs">
                  Admin 
                </span>
                : ''}
                </td> */}
                {/* <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-blue-500"
                  >
                    <img src={editIcon} alt="" className="w-6 h-6" />
                  </button>
                </td> */}
              {/* </tr>
            ))}
          </tbody>
        </table>  */}

      </div>
    </>
  );
};

export default UsersTable;