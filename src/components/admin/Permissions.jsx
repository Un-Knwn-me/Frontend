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
import UserByDepartments from "./UserByDepartments";

// Utility function to shuffle an array
const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const Permission = () => {
  const [users, setUsers] = useState([]);
  const [tooltipStates, setTooltipStates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [addModuleModalVisible, setAddModuleModalVisible] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [department, setDepartment] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      const response = await apiService.get("/users/dept/getall");
      if(response.status === 200){
       setDepartment(response.data);
       console.log(response.data);
      }      
    } catch (error) {
      console.error("Error fetching Modles:", error);
    }
  };

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

  const permissions = [
    "ADMIN",
    "PURCHASE ORDER",
    "STOCK IN",
    "STOCK OUT",
    "PRODUCT MASTER",
    "REPORTS",
  ];

  const openModal = (e, permission) => {
    const rect = e.target.getBoundingClientRect();
    setSelectedPermission(permission);
    setModalPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setModalVisible(true);
    // Filter users based on the clicked permission
    const usersWithPermission = users.filter((user) =>
      user.permissions.includes(permission)
    );
    setUsers(usersWithPermission);
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

  const addNewModule = async() => {
    try {
      const response = await apiService.post("/users/newDepartment", {departmentName: departmentName}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
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

  return (
    <>
      <TopLayer
        isAddButton={true}
        addButtonText="Add Module"
        addButtonIcon={plusIcon}
        onAddButtonClick={openAddModuleModal}
      />
      <div className="grid gap-4 px-6 mt-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {department.map((dept, index) => (
          <div
            key={index}
            className="relative p-4 overflow-hidden bg-white border rounded-lg shadow-lg"
          >
            <div className="relative flex items-center mb-10">
            {/* <FcDepartment className="w-16 h-10"/> */}
              <img
                src={permissionUserIcon}
                alt="Permission Icon"
                className="w-16 h-16"
              />
              <div className="flex-1 ml-1 text-lg font-medium">
                {dept.departmentName}
              </div>
              <img
                src={editIcon}
                alt="Edit Icon"
                className="absolute w-6 h-6 cursor-pointer right-3"
                onClick={(e) => openModal(e, dept.id)}
              />
            </div>
            <div className="relative flex flex-col items-center bottom-4">
              {/* <div className="absolute left-0 flex -space-x-3">
                {users
                  .filter((user) => department.includes(departmentName))
                  .slice(0, 4)
                  .map((user, index) => (
                    <div
                      key={index}
                      className="relative inline-block cursor-pointer"
                      onClick={(e) => showToolTip(e, permission)}
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="object-cover w-10 h-10 border-2 rounded-full"
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white border-2 ${
                            bgColors[index % bgColors.length]
                          }`}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))}
              </div> */}
              {tooltipStates[department] && (
                <div
                  className="absolute"
                  style={{
                    zIndex: 1000,
                    top: tooltipStates[department].top,
                    left: tooltipStates[department].left,
                    position: "fixed",
                  }}
                >
                  <div
                    className="flex flex-col w-48 gap-3 p-2 bg-white border rounded-tl-none shadow-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-2xl"
                    onMouseLeave={hideToolTip}
                  >
                    <div className="flex items-center justify-center gap-5">
                      <img src={profileImage} alt="" className="h-14 w-14" />
                      <span className="text-lg font-semibold">Ram Kumar</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center justify-between">
                        <button className="px-2 py-1 text-black">View</button>
                        <input type="checkbox" className="mr-2" />
                      </label>
                      <label className="flex items-center justify-between">
                        <button className="px-2 py-1 text-black">Add</button>
                        <input type="checkbox" className="mr-2" />
                      </label>
                      <label className="flex items-center justify-between">
                        <button className="px-2 py-1 text-black">Edit</button>
                        <input type="checkbox" className="mr-2" />
                      </label>
                      <label className="flex items-center justify-between">
                        <button className="px-2 py-1 text-black">Delete</button>
                        <input type="checkbox" className="mr-2" />
                      </label>
                      <label className="flex items-center justify-between">
                        <button className="px-2 py-1 text-black">Export</button>
                        <input type="checkbox" className="mr-2" />
                      </label>
                      <div className="text-center">
                        <button className="w-full px-5 py-1 font-bold text-white rounded-md bg-sky-600">
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {users.filter((user) => user.permissions.includes(department))
                .length > 4 && (
                <div className="flex items-center justify-center ml-5 whitespace-nowrap">
                  +
                  {users.filter((user) => user.permissions.includes(department))
                    .length - 4}{" "}
                  more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalVisible && (
        <div
          className="absolute bg-white rounded-lg p-4 shadow-lg z-50 overflow-y-auto max-h-[400px] min-w-[300px] max-w-[600px]"
          style={{ top: modalPosition.top, left: modalPosition.left }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Users</h2>
            <button onClick={closeModal} className="font-bold">
              <img src={closeIcon} alt="" className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-between px-2">
            <input
              type="text"
              placeholder="Search by username..."
              className="px-3 py-2 mb-4 border rounded-md w-60"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="flex ml-10 text-center">
              <img src={addUserIcon} alt="" className="w-8 h-8" />
              <span className="mt-1 ml-1">Add users</span>
            </button>
          </div>
          <div className="flex flex-col flex-wrap gap-4">
            {users
              .filter((user) =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((user, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 border rounded-md"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="object-cover w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                        bgColors[index % bgColors.length]
                      }`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{user.name}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {addModuleModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={closeAddModuleModal}
          ></div>
          <div className="relative px-4 pb-6 overflow-y-auto bg-white rounded-lg shadow-lg lg:overflow-hidden">
            <div className="flex flex-col p-5">
              <div>
                <div className="flex justify-center">
                  <h2 className="text-2xl font-bold">Add New Module</h2>
                  <button
                    className="absolute cursor-pointer right-5"
                    onClick={closeAddModuleModal}
                  >
                    <img src={closeIcon} alt="Close" className="mt-2" />
                  </button>
                </div>
                <hr className="w-full mt-3" />
              </div>
              <div className="flex flex-col items-center">
                <input
                  className="px-4 py-3 my-5 text-lg text-center text-gray-700 bg-gray-200 rounded w-80 focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Enter module name"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                />
                {successMessage && (
              <div className="p-4 my-4 text-green-700 bg-green-100 border-l-4 border-green-500">
                <p>{successMessage}</p>
              </div>
            )}
            {errorMessage && (
              <div className="p-4 my-4 text-red-700 bg-red-100 border-l-4 border-red-500">
                <p>{errorMessage}</p>
              </div>
            )}
                <button
                  className="py-3 mt-3 text-lg font-bold text-white rounded-lg bg-sky-600 w-80"
                  onClick={() => addNewModule()}
                >
                  Update
                </button>
 
              </div>
            </div>
          </div>
        </div>
      )}
      <UserByDepartments />
    </>
  );
};

export default Permission;