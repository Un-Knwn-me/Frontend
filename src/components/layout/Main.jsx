import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HorizontalNavbar from "./HorizontalNavbar";
import VerticalNavbar from "./VerticalNavbar";

const Main = () => {
  const [sideNavOpen, setSideNavOpen] = useState(true);
  const location = useLocation();

  const formattedRoute =
    location.pathname
      .split("/")
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" > ");

  return (
    <div className="flex h-screen">
      {/* Vertical Navbar */}
      <div
        className={`fixed h-full bg-gray-200 duration-300 ${sideNavOpen ? "w-56" : "w-20"}`}
      >
        <VerticalNavbar isOpen={sideNavOpen} toggleSideNav={() => setSideNavOpen(!sideNavOpen)} />
      </div>

      {/* Content Area */}
      <div
        className={`flex flex-col flex-grow duration-300 ${sideNavOpen ? "ml-56" : "ml-20"}`}
      >
        {/* Horizontal Navbar */}
        <HorizontalNavbar />

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto pt-2">
          {/* Outlet for nested routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Main;
