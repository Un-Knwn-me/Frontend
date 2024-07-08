import React from "react";
import profileScreenBg from "../../assets/profile-screen-bg.png";
import profileImage from "../../assets/profile-image.jpeg"; // Replace this with your actual profile image
import editIcon from "../../assets/edit-icon.svg";
import whatsappIcon from "../../assets/whatsapp-icon.svg";
import emailIcon from "../../assets/email-icon.svg";
import lockIcon from "../../assets/lock-icon.svg";

const Profile = () => {
    return (
        <div className="h-[80vh] bg-white relative">
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
                            src={profileImage}
                            alt="Profile"
                            className="flex flex-grow object-cover rounded-full w-[160px] h-[160px] border-2 border-green-500 relative mb-2"
                        />
                        <span className="ml-10 font-bold text-lg text-center">Username</span>
                        <img
                            src={editIcon}
                            alt=""
                            className="h-12 w-12 absolute top-3 right-7 z-10 transform translate-x-1/2 -translate-y-1/2 cursor-pointer bg-white rounded-full p-2"
                        />
                    </div>
                </div>
            </div>
            <div className="flex mt-32 px-10" >
                <div className="flex justify-between px-5 py-3 border-b w-1/3">
                    <div className="flex items-center">
                        <img src={whatsappIcon} alt="WhatsApp" className="h-16 w-16 mr-3" />
                        <div>
                            <span className="block font-semibold">Phone Number</span>
                            <span className="text-gray-500">+1234567890</span>
                        </div>
                    </div>
                    <img src={editIcon} alt="Edit" className="h-6 w-6 cursor-pointer" />
                </div>
                <div className="flex justify-between px-5 py-3 border-b w-1/3">
                    <div className="flex items-center">
                        <img src={emailIcon} alt="Email" className="h-16 w-16 mr-3" />
                        <div>
                            <span className="block font-semibold">Email</span>
                            <span className="text-gray-500">example@example.com</span>
                        </div>
                    </div>
                    <img src={editIcon} alt="Edit" className="h-6 w-6 cursor-pointer" />
                </div>
                <div className="flex justify-between px-5 py-3 border-b w-1/3">
                    <div className="flex items-center">
                        <img src={lockIcon} alt="Email" className="h-16 w-16 mr-3" />
                        <div>
                            <span className="block font-semibold">Password</span>
                            <span className="text-gray-500">* * * * * * * *</span>
                        </div>
                    </div>
                    <img src={editIcon} alt="Edit" className="h-6 w-6 cursor-pointer" />
                </div>
            </div>
            <button className="absolute bottom-16 right-40 bg-sky-600 rounded-md text-white px-20 py-2 font-bold" >Update</button>
        </div>
    );
};

export default Profile;
