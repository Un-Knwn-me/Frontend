import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import HorizontalNavbar from "./HorizontalNavbar";
import VerticalNavbar from "./VerticalNavbar";

const Main = () => {

  const location = useLocation();

  const formattedRoute =
    location.pathname
      .split("/")
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" > ");

  return (
    <div className="h-screen w-screen">
      {/* Vertical Navbar */}
      <div className="col-span-3 bg-gray-200">
        <VerticalNavbar className="overflow-hidden -pr-10" />
      </div>
      
      {/* Content Area */}
      <div className="flex flex-col flex-grow ml-[14rem]">
        {/* Horizontal Navbar */}
        <HorizontalNavbar />
        <span className="py-4 text-sm text-start font-light">{formattedRoute.substring(2,formattedRoute.length)}</span>
        
        {/* Main Content */}
        <main className="flex-grow overflow-y-auto">
          {/* Outlet for nested routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Main;
