import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { BsChevronDown } from "react-icons/bs";
import logo from "../../assets/logo.png";
import brandImage from "../../assets/quco.png";
import { RiDashboardFill, RiFileList3Fill } from "react-icons/ri";
import { FaBoxOpen } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaClipboardList, FaSignOutAlt, FaUser } from "react-icons/fa";
import { BsClipboard2CheckFill } from "react-icons/bs";
import Swal from "sweetalert2";

function VerticalNavbar({ isOpen, toggleSideNav }) {
  const [submenuOpen, setSubmenuOpen] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const getIcon = (icon, highlightedIcon, routes) => {
    const currentRoute = location.pathname.split("/").pop();
    return routes.includes(currentRoute) ? highlightedIcon : icon;
  };

  const isActiveTab = (route) => location.pathname.startsWith(route);

  const Menus = [
    { title: "Dashboard", path: "/main/dashboard", icon: <RiDashboardFill className="h-6 w-6"/>, 
      highlightedIcon: <RiDashboardFill className="h-6 w-6 text-[#EEBBC3]"/> },
    {
      title: "Admin",
      icon: <MdAdminPanelSettings className="h-6 w-6"/>,
      highlightedIcon: <MdAdminPanelSettings className="h-6 w-6 text-[#EEBBC3]"/>,
      submenu: true,
      submenuItems: [
        { title: "Permissions", path: "/main/permissions" },
        { title: "Users", path: "/main/users" },
      ],
      routes: ["permissions", "users"]
    },
    {
      title: "Product",
      icon: <FaBoxOpen className="h-6 w-6"/>,
      highlightedIcon: <FaBoxOpen className="h-6 w-6 text-[#EEBBC3]"/>,
      submenu: true,
      submenuItems: [
        { title: "Product Master", path: "/main/product-master" },
        { title: "Add Products", path: "/main/add-products" },
      ],
      routes: ["product-master", "add-products"]
    },
    {
      title: "Orders",
      icon: <FaClipboardList className="h-6 w-6"/>,
      highlightedIcon: <FaClipboardList className="h-6 w-6 text-[#EEBBC3]"/>,
      submenu: true,
      submenuItems: [
        { title: "With Po", path: "/main/withpo" },
        { title: "Without Po", path: "/main/withoutpo" },
      ],
      routes: ["withpo", "withoutpo"]
    },
    {
      title: "Stock",
      icon: <BsClipboard2CheckFill className="h-6 w-6"/>,
      highlightedIcon: <BsClipboard2CheckFill className="h-6 w-6 text-[#EEBBC3]"/>,
      submenu: true,
      submenuItems: [
        { title: "Stock In", path: "/main/stock-in" },
        { title: "Stock Out", path: "/main/stock-out" },
      ],
      routes: ["stock-in", "stock-out"]
    },
    { title: "Report", path: "/main/report", icon: <RiFileList3Fill className="h-6 w-6"/>, 
      highlightedIcon: <RiFileList3Fill className="h-6 w-6 text-[#EEBBC3]"/> },
    { title: "Profile", path: "/main/profile", icon: <FaUser className="h-6 w-6"/>, 
      highlightedIcon: <FaUser className="h-6 w-6 text-[#EEBBC3]"/> },
    { title: "Logout", icon: <FaSignOutAlt className="h-6 w-6"/>, 
      highlightedIcon: <FaSignOutAlt className="h-6 w-6 text-[#EEBBC3]"/> },
  ];

  const toggleSubmenu = (index) => {
    setSubmenuOpen((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleLogoutClick = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Handle the actual logout logic here (e.g., clear user session)
        console.log("Logout confirmed");

        // Navigate to the login page
        navigate("/login");
      }
    });
  };

  const handleIconClick = () => {
    if (!isOpen) {
      toggleSideNav();
    }
  };

  return (
    <div
      className={`bg-black min-h-screen p-5 duration-300 ${
        isOpen ? "w-56" : "w-20"
      }`}
    >
      <div className="inline-flex">
        <img
          alt="logo"
          src={logo}
          className={`bg-amber-50 rounded h-8 cursor-pointer block float-left duration-500 ${
            !isOpen && "rotate-0"
          }`}
          onClick={toggleSideNav}
        />
        <img
          alt="brand"
          src={brandImage}
          className={`h-8 ml-4 w-auto duration-300 ${!isOpen && "scale-0"}`}
        />
      </div>

      <ul className="pt-2">
        {Menus.map((menu, index) => (
          <div key={index}>
            <NavLink
              to={menu.path || "#"}
              className={`text-sm flex items-center gap-x-4 cursor-pointer p-2 rounded-md mt-5 h-12 ${
                isActiveTab(menu.path)
                  ? "bg-[#EEBBC3] text-black"
                  : "hover:bg-[#374151] hover:text-gray-300 text-white"
              }`}
              onClick={() => {
                if (menu.title === "Logout") {
                  handleLogoutClick();
                } else if (menu.submenu) {
                  toggleSubmenu(index);
                }
              }}
            >
              <span
                className="text-lg flex items-center justify-center h-full"
                onClick={handleIconClick}
              >
                {getIcon(menu.icon, menu.highlightedIcon, menu.routes || [])}
              </span>
              <span
                className={`text-base font-medium flex-1 duration-200 ${
                  !isOpen && "hidden"
                }`}
              >
                {menu.title}
              </span>
              {menu.submenu && isOpen && (
                <BsChevronDown
                  className={`${submenuOpen === index ? "rotate-180" : ""}`}
                />
              )}
            </NavLink>
            {menu.submenu && submenuOpen === index && isOpen && (
              <ul>
                {menu.submenuItems.map((submenuItem, subIndex) => (
                  <NavLink
                    key={subIndex}
                    to={submenuItem.path}
                    className={({ isActive }) =>
                      `text-sm flex items-center gap-x-4 cursor-pointer p-2 px-8 rounded-md ${
                        isActive ? 'bg-[#EEBBC3] text-black' : 'hover:bg-[#374151] text-white'
                      }`
                    }
                  >
                    {submenuItem.title}
                  </NavLink>
                ))}
              </ul>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default VerticalNavbar;