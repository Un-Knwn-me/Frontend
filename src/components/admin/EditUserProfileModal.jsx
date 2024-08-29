import React, { useEffect, useState } from "react";

import closeIcon from "../../assets/close-modal-icon.svg";
import apiService from "../../apiService";

const EditUserProfileModal = ({ user, onClose, onUpdate, userId }) => {
  const [editingField, setEditingField] = useState(null);

  const [userData, setUserData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    profile: "",
    password: "",
  });

  const [updatedUserData, setUpdatedUserData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    profile: "",
    password: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isPhotoRemoved, setIsPhotoRemoved] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  useEffect(() => {
    fetchUserData(userId);
  }, [userId]);

  const fetchUserData = async (userId) => {
    try {
      const response = await apiService.get(`/users/${userId}`);
      setUserData(response.data);
      setImagePreview(response.data.profile);
      console.log(response.data);
    } catch (error) {
      console.error(
        "Error fetching user  data:",
        error.response || error.message
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setSelectedFile(files[0]);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setUserData((prevUserData) => ({ ...prevUserData, [name]: value }));
      setUpdatedUserData((prevUpdatedData) => ({
        ...prevUpdatedData,
        [name]: value,
      }));
    }
  };

  const handleEditClick = (fieldName) => {
    if (fieldName === "password") {
      setUserData((prevData) => ({ ...prevData, password: "" }));
      setUpdatedUserData((prevData) => ({ ...prevData, password: "" }));
    }
    setEditingField(fieldName);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      Object.keys(updatedUserData).forEach((key) => {
        if (updatedUserData[key] && key !== "password") {
          formData.append(key, updatedUserData[key]);
        }
      });

      if (updatedUserData.password) {
        formData.append("password", updatedUserData.password);
      }

      if (selectedFile) {
        formData.append("profile", selectedFile);
      }

      if (isPhotoRemoved) {
        await apiService.delete(`/users/deleteProfile/${userId}`);
      }

      const response = await apiService.put(`/users/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Update failed:", error.response || error.message);
    }
  };

  const handleRemovePhoto = () => {
    setIsConfirmationModalOpen(true);
  };

  const confirmRemovePhoto = async () => {
    try {
      setImagePreview(""); // Remove image preview
      setIsPhotoRemoved(true); // Mark photo for removal
      setUpdatedUserData((prevUpdatedData) => ({
        ...prevUpdatedData,
        profile: null, // Set profile to null to indicate removal
      }));

      await apiService.delete(`/users/deleteProfile/${userId}`);

      setIsConfirmationModalOpen(false);
      onUpdate({ ...userData, profile: null });
      onClose();
    } catch (error) {
      console.error("Error removing photo:", error.response || error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await apiService.delete(`/users/${userId}`);
      onClose();
    } catch (error) {
      console.error("Error deleting user:", error.response || error.message);
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
          {imagePreview ? (
            <img
              src={imagePreview}
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
          <div className="flex space-x-4">
            <label className="flex items-center text-blue-600 underline cursor-pointer">
              <span>Change photo</span>
              <input
                type="file"
                name="profile"
                onChange={handleInputChange}
                className="hidden"
              />
            </label>
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
            {editingField === "full_name" ? (
              <input
                type="text"
                name="full_name"
                value={userData.full_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 focus:bg-gray-200 focus:outline-none"
              />
            ) : (
              <span className="text-black">{userData.full_name}</span>
            )}
            <button
              className="flex items-center text-gray-400"
              onClick={() => handleEditClick("full_name")}
            >
              <span>Edit</span>
            </button>
          </div>
        </div>
        <div className="pb-2 mb-4 border-b">
          <label className="block mb-2 text-gray-400">Phone number</label>
          <div className="flex items-center justify-between">
            {editingField === "phone_number" ? (
              <input
                type="text"
                name="phone_number"
                value={userData.phone_number}
                onChange={handleInputChange}
                className="w-full px-4 py-2 focus:bg-gray-200 focus:outline-none"
              />
            ) : (
              <span className="text-black">{userData.phone_number}</span>
            )}
            <button
              className="flex items-center text-gray-400"
              onClick={() => handleEditClick("phone_number")}
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
                value={userData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 focus:bg-gray-200 focus:outline-none"
              />
            ) : (
              <span className="text-black">{userData.email}</span>
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
                value={userData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 focus:bg-gray-200 focus:outline-none"
              />
            ) : (
              <span className="text-black">*******</span>
            )}
            <button
              className="flex items-center text-gray-400"
              onClick={() => handleEditClick("password")}
            >
              <span>Change password</span>
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            className="px-4 py-2 text-white bg-red-500 rounded"
            onClick={handleDeleteUser}
          >
            Delete User
          </button>
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>

      {isConfirmationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-[30vw]">
            <h3 className="mb-4 text-lg font-semibold">Confirm Action</h3>
            <p className="mb-6">Are you sure you want to remove the photo?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmationModalOpen(false)}
                className="px-4 py-2 font-semibold text-white bg-gray-500 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemovePhoto}
                className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUserProfileModal;