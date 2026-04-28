import Header from "@/components/shared/header";
import Sidebar from "@/components/shared/sidebar";

import React, { ReactNode, useEffect, useRef, useState } from "react";

import { Home, BarChart2, Users, UserPlus, Shield } from "lucide-react";

const menu = [
  {
    heading: "Dashboard",
    items: [
      {
        label: "Home",
        href: "/",
        icon: <Home />,
      },
      {
        label: "Analytics",
        href: "/analytics",
        icon: <BarChart2 />,
      },
    ],
  },
  {
    heading: "Management",
    items: [
      {
        label: "Users",
        icon: <Users />,
        subItems: [
          {
            label: "All Users",
            href: "/users",
            icon: <Users />,
          },
          {
            label: "Add User",
            href: "/users/create",
            icon: <UserPlus />,
          },
        ],
      },
      {
        label: "Roles",
        href: "/roles",
        icon: <Shield />,
      },
    ],
  },
];

const MainLayout = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`min-h-screen w-full flex flex-col relative ${
        isOpen ? "h-screen overflow-hidden sm:h-auto sm:overflow-auto" : ""
      }`}
    >
      {/* Fixed Header */}
      <div className="fixed top-0 w-full z-[9999] h-20">
        <Header
          toggleSidebar={() => {
            setIsOpen(!isOpen);
          }}
        />
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 pt-20">
        <Sidebar isOpen={isOpen} menu={menu} />

        {/* Scroll starts after header */}
        <div
          className={`flex-1 h-[calc(100vh-80px)] overflow-y-auto transition-all duration-300 ${
            isOpen ? "ml-[220px]" : "ml-0"
          }`}
        >
          <div className="max-w-7xl mx-auto w-full flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
