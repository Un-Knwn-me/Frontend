import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import HorizontalNavbar from "./HorizontalNavbar";
import VerticalNavbar from "./VerticalNavbar";

const Main = () => {
  const [sideNavOpen, setSideNavOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-auto">
      {/* Vertical Navbar */}
      <div
        className={`z-10 fixed h-full bg-gray-200 duration-300 ${sideNavOpen ? "w-56" : "w-20"}`}
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
        <main className="flex-grow h-0 pt-2 overflow-y-auto">
          {/* Outlet for nested routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Main;
