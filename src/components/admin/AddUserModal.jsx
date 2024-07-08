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
    profile: null, // Store file object here
  });

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setUserData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile") {
      setUserData((prevData) => ({
        ...prevData,
        profile: files[0], // Handle file input
      }));
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Perform validation or other actions before updating
  //   // Call the onUpdate function with the user data
  //   onUpdate(userData);
  //   // Close the modal
  //   onClose();
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("profile", userData.profile);
    formData.append("full_name", userData.username);
    formData.append("phone_number", userData.phoneNumber);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("is_admin", "true"); // or "false" based on your requirement

    const token = localStorage.getItem("token");

    try {
      const response = await apiService.post("/users/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
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

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50 bg-transparent"${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg relative min-h-[450px] min-w-[350px]">
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <div className="relative">
              <h2 className="text-xl text-center font-bold">Add User</h2>
              <button
                className="absolute top-0 right-0"
                onClick={() => onClose()}
              >
                <img src={closeIcon} alt="" />
              </button>
            </div>
            <div className="flex">
              <label className="flex items-center">
                <img
                  src={addUserPhotoIcon}
                  alt=""
                  className="bg-gray-200 rounded-full p-4 mr-4"
                />
                <div className="flex flex-col">
                  <span className="relative py-2 mr-2 text-md text-left text-blue-500 underline min-w-28 max-w-24 cursor-pointer">
                    Upload Photo
                    <span className="text-blue-500 absolute top-1 right-0">
                      *
                    </span>
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
                Username
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
                Phone Number
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
                Email
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
                Set Password
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
          </div>
          {/* Update button */}
          <div className="text-right absolute bottom-5 right-10">
            <button
              type="submit"
              className="bg-sky-700 text-white px-4 py-1 rounded-md w-40"
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
