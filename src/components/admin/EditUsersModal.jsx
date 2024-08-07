import React, { useState } from "react";
import editIcon from "../../assets/edit-icon-blue-color.svg";
import toggleActive from "../../assets/toggle-active.svg";
import toggleInactive from "../../assets/toggle-inactive.svg";
import closeIcon from "../../assets/close-modal-icon.svg";
import EditUserProfileModal from "./EditUserProfileModal";
import apiService from "../../apiService";

const EditUsersModal = ({ user, onClose, onUpdate, permissions }) => {
    const [editedUser, setEditedUser] = useState({
        ...user,
        moduleAccess: user.moduleAccess || [], // Ensure moduleAccess is defined
      });
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

    const handlePermissionToggle = (permission) => {
        setEditedUser((prevUser) => ({
            ...prevUser,
            moduleAccess: prevUser.moduleAccess.includes(permission)
                ? prevUser.moduleAccess.filter((item) => item !== permission)
                : [...prevUser.moduleAccess, permission],
        }));
    };

    const handleUpdate = async () => {
        try {
          const response = await apiService.put(`/users/${editedUser.id}`, {
            full_name: editedUser.name,
            email: editedUser.email,
            phone_number: editedUser.phone,
            is_admin: editedUser.isAdmin,
          });
          console.log("User updated:", response.data);
          onUpdate(editedUser); // Call the onUpdate prop to refresh the user data
          onClose(); // Close the modal
        } catch (error) {
          console.error("Update failed:", error);
        }
      };

    const openEditProfileModal = () => {
        setIsEditProfileModalOpen(!isEditProfileModalOpen);
    }

    const handleUpdateUser = (updatedUser) => {
        setEditedUser(updatedUser);
        setIsEditProfileModalOpen(false);
        onUpdate(updatedUser);
      };

    const handleDelete = async () => {
        try {
            await apiService.delete(`/users/${editedUser.id}`);
            console.log("User deleted");
            onUpdate(); // Call the onUpdate prop to refresh the user data
            onClose(); // Close the modal
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    return (
        <>
        {!isEditProfileModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 w-[600px]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Profile</h2>
                            <button onClick={onClose} className="font-bold">
                                <img src={closeIcon} alt="" className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex items-center mb-4">
                            {user.profile ? (
                                <img
                                    src={user.profile}
                                    alt={user.full_name}
                                    className="w-16 h-16 rounded-full object-cover mr-4"
                                />
                            ) : (
                                <div
                                    className={`w-16 h-16 rounded-full flex items-center justify-center bg-blue-500 text-white mr-4 text-2xl`}
                                >
                                    {user.full_name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex" >
                                <div className="font-semibold">{user.full_name}</div>
                                <button className="text-blue-500 flex ml-5" onClick={openEditProfileModal}>
                                    <img src={editIcon} alt="Edit" className="w-6 h-6" />
                                    <span className="text-lg underline" >Edit Profile</span>
                                </button>
                            </div>
                        </div>
                        <div>
                            {permissions.map((permission) => (
                                <>
                                <div key={permission} className="flex items-center mb-2 justify-between">
                                    <div className="mr-2">{permission}</div>
                                    <div className="flex items-center">
                                        <span className={`mr-2 ${editedUser.moduleAccess.includes(permission) ? 'text-green-600' : 'text-gray-400'}`}>
                                            {editedUser.moduleAccess.includes(permission) ? "Access" : "Not Access"}
                                        </span>
                                        <button
                                            onClick={() => handlePermissionToggle(permission)}
                                            className="mr-4"
                                        >
                                            <img
                                                src={
                                                    editedUser.moduleAccess.includes(permission)
                                                        ? toggleActive
                                                        : toggleInactive
                                                }
                                                alt="Toggle"
                                                className="w-10 h-10"
                                            />
                                        </button>
                                    </div>
                                </div>
                    <hr className="my-2 border border-gray-200 w-full" />
                </>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={handleUpdate}
                                className="bg-blue-500 text-white py-2 px-4 rounded-md font-semibold"
                            >
                                Update
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white py-2 px-5 rounded-md font-semibold"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
        )}
        {isEditProfileModalOpen && (
            <EditUserProfileModal
                user={editedUser}
                onClose={() => setIsEditProfileModalOpen(false)}
                onUpdate={handleUpdateUser}
            />
    )}
        </>
    );
};

export default EditUsersModal;
