import React, { useState, useEffect } from "react";
import editIcon from "../../assets/edit-icon-blue-color.svg";
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
}) => {
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const [userData, setUserData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    profile: "",
    password: "",
    UserPermissions: [],
    is_admin: false,
  });

  useEffect(() => {
    if (selectedUsersId) {
      fetchUserData(selectedUsersId);
    }
  }, [selectedUsersId]);

  const fetchUserData = async (selectedUsersId) => {
    try {
      const response = await apiService.get(`/users/${selectedUsersId}`);
      const fetchedUserData = response.data;
      console.log(response.data);

      // Ensure moduleAccess is an array
      setUserData({
        ...fetchedUserData,
        UserPermissions: fetchedUserData.is_admin
          ? [...new Set([...fetchedUserData.UserPermissions, "ADMIN"])]
          : fetchedUserData.UserPermissions || [],
      });
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error.response || error.message
      );
    }
  };

  const handlePermissionToggle = async (permission) => {
    const permissionName = permission.departmentName;
    const isAdminToggling = permissionName === "ADMIN";

    setUserData((prevUserData) => {
      const existingPermission = prevUserData.UserPermissions.find(
        (perm) => perm.Department?.departmentName === permissionName
      );

      let newPermissions;
      let newIsAdmin = prevUserData.is_admin;

      if (existingPermission) {
        // If the permission exists, remove it
        newPermissions = prevUserData.UserPermissions.filter(
          (perm) => perm.Department?.departmentName !== permissionName
        );

        // If toggling "ADMIN", update is_admin to false
        if (isAdminToggling) {
          newIsAdmin = false;
        }
      } else {
        // If the permission doesn't exist, add it
        newPermissions = [
          ...prevUserData.UserPermissions,
          { Department: { departmentName: permissionName } },
        ];

        // If toggling "ADMIN", update is_admin to true
        if (isAdminToggling) {
          newIsAdmin = true;
        }
      }

      return {
        ...prevUserData,
        UserPermissions: newPermissions,
        is_admin: newIsAdmin,
      };
    });

    try {
      if (
        userData.UserPermissions.some(
          (perm) => perm.Department?.departmentName === permissionName
        )
      ) {
        // If the permission was there, delete it on the server
        await apiService.delete("/delete/userPermission", {
          data: { user_id: selectedUsersId, department_id: permission.id },
        });
      } else {
        // If the permission wasn't there, add it on the server
        await apiService.post("/users/newPermission", {
          user_id: selectedUsersId,
          department_id: permission.id,
        });
      }
      console.log("Permission updated successfully.");
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
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center bg-blue-500 text-white mr-4 text-2xl`}
                >
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
                      userData.UserPermissions.includes("ADMIN")
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    {userData.UserPermissions.includes("ADMIN")
                      ? "Access"
                      : "No Access"}
                  </span>
                  <button
                    onClick={() => handlePermissionToggle("ADMIN")}
                    className="mr-4"
                    disabled={userData.is_admin && "ADMIN" !== "ADMIN"}
                  >
                    <img
                      src={
                        userData.UserPermissions.includes("ADMIN")
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
                          disabled={
                            userData.is_admin &&
                            permission.departmentName !== "ADMIN"
                          }
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