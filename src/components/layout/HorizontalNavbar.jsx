import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation hook
import profile from "../../assets/profile-image.png";
import logoutIcon from "../../assets/logout-icon.svg";
import { FaBell } from "react-icons/fa";

const HorizontalNavbar = () => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [profileImg, setProfileImg] = useState('');
    
  const routeNames = {
    "/main/dashboard": "Dashboard",
    "/main/permissions": "Permissions",
    "/main/users": "Users",
    "/main/product-master": "Product Master",
    "/main/add-products": "Add Products",
    "/main/stock-in": "Stock In",
    "/main/stock-out": "Stock Out",
    "/main/withpo": "With PO",
    "/main/withoutpo": "Without PO",
    "/main/report": "Reports",
    "/main/profile": "Profile",
   
  };

  useEffect(() => {
    const profile = localStorage.getItem('profile');
    setProfileImg(profile);
  },[]);

  // Function to extract route name from pathname
  const getRouteName = () => {
    const path = location.pathname;
    // Extract last segment from pathname
    const segments = path.split("/").filter(Boolean); // Split path by '/' and remove empty segments
    const lastSegment = segments.pop(); // Get the last segment
    // Capitalize first letter of last segment
    return routeNames[path] || (lastSegment ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) : "Dashboard");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="flex justify-between items-center bg-white p-2 shadow-md relative px-10">
      <div className="text-black text-2xl font-semibold">{getRouteName()}</div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <FaBell
            className="text-black text-xl cursor-pointer mr-4"
            onClick={toggleDropdown}
          />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full mr-4">
              {notificationCount}
            </span>
          )}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Notification 1
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Notification 2
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Notification 3
              </a>
            </div>
          )}
        </div>

        <img
          alt="profile"
          src={profileImg || 'https://img.freepik.com/free-vector/purple-man-with-blue-hair_24877-82003.jpg?t=st=1722805107~exp=1722808707~hmac=ddf9dffbe6b4df23a57f7a9b5629d3e6ee805e8f427062967e011b996d966b21&w=740'}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default HorizontalNavbar;
