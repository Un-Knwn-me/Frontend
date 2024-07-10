import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from '../../assets/logo.png';
import burgerIcon from "../../assets/burger-icon.svg";
import closeIcon from "../../assets/close-circle-icon.svg";
import dashboardIcon from "../../assets/dashboard-icon.svg";
import adminIcon from "../../assets/admin-icon.svg";
import productIcon from "../../assets/product-icon.svg";
import stockIcon from "../../assets/stock-icon.svg";
import purchaseOrderIcon from "../../assets/purchase-icon.svg";
import reportIcon from "../../assets/report-icon.svg";
import profileIcon from "../../assets/profile-icon.svg";
import dropdownOpenIcon from "../../assets/dropdown-open-black.svg";
import dropdownCloseIcon from "../../assets/dropdown-close-white.svg";
import productHighlightedIcon from "../../assets/product-icon-highlighted.svg";
import stockHighlightedIcon from "../../assets/stock-higlighted-icon.svg";
import purchaseOrderHighlightedIcon from "../../assets/purchase-order-highlighted-icon.svg";
import reportHighlightedIcon from "../../assets/reports-highlighted-icon.svg";
import profileHighlightedIcon from "../../assets/profile-highlighted-icon.svg";
import adminHighlightedIcon from "../../assets/admin-icon-highlighted.svg";
import dashboardHighlightedIcon from "../../assets/dashboard-highlighted-icon.svg";

const VerticalNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isStockDropdownOpen, setIsStockDropdownOpen] = useState(false);
  const [isPurchaseDropdownOpen, setIsPurchaseDropdownOpen] = useState(false);

  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleAdminDropdown = () => {
    setIsAdminDropdownOpen(!isAdminDropdownOpen);
  };

  const toggleProductDropdown = () => {
    setIsProductDropdownOpen(!isProductDropdownOpen);
  };

  const togglePurchaseDropdown = () => {
    setIsPurchaseDropdownOpen(!isPurchaseDropdownOpen);
  };

  const toggleStockDropdown = () => {
    setIsStockDropdownOpen(!isStockDropdownOpen);
  };

  const getIcon = (icon, highlightedIcon, routes) => {
    const currentRoute = location.pathname.split('/').pop();
    return routes.includes(currentRoute) ? highlightedIcon : icon;
  };
  
  const isActiveTab = (route) => location.pathname.startsWith(route);

  return (
    <>
      <div className="w-full bg-black text-white">
        <button
          onClick={toggleSidebar}
          aria-controls="default-sidebar"
          type="button"
          className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open sidebar</span>
          <div className="py-5">
            <img src={burgerIcon} alt="" className="h-5 w-5 absolute left-3 top-3" />
          </div>
        </button>

        <aside
          id="default-sidebar"
          className={`fixed top-0 left-0 z-40 w-56 h-full transition-transform bg-black ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
          aria-label="Sidebar"
        >
          <div className="h-full px-3 py-4 overflow-y-auto relative">
            {isSidebarOpen && (
              <button
                onClick={toggleSidebar}
                aria-label="Close sidebar"
                className="absolute top-0 right-0 mt-2 mr-3 text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Close sidebar</span>
                <img src={closeIcon} alt="" className="w-5 h-5" />
              </button>
            )}
            <ul className="space-y-2 font-medium">
              <div className="h-40 top-0">
                <img src={logo} alt="" className="top-0 mt-10" />
              </div>
              <li className={isActiveTab("/main/dashboard") ? 'bg-white text-black' : ''}>
                <NavLink
                  to="/main/dashboard"
                  className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group"
                  style={({ isActive }) => isActive ? { backgroundColor: 'white', color: 'black' } : {}}
                >
                  <img src={getIcon(dashboardIcon, dashboardHighlightedIcon, '/main/dashboard')} alt="" className="h-8 w-8" />
                  <span className="ms-3">Dashboard</span>
                </NavLink>
              </li>
              <li className={`${isActiveTab("/main/permissions") || isActiveTab("/main/users") ? 'text-black bg-white' : 'dark:text-white'}`}>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group cursor-pointer" onClick={toggleAdminDropdown}>
                <img 
  src={getIcon(adminIcon, adminHighlightedIcon, ['permissions', 'users'])} 
  alt="" 
  className="h-8 w-8" 
/>
                  <span className="ms-3">Admin</span>
                  <img
                    src={isAdminDropdownOpen ? dropdownOpenIcon : dropdownCloseIcon}
                    alt=""
                    className="h-5 w-5 ml-auto"
                  />
                </div>
                {isAdminDropdownOpen && (
                  <ul className="space-y-2">
                    <li className={isActiveTab("/main/permissions") ? 'bg-gray-200 text-black' : isActiveTab("/main/users") ? 'bg-white dark:text-black' : ''}>
                      <NavLink
                        to="/main/permissions"
                        className="flex items-center p-2 px-10 rounded-lg dark:text-white hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group aria-[current=page]:bg-gray-200 w-full aria-[current=page]:text-black"
                      >
                        <span className="ms-3">Permissions</span>
                      </NavLink>
                    </li>
                    <li className={isActiveTab("/main/users") ? 'bg-gray-200 text-black' : isActiveTab("/main/permissions") ? 'bg-white dark:text-black' : ""}>
                      <NavLink
                        to="/main/users"
                        className="flex items-center p-2 px-10 rounded-lg hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group aria-[current=page]:bg-gray-200 aria-[current=page]:text-black"
                      >
                        <span className="ms-3">Users</span>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li className={isActiveTab("/main/add-products") || isActiveTab("/main/product-master") ? 'bg-white text-black' : 'dark:text-white'}>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group cursor-pointer" onClick={toggleProductDropdown}>
                <img 
  src={getIcon(productIcon, productHighlightedIcon, ['product-master', 'add-products'])} 
  alt="" 
  className="h-8 w-8" 
/>
                  <span className="ms-3">Product</span>
                  <img
                    src={isProductDropdownOpen ? dropdownOpenIcon : dropdownCloseIcon}
                    alt=""
                    className="h-5 w-5 ml-auto"
                  />
                </div>
                {isProductDropdownOpen && (
                  <ul className="space-y-2">
                    <li className={isActiveTab("/main/product-master") ? 'bg-gray-100 text-black' : isActiveTab("/main/add-products") ? 'bg-white dark:text-black' : ''}>
                      <NavLink
                        to="/main/product-master"
                        className="flex items-center p-2 px-10 whitespace-nowrap rounded-lg hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group aria-[current=page]:bg-gray-200 aria-[current=page]:text-black"
                      >
                        <span className="ms-3">Product Master</span>
                      </NavLink>
                    </li>
                    <li className={isActiveTab("/main/add-products") ? 'bg-gray-100 text-black' : isActiveTab("/main/product-master") ? 'bg-white dark:text-black' : ''}>
                      <NavLink
                        to="/main/add-products"
                        className="flex items-center p-2 px-10 whitespace-nowrap rounded-lg hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group aria-[current=page]:bg-gray-200 aria-[current=page]:text-black"
                      >
                        <span className="ms-3">Add Products</span>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li className={isActiveTab("/main/add-purchase-order") || isActiveTab("/main/purchase-order-master") ? 'bg-white text-black' : 'dark:text-white'}>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group cursor-pointer" onClick={togglePurchaseDropdown}>
                <img 
  src={getIcon(purchaseOrderIcon, purchaseOrderHighlightedIcon, ['purchase-order-master', 'add-purchase-order'])} 
  alt="" 
  className="h-8 w-8" 
/>
                  <span className="ms-3">Purchase Order</span>
                  <img
                    src={isPurchaseDropdownOpen ? dropdownOpenIcon : dropdownCloseIcon}
                    alt=""
                    className="h-5 w-5 ml-auto"
                  />
                </div>
                {isPurchaseDropdownOpen && (
                  <ul className="space-y-2">
                    <li className={isActiveTab("/main/purchase-order-master") ? 'bg-gray-100 text-black' : isActiveTab("/main/add-purchase-order") ? 'bg-white dark:text-black' : ''}>
                      <NavLink
                        to="/main/purchase-order-master"
                        className="flex items-center p-2 px-10 whitespace-nowrap rounded-lg hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group aria-[current=page]:bg-gray-200 aria-[current=page]:text-black"
                      >
                        <span className="ms-3">Purchase Order Master</span>
                      </NavLink>
                    </li>
                    <li className={isActiveTab("/main/add-purchase-order") ? 'bg-gray-100 text-black' : isActiveTab("/main/purchase-order-master") ? 'bg-white dark:text-black' : ''}>
                      <NavLink
                        to="/main/add-purchase-order"
                        className="flex items-center p-2 px-10 whitespace-nowrap rounded-lg hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group aria-[current=page]:bg-gray-200 aria-[current=page]:text-black"
                      >
                        <span className="ms-3">Add Purchase Order</span>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li className={isActiveTab("/main/stocks") ? 'bg-white text-black' : 'dark:text-white'}>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group cursor-pointer" onClick={toggleStockDropdown}>
                <img 
  src={getIcon(stockIcon, stockHighlightedIcon, ['stocks', 'add-stocks'])} 
  alt="" 
  className="h-8 w-8" 
/>
                  <span className="ms-3">Stock</span>
                  <img
                    src={isStockDropdownOpen ? dropdownOpenIcon : dropdownCloseIcon}
                    alt=""
                    className="h-5 w-5 ml-auto"
                  />
                </div>
                {isStockDropdownOpen && (
                  <ul className="space-y-2">
                    <li className={isActiveTab("/main/stocks") ? 'bg-gray-100 text-black' : isActiveTab("/main/add-stocks") ? 'bg-white dark:text-black' : ''}>
                      <NavLink
                        to="/main/stocks"
                        className="flex items-center p-2 px-10 whitespace-nowrap rounded-lg hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group aria-[current=page]:bg-gray-200 aria-[current=page]:text-black"
                      >
                        <span className="ms-3">Stock Master</span>
                      </NavLink>
                    </li>
                    <li className={isActiveTab("/main/add-stocks") ? 'bg-gray-100 text-black' : isActiveTab("/main/stocks") ? 'bg-white dark:text-black' : ''}>
                      <NavLink
                        to="/main/add-stocks"
                        className="flex items-center p-2 px-10 whitespace-nowrap rounded-lg hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group aria-[current=page]:bg-gray-200 aria-[current=page]:text-black"
                      >
                        <span className="ms-3">Add Stock</span>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li className={isActiveTab("/main/reports") ? 'bg-white text-black' : 'dark:text-white'}>
                <NavLink
                  to="/main/reports"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group aria-[current=page]:bg-gray-200 aria-[current=page]:text-black"
                  style={({ isActive }) => isActive ? { backgroundColor: 'white', color: 'black' } : {}}
                >
                  <img src={getIcon(reportIcon, reportHighlightedIcon, ['reports'])} alt="" className="h-8 w-8" />
                  <span className="ms-3">Reports</span>
                </NavLink>
              </li>
              <li className={isActiveTab("/main/profile") ? 'bg-white text-black' : 'dark:text-white'}>
                <NavLink
                  to="/main/profile"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group aria-[current=page]:bg-gray-200 aria-[current=page]:text-black"
                  style={({ isActive }) => isActive ? { backgroundColor: 'white', color: 'black' } : {}}
                >
                  <img src={getIcon(profileIcon, profileHighlightedIcon, ['profile'])} alt="" className="h-8 w-8" />
                  <span className="ms-3">Profile</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
};

export default VerticalNavbar;
