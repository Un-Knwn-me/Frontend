import React, { useEffect, useState } from "react";
import permissionUserIcon from "../../assets/permission-user-icon.svg";
import editIcon from "../../assets/edit-icon.svg";
import TopLayer from "../shared/TopLayer";
import plusIcon from "../../assets/add-icon.svg";
import profileImage from "../../assets/profile-image.png";
import closeIcon from "../../assets/close-modal-icon.svg";
import addUserIcon from "../../assets/add-users-icon.svg";

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

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/users.json"); // Fetching from the public folder
      const data = await response.json();
      setUsers(
        data.map((user) => ({
          ...user,
          permissions: shuffleArray(user.permissions),
        }))
      );
    };

    fetchUsers();
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

  const permissions = [
    "ADMIN",
    "PURCHASE ORDER",
    "STOCK IN",
    "STOCK OUT",
    "PRODUCT MASTER",
    "REPORTS"
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

  return (
    <>
      <TopLayer
        isAddButton={true}
        addButtonText="Add Module"
        addButtonIcon={plusIcon}
      />
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mt-4">
        {permissions.map((permission, permIndex) => (
          <div
            key={permIndex}
            className="md:max-w-[350px] min-w-[200px] lg:min-w-[340px] max-w-screen min-h-[200px] min-w-screen rounded-lg overflow-hidden shadow-lg p-4 border bg-white relative"
          >
            <div className="flex items-center mb-10 relative">
              <img
                src={permissionUserIcon}
                alt="Permission Icon"
                className="h-16 w-16"
              />
              <div className="flex-1 text-lg font-medium ml-1">
                {permission}
              </div>
              <img
                src={editIcon}
                alt="Edit Icon"
                className="w-6 h-6 absolute right-3 cursor-pointer"
                onClick={(e) => openModal(e, permission)}
              />
            </div>
            <div className="flex items-center relative bottom-4 flex-col">
              <div className="flex -space-x-3 absolute left-0">
                {users
                  .filter((user) => user.permissions.includes(permission))
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
                          className="w-10 h-10 rounded-full object-cover border-2"
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white border-2 ${bgColors[index % bgColors.length]
                            }`}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
              {tooltipStates[permission] && (
                <div
                  className="absolute"
                  style={{
                    zIndex: 1000,
                    top: tooltipStates[permission].top,
                    left: tooltipStates[permission].left,
                    position: "fixed",
                  }}
                >
                  <div
                    className="bg-white p-2 border rounded-tl-none rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-2xl flex flex-col gap-3 w-48"
                    onMouseLeave={hideToolTip}
                  >
                    <div className="flex gap-5 justify-center items-center">
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
                        <button className="bg-sky-600 w-full py-1 px-5 text-white font-bold rounded-md">Update</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {users.filter((user) => user.permissions.includes(permission))
                .length > 4 && (
                  <div className="flex whitespace-nowrap items-center justify-center ml-5">
                    +
                    {users.filter((user) => user.permissions.includes(permission))
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Users</h2>
            <button onClick={closeModal} className="font-bold">
              <img src={closeIcon} alt="" className="h-5 w-5" />
            </button>
          </div>
          <div className="flex justify-between px-2" >
            <input
              type="text"
              placeholder="Search by username..."
              className="px-3 py-2 mb-4 border rounded-md w-60"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="flex ml-10 text-center" >
              <img src={addUserIcon} alt="" className="h-8 w-8" />
              <span className="mt-1 ml-1" >Add users</span>
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
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${bgColors[index % bgColors.length]
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
    </>
  );
};

export default Permission;

