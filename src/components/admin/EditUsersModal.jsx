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
        moduleAccess: user.moduleAccess || [], 
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
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Profile</h2>
                            <button onClick={onClose} className="font-bold">
                                <img src={closeIcon} alt="" className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center mb-4">
                            {user.profile ? (
                                <img
                                    src={user.profile}
                                    alt={user.full_name}
                                    className="object-cover w-16 h-16 mr-4 rounded-full"
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
                                <button className="flex ml-5 text-blue-500" onClick={openEditProfileModal}>
                                    <img src={editIcon} alt="Edit" className="w-6 h-6" />
                                    <span className="text-lg underline" >Edit Profile</span>
                                </button>
                            </div>
                        </div>
                        <div>
                            {permissions.map((permission) => (
                                <>
                                <div key={permission} className="flex items-center justify-between mb-2">
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
                    <hr className="w-full my-2 border border-gray-200" />
                </>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md"
                            >
                                Update
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-5 py-2 font-semibold text-white bg-red-500 rounded-md"
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
