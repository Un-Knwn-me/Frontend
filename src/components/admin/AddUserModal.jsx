import React, { useState } from "react";
import addUserPhotoIcon from "../../assets/add-user-photo-icon.svg";
import closeIcon from "../../assets/close-modal-icon.svg";
import apiService from "../../apiService";

const AddUserModal = ({ isOpen, onClose, onUpdate }) => {
  const [userData, setUserData] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
    profile: null, 
    isAdmin: false
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile" && files.length > 0) {
      const file = files[0];
      setUserData((prevData) => ({
        ...prevData,
        profile: file, // Handle file input
      }));
      setPreviewUrl(URL.createObjectURL(file)); // Set preview URL
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleRemoveImage = () => {
    setUserData((prevData) => ({
      ...prevData,
      profile: null,
    }));
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("profile", userData.profile);
    formData.append("full_name", userData.username);
    formData.append("phone_number", userData.phoneNumber);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("is_admin", userData.isAdmin);

    try {
      const response = await apiService.post("/users/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      onUpdate(response.data); // Optional: Update parent component or state
      onClose(); // Close the modal
    } catch (error) {
      console.error("User creation failed:", error);
      // Handle error (e.g., show an error message)
    }
  };


  const handleToggle = () => {
    setUserData((prevData) => ({
      ...prevData,
      isAdmin: !prevData.isAdmin,
    }));
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? "block" : "hidden"}`}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg relative min-h-[450px] min-w-[350px]">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-center">
            <div className="relative">
              <h2 className="text-xl font-bold text-center">Add User</h2>
              <button
                className="absolute top-0 right-0"
                onClick={() => onClose()}
              >
                <img src={closeIcon} alt="" />
              </button>
            </div>
            <div className="flex justify-center">
              <label className="flex items-center cursor-pointer">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Profile Preview"
                      className="w-20 h-20 mr-4 rounded-full"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-white bg-red-500 rounded-full"
                      onClick={handleRemoveImage}
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <img
                    src={addUserPhotoIcon}
                    alt=""
                    className="p-4 mr-4 bg-gray-200 rounded-full"
                  />
                )}
                <div className="flex flex-col">
                  <span className="relative py-2 mr-2 text-left text-blue-500 underline cursor-pointer text-md min-w-28 max-w-24">
                    {previewUrl ? "Change Photo" : "Upload Photo"}
                    <span className="absolute right-0 text-blue-500 top-1">*</span>
                  </span>
                  <p className="text-xs text-gray-400">
                    The photo should be Png, Jpeg below 1mb in size
                  </p>
                </div>
                <input
                  type="file"
                  name="profile"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Username */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Username:
              </label>
              <input
                type="text"
                name="username"
                value={userData.username}
                placeholder="username"
                onChange={handleChange}
                className="w-full border border-gray-200 text-center py-1.5 bg-gray-200 rounded-md shadow-sm "
              />
            </div>
            {/* Phone number */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Phone Number:
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={userData.phoneNumber}
                placeholder="+91 | phone number"
                onChange={handleChange}
                className="w-full border border-gray-200 text-center py-1.5 bg-gray-200 rounded-md shadow-sm "
              />
            </div>
            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={userData.email}
                placeholder="Enter email"
                onChange={handleChange}
                className="w-full border border-gray-200 text-center py-1.5 bg-gray-200 rounded-md shadow-sm "
              />
            </div>
            {/* Set Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Set Password:
              </label>
              <input
                type="password"
                name="password"
                value={userData.password}
                placeholder="Enter password"
                onChange={handleChange}
                className="w-full border border-gray-200 text-center py-1.5 bg-gray-200 rounded-md shadow-sm "
              />
            </div>
            <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
                Admin:
            </label>
            <div
            className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${userData.isAdmin ? 'bg-green-500' : 'bg-gray-300'}`}
            onClick={handleToggle}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${userData.isAdmin ? 'translate-x-6' : ''}`}
            ></div>
          </div>
          </div>
          </div>
          {/* Update button */}
          <div className="absolute text-right bottom-5 right-10">
            <button
              type="submit"
              className="w-40 px-4 py-1 text-white rounded-md bg-sky-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;