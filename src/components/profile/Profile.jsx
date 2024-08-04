import React, { useEffect, useState } from "react";
import profileScreenBg from "../../assets/profile-screen-bg.png";
import profileImage from "../../assets/profile-image.jpeg"; 
import editIcon from "../../assets/edit-icon.svg";
import whatsappIcon from "../../assets/whatsapp-icon.svg";
import emailIcon from "../../assets/email-icon.svg";
import lockIcon from "../../assets/lock-icon.svg";
import apiService from "../../apiService";

const Profile = () => {
    const [data, setData] = useState({});
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Function to fetch user by ID
    const getUserById = async (id) => {
        try {
            const response = await apiService.get(`/users/${id}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            getUserById(userId);
        }
    }, []);

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        try {
            await apiService.put(`/users/${data.id}/password`, { password: newPassword });
            setShowPasswordModal(false);
            setNewPassword("");
            setConfirmPassword("");
            setPasswordError("");
        } catch (error) {
            console.error('Error updating password:', error);
            setPasswordError("Failed to update password");
        }
    };

    return (
        <div className="h-full bg-white relative">
            <div
                className="h-1/4 relative flex flex-grow object-cover rounded-none"
                style={{ backgroundImage: `url(${profileScreenBg})` }}
            >
                <img
                    src={editIcon}
                    alt=""
                    className="h-12 w-12 absolute top-8 right-10 z-10 transform translate-x-1/2 -translate-y-1/2 cursor-pointer bg-white rounded-full p-2"
                />
                <div className="absolute top-20 left-5 w-full h-full flex">
                    <div className="relative">
                        <img
                            src={data.profile || 'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?t=st=1722784481~exp=1722788081~hmac=a5aa9d09742756a35d3b165bc245e2b828f8ea432a73f0a1a47adb2f799e9448&w=740'}
                            alt="Profile"
                            className="flex flex-grow object-cover rounded-full w-[160px] h-[160px] border-2 border-green-500 relative mb-2"
                        />
                        <span className="ml-10 font-bold text-lg text-center">{data.full_name}</span>
                        <img
                            src={editIcon}
                            alt=""
                            className="h-12 w-12 absolute top-3 right-7 z-10 transform translate-x-1/2 -translate-y-1/2 cursor-pointer bg-white rounded-full p-2"
                        />
                    </div>
                </div>
            </div>
            <div className="flex mt-40 px-10 gap-4">
                <div className="flex justify-between px-5 py-3 border-b w-1/3">
                    <div className="flex items-center">
                        <img src={whatsappIcon} alt="WhatsApp" className="h-16 w-16 mr-3" />
                        <div>
                            <span className="block font-semibold">Phone Number</span>
                            <span className="text-gray-500">+91 {data.phone_number}</span>
                        </div>
                    </div>
                    <img src={editIcon} alt="Edit" className="h-6 w-6 cursor-pointer" />
                </div>
                <div className="flex justify-between px-5 py-3 border-b w-1/3">
                    <div className="flex items-center">
                        <img src={emailIcon} alt="Email" className="h-16 w-16 mr-3" />
                        <div>
                            <span className="block font-semibold">Email</span>
                            <span className="text-gray-500">{data.email}</span>
                        </div>
                    </div>
                    <img src={editIcon} alt="Edit" className="h-6 w-6 cursor-pointer" />
                </div>
                <div className="flex justify-between px-5 py-3 border-b w-1/3">
                    <div className="flex items-center">
                        <img src={lockIcon} alt="Password" className="h-16 w-16 mr-3" />
                        <div>
                            <span className="block font-semibold">Password</span>
                            <span className="text-gray-500">********</span>
                        </div>
                    </div>
                    <img
                        src={editIcon}
                        alt="Edit"
                        className="h-6 w-6 cursor-pointer"
                        onClick={() => setShowPasswordModal(true)}
                    />
                </div>
            </div>
            <button className="absolute bottom-16 right-40 bg-sky-600 rounded-md text-white px-20 py-2 font-bold">Update</button>

            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Set New Password</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                                placeholder="Confirm new password"
                            />
                        </div>
                        {passwordError && <p className="text-red-500">{passwordError}</p>}
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                onClick={() => setShowPasswordModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handlePasswordChange}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
