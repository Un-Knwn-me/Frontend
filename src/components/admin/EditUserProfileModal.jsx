import React, { useState } from "react";
// import editIcon from "../../assets/edit-icon-blue-color.svg";
import closeIcon from "../../assets/close-modal-icon.svg";
import profileImage from "../../assets/profile-image.jpeg";
import apiService from "../../apiService";

const EditUserProfileModal = ({ user, onClose, onUpdate }) => {
  const [editedUser, setEditedUser] = useState(user);
  const [editingField, setEditingField] = useState(null); // State to track which field is being edited





  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleEditClick = (fieldName) => {
    setEditingField(fieldName); // Set the field to be edited
  };

  // const handleUpdate = () => {
  //     onUpdate(editedUser);
  //     onClose();
  // };

 
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

  const handleRemovePhoto = async () => {
    try {
      const response = await apiService.delete(
        `/users/deleteProfile/${editedUser.id}`
      );
      console.log("Profile image removed", response.data);
      setEditedUser((prevUser) => ({
        ...prevUser,
        avatar: null,
      }));
    } catch (error) {
      console.error("Remove photo failed:", error);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-[40vw]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit user profile</h2>
          <button onClick={onClose} className="font-bold">
            <img src={closeIcon} alt="Close" className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col items-center mb-4">
        {user.avatar ? (
            <img
              src={profileImage}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
          ) : (
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center bg-gray-500 text-white mb-4 text-2xl`}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex space-x-4">
            <button className="text-blue-600 flex items-center underline">
              <span>Change photo</span>
            </button>
            <button
              className="text-red-500 flex items-center underline"
              onClick={handleRemovePhoto}
            >
              <span>Remove photo</span>
            </button>
          </div>
        </div>
        <div className="mb-4 border-b pb-2">
          <label className="block mb-2 text-gray-400">User name</label>
          <div className="flex items-center justify-between">
            {editingField === "name" ? (
              <input
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                className="w-full focus:bg-gray-200 px-4 py-2 focus:outline-none"
              />
            ) : (
              <span className="text-black">{editedUser.name}</span>
            )}
            <button
              className="text-gray-400 flex items-center"
              onClick={() => handleEditClick("name")}
            >
              <span>Edit</span>
            </button>
          </div>
        </div>
        <div className="mb-4 border-b pb-2">
          <label className="block mb-2 text-gray-400">Phone number</label>
          <div className="flex items-center justify-between">
            {editingField === "phone" ? (
              <input
                type="text"
                name="phone"
                value={editedUser.phone}
                onChange={handleInputChange}
                className="w-full focus:bg-gray-200 px-4 py-2 focus:outline-none"
              />
            ) : (
              <span className="text-black">{editedUser.phone}</span>
            )}
            <button
              className="text-gray-400 flex items-center"
              onClick={() => handleEditClick("phone")}
            >
              <span>Edit</span>
            </button>
          </div>
        </div>
        <div className="mb-4 border-b pb-2">
          <label className="block mb-2 text-gray-400">Email</label>
          <div className="flex items-center justify-between">
            {editingField === "email" ? (
              <input
                type="text"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
                className="w-full focus:bg-gray-200 px-4 py-2 focus:outline-none"
              />
            ) : (
              <span className="text-black">{editedUser.email}</span>
            )}
            <button
              className="text-gray-400 flex items-center"
              onClick={() => handleEditClick("email")}
            >
              <span>Edit</span>
            </button>
          </div>
        </div>
        <div className="mb-4 border-b pb-2">
          <label className="block mb-2 text-gray-400">Password</label>
          <div className="flex items-center justify-between">
            <span className="text-black">********</span>
            <button className="text-gray-400 flex items-center">
              <span>Change or edit password</span>
            </button>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white py-2 px-4 rounded-md font-semibold"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserProfileModal;
