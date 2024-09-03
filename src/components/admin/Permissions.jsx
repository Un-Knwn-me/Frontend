import React, { useEffect, useState } from "react";
import permissionUserIcon from "../../assets/permission-user-icon.svg";
import { FcDepartment } from "react-icons/fc";
import editIcon from "../../assets/edit-icon.svg";
import TopLayer from "../shared/TopLayer";
import plusIcon from "../../assets/add-icon.svg";
import profileImage from "../../assets/profile-image.png";
import closeIcon from "../../assets/close-modal-icon.svg";
import addUserIcon from "../../assets/add-users-icon.svg";
import apiService from "../../apiService";
import { CiEdit } from "react-icons/ci";
import deleteIcon from "../../assets/delete-icon.svg";
import tickIcon from "../../assets/tick-icon.svg";
import { TbLockAccess } from "react-icons/tb";

const Permission = () => {
  const [tooltipStates, setTooltipStates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [addModuleModalVisible, setAddModuleModalVisible] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [department, setDepartment] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  const [permissionChanges, setPermissionChanges] = useState({});
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState("");

  const [users, setUsers] = useState([]);

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      const response = await apiService.get(`/users/depart/getall`);
      if (response.status === 200) {
        setDepartment(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching Modles:", error);
    }
  };

  // Fetch users based on department
  const fetchUsers = async (departmentId) => {
    try {
      const response = await apiService.get(
        `/users/department/${departmentId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const bgColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-red-500",
    "bg-maroon-500",
  ];

  const showToolTip = (e, permission) => {
    const rect = e.target.getBoundingClientRect();
    setTooltipStates((prevState) => ({
      ...prevState,
      [permission]: {
        visible: true,
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      },
    }));
  };

  const hideToolTip = () => {
    setTooltipStates({});
  };

  const handleDelete = (userData) => {};

  const openEditModal = (user) => {
    try {
      if (user === null) {
        console.log("no data available");
      }
      setModalData({
        ...user,
        user_permission: user.UserPermissions[0],
      });
      console.log(modalData);

      setSelectedPermission(user.department);
      setIsModalOpen(true);
    } catch (error) {}
  };

  const handleSaveClick = async () => {
    try {
      const userId = modalData.UserPermissions[0].user_id;
      const departmentId = modalData.UserPermissions[0].department_id;

      const response = await apiService.put(
        `/users/user-permissions/${userId}/${departmentId}`,
        permissionChanges
      );

      if (response.status === 200) {
        setPermissionChanges({});
        fetchUsers(departmentId);
        console.log("Permissions updated successfully:", response.data);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  // const openModal = (e, permission) => {
  //   const rect = e.target.getBoundingClientRect();
  //   setSelectedPermission(permission);
  //   setModalPosition({
  //     top: rect.bottom + window.scrollY,
  //     left: rect.left + window.scrollX,
  //   });
  //   setModalVisible(true);
  //   // Filter users based on the clicked permission
  //   const usersWithPermission = users.filter((user) =>
  //     user.permissions.includes(permission)
  //   );
  //   setUsers(usersWithPermission);
  // };

  const handlePermissionChange = (accessType) => {
    console.log(`accessTypes: ${accessType}`);

    // Create a new object for user permissions with the updated value
    const newPermissions = {
      ...modalData.user_permission,
      [accessType]: !modalData.user_permission[accessType],
    };

    // Update the modalData state
    setModalData((prevState) => ({
      ...prevState,
      user_permission: newPermissions,
    }));

    // Track changes separately, ensuring we update the correct accessType
    setPermissionChanges((prevChanges) => ({
      ...prevChanges,
      [accessType]: newPermissions[accessType],
    }));

    // Log the updated permission changes
    console.log("change: ", {
      ...permissionChanges,
      [accessType]: newPermissions[accessType],
    });
  };

  const openDeptModal = (dept) => {
    setSelectedPermission(dept.departmentName);
    setModalVisible(true);
    fetchUsers(dept.id); // Fetch users when a department is clicked
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPermission(null);
  };

  const openAddModuleModal = () => {
    setAddModuleModalVisible(true);
  };

  const closeAddModuleModal = () => {
    setAddModuleModalVisible(false);
  };

  const addNewModule = async () => {
    try {
      const response = await apiService.post(
        "/users/newDepartment",
        { departmentName: departmentName },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.status === 201) {
        setDepartmentName("");
        setSuccessMessage("Module added successfully.");
        setErrorMessage("");
        fetchDepartments();

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Module already exists.");

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      } else {
        setErrorMessage("Error adding brand.");

        // Clear messages after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);
      }
      setSuccessMessage("");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;

  return (
    <>
      <TopLayer
        isAddButton={false}
        addButtonText="Add Module"
        addButtonIcon={plusIcon}
        onAddButtonClick={openAddModuleModal}
      />
      <div className="grid gap-4 px-6 mt-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {department.map((dept, index) => (
          <div
            key={index}
            className="relative p-4 overflow-hidden bg-white border rounded-lg shadow-lg cursor-pointer"
            onClick={() => openDeptModal(dept)}
          >
            <div className="relative flex items-center mb-10">
              <div className="flex-1 ml-1 text-lg font-medium cursor-pointer">
                {dept.departmentName}
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-4/5 h-4/5 max-w-4xl max-h-[85vh]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                Department: {selectedPermission}
              </h2>
              <button onClick={closeModal} className="text-2xl font-bold">
                &times;
              </button>
            </div>

            <div className="flex items-center justify-between mt-4 mb-4">
              <div className="relative w-1/3">
                <input
                  type="text"
                  placeholder="Search by Username.."
                  className="w-full p-2 pl-4 pr-10 text-sm text-gray-700 bg-gray-100 rounded-md outline-none"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <button
                onClick={""}
                className="flex items-center px-4 py-2 ml-4 font-semibold "
              >
                <img
                  src={addUserIcon}
                  alt="Add Icon"
                  className="w-5 h-5 mr-2"
                />
                Add User
              </button>
            </div>

            <div className="flex flex-col h-full mt-4">
              <div className="flex-grow pb-5 mt-3 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="w-full bg-gray-100">
                    <tr>
                      <th className="w-20 px-6 py-2 font-medium text-center text-black uppercase text-md">
                        Si No
                      </th>
                      <th className="w-64 px-6 py-2 font-medium text-left text-black uppercase text-md">
                        User Name
                      </th>
                      <th className="px-6 py-2 font-medium text-left text-black uppercase text-md">
                        Module Access
                      </th>
                      <th className="w-40 px-6 py-2 font-medium text-center text-black uppercase text-md">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers
                      .slice(startIndex, endIndex)
                      .map((row, index) => {
                        const userPermissions = row.UserPermissions?.[0] || {};
                        return (
                          <tr key={row.id} style={{ maxHeight: "50px" }}>
                            <td className="w-20 px-2 py-2 text-center text-black whitespace-nowrap text-md">
                              {index + 1}
                            </td>
                            <td className="w-64 px-2 py-2 text-left text-black whitespace-nowrap text-md">
                              {row.full_name}
                            </td>
                            <td className="flex items-center gap-2 px-6 py-2 text-lg font-medium text-left text-black">
                              {userPermissions.create && (
                                <span className="p-2 text-xs font-semibold text-black bg-green-200 rounded-md">
                                  Create
                                </span>
                              )}
                              {userPermissions.read && (
                                <span className="p-2 text-xs font-semibold text-black bg-blue-200 rounded-md">
                                  Read
                                </span>
                              )}
                              {userPermissions.edit && (
                                <span className="p-2 text-xs font-semibold text-black bg-yellow-200 rounded-md">
                                  Edit
                                </span>
                              )}
                              {userPermissions.delete && (
                                <span className="p-2 text-xs font-semibold text-black bg-red-200 rounded-md">
                                  Delete
                                </span>
                              )}
                            </td>
                            <td className="w-40 px-2 py-2 text-center text-black whitespace-nowrap text-md">
                              <button
                                onClick={() => openEditModal(row)}
                                className="text-center text-blue-500"
                              >
                                <CiEdit color="black" className="h-6 w-7" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] max-w-4xl mx-4 sm:mx-6 lg:mx-8 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                Department: {selectedPermission}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-2xl font-bold text-gray-600 hover:text-gray-900"
              >
                &times;
              </button>
            </div>
            <form>
              <div className="flex justify-between gap-4 mb-6">
                <div className="flex items-center mb-4">
                  {modalData.profile ? (
                    <img
                      src={modalData.profile}
                      alt={modalData.full_name}
                      className="object-cover w-16 h-16 mr-4 rounded-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-16 h-16 mr-4 text-2xl text-white bg-blue-500 rounded-full">
                      {modalData.full_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div className="font-semibold">{modalData.full_name}</div>
                    <p>{modalData.phone_number}</p>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Module Access
                </label>
                <div className="space-y-4">
                  {["create", "read", "edit", "delete"].map((accessType) => (
                    <div
                      key={accessType}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {accessType}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={
                            modalData.user_permission?.[accessType] || false
                          }
                          onChange={() => handlePermissionChange(accessType)}
                          // setModalData({
                          //   ...modalData,
                          //   user_permission: {
                          //     ...modalData.user_permission,
                          //     [accessType]:
                          //       !modalData.user_permission?.[accessType],
                          //   },
                          // })
                          // }
                        />
                        <div className="relative h-6 bg-gray-200 rounded-full w-11 peer-checked:bg-blue-500">
                          <div
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                              modalData.user_permission?.[accessType]
                                ? "translate-x-5"
                                : ""
                            }`}
                          />
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveClick}
                  className="px-4 py-2 text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {addModuleModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={closeAddModuleModal}
          ></div>
          <div className="relative w-full max-w-md px-6 py-5 bg-white rounded-lg shadow-lg lg:max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Add New Module</h2>
              <button className="cursor-pointer" onClick={closeAddModuleModal}>
                <img src={closeIcon} alt="Close" className="w-6 h-6" />
              </button>
            </div>
            <hr className="w-full mb-4" />
            <div className="flex flex-col items-center">
              <input
                className="w-full max-w-sm px-4 py-3 mb-5 text-lg text-gray-700 bg-gray-200 rounded focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Enter module name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
              {successMessage && (
                <div className="w-full max-w-sm p-4 mb-4 text-green-700 bg-green-100 border-l-4 border-green-500">
                  <p>{successMessage}</p>
                </div>
              )}
              {errorMessage && (
                <div className="w-full max-w-sm p-4 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500">
                  <p>{errorMessage}</p>
                </div>
              )}
              <button
                className="w-full max-w-sm py-3 text-lg font-bold text-white rounded-lg bg-sky-600"
                onClick={addNewModule}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Permission;