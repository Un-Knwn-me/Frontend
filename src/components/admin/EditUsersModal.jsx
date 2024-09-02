import React, { useState, useEffect } from "react";
import toggleActive from "../../assets/toggle-active.svg";
import toggleInactive from "../../assets/toggle-inactive.svg";
import closeIcon from "../../assets/close-modal-icon.svg";
import EditUserProfileModal from "./EditUserProfileModal";
import apiService from "../../apiService";

const EditUsersModal = ({
  user,
  onClose,
  onUpdate,
  permissions,
  selectedUsersId,
  getAllUsers
}) => {
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [userData, setUserData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    profile: "",
    password: "",
    UserPermissions: [{ Department: { departmentName: "" } }],
    is_admin: false,
  });

  useEffect(() => {
    if (selectedUsersId) {
      fetchUserData(selectedUsersId);
    }
  }, [selectedUsersId, isAdmin]);

  const fetchUserData = async (selectedUsersId) => {
    try {
      const response = await apiService.get(`/users/${selectedUsersId}`);
      const fetchedUserData = response.data;
      console.log(response.data);

      setUserData({
        ...fetchedUserData,
        UserPermissions: fetchedUserData.is_admin
          ? [{ Department: { departmentName: "ADMIN" } }]
          : fetchedUserData.UserPermissions || [],
      });
      setIsAdmin(fetchedUserData.is_admin);
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error.response || error.message
      );
    }
  };

  const handleAdminToggle = async () => {
    const newAdmin = !isAdmin;

    try {
      const response = await apiService.put(
        `/users/${selectedUsersId}`,
        {is_admin: newAdmin},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      onUpdate(response.data);      
      setIsAdmin(response.data.is_admin);
      console.log("Admin status updated", response.data);
  
    } catch (error) {
      console.error("Update failed:", error.response || error.message);
    }
  };

  const handlePermissionToggle = async (permission) => {
    const isPermissionActive = userData.UserPermissions.some(
      (perm) => perm?.Department?.id === permission.id
    );
    console.log("Permission toggled:", permission, isPermissionActive);
    let updatedData = {
      user_id: selectedUsersId,
      department_id: permission.id,
    };

    try {
      if (!isPermissionActive) {
        // Add the new permission to the server (toggle switched to true)
        const response = await apiService.post("/users/newPermission", updatedData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          fetchUserData(selectedUsersId);
          console.log("Permission added successfully.");
          getAllUsers()
        }
      } else {
        console.log('working', updatedData)
        // Delete the permission from the server (toggle switched to false)
        const response = await apiService.delete(`/users/delete/userPermission/${selectedUsersId}/${permission.id}`);
        if (response.status === 202) {
          fetchUserData(selectedUsersId);
          console.log("Permission deleted successfully.", response);
          getAllUsers()
        }
      }
    } catch (error) {
      console.error(
        "Error updating permission:",
        error.response || error.message
      );
    }
  };

  const openEditProfileModal = () => {
    setIsEditProfileModalOpen(!isEditProfileModalOpen);
  };

  const handleUpdateUser = (updatedUser) => {
    setUserData(updatedUser);
    setIsEditProfileModalOpen(false);
    onUpdate(updatedUser);
  };

  return (
    <>
      {!isEditProfileModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 w-[600px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Profile</h2>
              <button onClick={onClose} className="font-bold">
                <img src={closeIcon} alt="" className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center mb-4">
              {userData.profile ? (
                <img
                  src={userData.profile}
                  alt={userData.full_name}
                  className="object-cover w-16 h-16 mr-4 rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center w-16 h-16 mr-4 text-2xl text-white bg-blue-500 rounded-full">
                  {userData.full_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col">
                <div className="font-semibold">{userData.full_name}</div>
                <p>{userData.phone_number}</p>
              </div>
            </div>
            <div>
              {/* Handle the static "ADMIN" permission separately */}
              <div className="flex items-center justify-between mb-2">
                <div className="mr-2">ADMIN</div>
                <div className="flex items-center">
                  <span
                    className={`mr-2 ${
                      userData.is_admin ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {userData.is_admin ? "Access" : "No Access"}
                  </span>
                  <button
                    onClick={handleAdminToggle}
                    className="mr-4"
                    // disabled={userData.is_admin}
                  >
                    <img
                      src={userData.is_admin ? toggleActive : toggleInactive}
                      alt="Toggle"
                      className="w-10 h-10"
                    />
                  </button>
                </div>
              </div>
              <hr className="w-full my-2 border border-gray-200" />

              {/* Now map the dynamic permissions from the API */}
              {permissions.map((permission) => {
                const isPermissionActive = userData.UserPermissions.some(
                  (perm) =>
                    perm?.Department?.departmentName ===
                    permission.departmentName
                );

                return (
                  <React.Fragment key={permission.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="mr-2">{permission.departmentName}</div>
                      <div className="flex items-center">
                        <span
                          className={`mr-2 ${
                            isPermissionActive
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {isPermissionActive ? "Access" : "No Access"}
                        </span>
                        <button
                          onClick={() => handlePermissionToggle(permission)}
                          className="mr-4"
                          disabled={isAdmin}
                        >
                          <img
                            src={
                              userData.UserPermissions.some(
                                (perm) =>
                                  perm.Department?.departmentName ===
                                  permission.departmentName
                              )
                                ? toggleActive
                                : toggleInactive
                            }
                            alt="Toggle"
                            className="w-10 h-10"
                          />
                        </button>
                      </div>
                    </div>
                    <hr className="w-full my-2 border border-gray-200" />
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {isEditProfileModalOpen && (
        <EditUserProfileModal
          user={userData}
          onClose={() => setIsEditProfileModalOpen(false)}
          onUpdate={handleUpdateUser}
        />
      )}
    </>
  );
};

export default EditUsersModal;