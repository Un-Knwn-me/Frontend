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
    <div className="h-screen w-screen flex">
      {/* Vertical Navbar */}
      <div className="w-56 bg-gray-200 fixed h-full">
        <VerticalNavbar />
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-grow ml-56">
        {/* Horizontal Navbar */}
        <HorizontalNavbar />

        {/* Route Breadcrumb */}
        <span className="p-4 text-sm text-start font-light">
          {formattedRoute.substring(2, formattedRoute.length)}
        </span>

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto pb-5">
          {/* Outlet for nested routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Main;
