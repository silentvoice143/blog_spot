"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

type SubItem = {
  label: string;
  href?: string;
};

type MenuItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  subItems?: SubItem[];
};

type MenuGroup = {
  heading: string;
  items: MenuItem[];
};

type SidebarProps = {
  isOpen: boolean;
  menu: MenuGroup[];
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, menu }) => {
  const { pathname } = useLocation();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setOpenItems((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  // ✅ Check if parent is active
  const isItemActive = (item: MenuItem) => {
    if (item.href && pathname === item.href) return true;

    if (item.subItems) {
      return item.subItems.some(
        (sub) => sub.href && pathname.startsWith(sub.href),
      );
    }

    return false;
  };

  // ✅ Check sub item active
  const isSubItemActive = (sub: SubItem) => {
    return sub.href && pathname.startsWith(sub.href);
  };

  return (
    <aside
      className={`fixed top-24 left-0 h-[calc(100vh-96px)] bg-white border-r border-neutral-100 flex flex-col transition-all duration-300 z-40 ${
        isOpen ? "w-full sm:w-[220px]" : "w-0 overflow-hidden"
      }`}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2">
        {menu.map((group, idx) => (
          <div key={idx} className="mb-4">
            <p className="text-[10px] font-medium tracking-widest uppercase text-neutral-400 px-2 py-2 overflow-x-hidden">
              {group.heading}
            </p>

            {group.items.map((item, i) => {
              const key = `${idx}-${i}`;
              const isActive = isItemActive(item);
              const isOpenItem = openItems.has(key) || isActive;

              return (
                <div key={i}>
                  {/* ================= MAIN ITEM ================= */}
                  <div
                    onClick={() => {
                      if (item.subItems) toggle(key);
                    }}
                    className={`flex  items-center gap-2 px-2.5 py-[7px] rounded-lg cursor-pointer transition-colors ${
                      isActive ? "bg-neutral-100" : "hover:bg-neutral-50"
                    }`}
                  >
                    {/* Icon */}
                    {item.icon && (
                      <span
                        className={`w-4 h-4 flex items-center justify-center  ${
                          isActive ? "text-neutral-900" : "text-neutral-400"
                        }`}
                      >
                        {item.icon}
                      </span>
                    )}

                    {/* Label */}
                    {item.href ? (
                      <Link
                        to={item.href}
                        className={`text-sm font-medium flex-1 ${
                          isActive
                            ? "font-medium text-neutral-900"
                            : "text-neutral-500"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span
                        className={`text-sm font-medium flex-1 ${
                          isActive
                            ? "font-medium text-neutral-900"
                            : "text-neutral-500"
                        }`}
                      >
                        {item.label}
                      </span>
                    )}

                    {/* Arrow */}
                    {item.subItems && (
                      <ChevronDown
                        className={`w-4 h-4 text-black-secondary transition-transform ${
                          isOpenItem ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>

                  {/* ================= SUB ITEMS ================= */}
                  {item.subItems && isOpenItem && (
                    <div className="ml-6 mt-0.5 space-y-0.5">
                      {item.subItems.map((sub, j) => {
                        const subActive = isSubItemActive(sub);

                        return (
                          <Link
                            key={j}
                            to={sub.href || "#"}
                            className={`flex font-medium text-nowrap items-center gap-2 px-2.5 py-[5px] text-sm rounded-lg transition-colors ${
                              subActive
                                ? "bg-neutral-100 text-neutral-900 font-medium"
                                : "text-black-secondary hover:bg-neutral-50 hover:text-neutral-800"
                            }`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full ${
                                subActive ? "bg-neutral-800" : "bg-neutral-300"
                              }`}
                            />
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
