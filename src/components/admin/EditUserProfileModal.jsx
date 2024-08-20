import React, { useEffect, useState } from "react";
// import editIcon from "../../assets/edit-icon-blue-color.svg";
import closeIcon from "../../assets/close-modal-icon.svg";
import apiService from "../../apiService";

const EditUserProfileModal = ({ user, onClose, onUpdate }) => {
  const [editedUser, setEditedUser] = useState({ ...user }); // Initialize with the current user data
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    setEditedUser({ ...user });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleEditClick = (fieldName) => {
    setEditingField(fieldName);
  };

  const handleUpdate = async () => {
    try {
      console.log('user: ', editedUser)
      // const response = await apiService.put(`/users/${editedUser.id}`, {
      //   full_name: editedUser.full_name,
      //   email: editedUser.email,
      //   phone_number: editedUser.phone_number,
      //   password: editedUser.password, // Include password if it was changed
      //   // Add any other fields you need to update
      // });

      // console.log("User updated:", response.data);
      // onUpdate(response.data); // Call the onUpdate prop to refresh the user data with the updated response
      // onClose(); // Close the modal
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await apiService.delete(`/users/deleteProfile/${editedUser.id}`);
      setEditedUser((prevUser) => ({
        ...prevUser,
        profile: null, // Ensure this field matches the correct profile picture field in your user object
      }));
    } catch (error) {
      console.error("Remove photo failed:", error);
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-[40vw]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Edit user profile</h2>
          <button onClick={onClose} className="font-bold">
            <img src={closeIcon} alt="Close" className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col items-center mb-4">
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
          <div className="flex space-x-4">
            <button className="flex items-center text-blue-600 underline">
              <span>Change photo</span>
            </button>
            <button
              className="flex items-center text-red-500 underline"
              onClick={handleRemovePhoto}
            >
              <span>Remove photo</span>
            </button>
          </div>
        </div>
        <div className="pb-2 mb-4 border-b">
          <label className="block mb-2 text-gray-400">User name</label>
          <div className="flex items-center justify-between">
            {editingField === "name" ? (
              <input
                type="text"
                name="name"
                value={editedUser.full_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 focus:bg-gray-200 focus:outline-none"
              />
            ) : (
              <span className="text-black">{user.full_name}</span>
            )}
            <button
              className="flex items-center text-gray-400"
              onClick={() => handleEditClick("name")}
            >
              <span>Edit</span>
            </button>
          </div>
        </div>
        <div className="pb-2 mb-4 border-b">
          <label className="block mb-2 text-gray-400">Phone number</label>
          <div className="flex items-center justify-between">
            {editingField === "phone" ? (
              <input
                type="text"
                name="phone"
                value={editedUser.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 focus:bg-gray-200 focus:outline-none"
              />
            ) : (
              <span className="text-black">{user.phone_number}</span>
            )}
            <button
              className="flex items-center text-gray-400"
              onClick={() => handleEditClick("phone")}
            >
              <span>Edit</span>
            </button>
          </div>
        </div>
        <div className="pb-2 mb-4 border-b">
          <label className="block mb-2 text-gray-400">Email</label>
          <div className="flex items-center justify-between">
            {editingField === "email" ? (
              <input
                type="text"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 focus:bg-gray-200 focus:outline-none"
              />
            ) : (
              <span className="text-black">{user.email}</span>
            )}
            <button
              className="flex items-center text-gray-400"
              onClick={() => handleEditClick("email")}
            >
              <span>Edit</span>
            </button>
          </div>
        </div>
        <div className="pb-2 mb-4 border-b">
          <label className="block mb-2 text-gray-400">Enter New Password</label>
          <div className="flex items-center justify-between">
          {editingField === "password" ? (
          <input
                type="text"
                name="password"
                value={editedUser.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 focus:bg-gray-200 focus:outline-none"
              />
                ) : (
              <span className="text-black">*******</span>
            )}
            <button className="flex items-center text-gray-400">
              <span>Change password</span>
            </button>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserProfileModal;