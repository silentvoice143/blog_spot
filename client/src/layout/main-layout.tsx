import Header from "@/components/shared/header";
import React, { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <Header />
      <div className="flex-1 flex-col">{children}</div>
      <div className="bg-green-primary text-white">Footer</div>
    </div>
  );
};

export default MainLayout;
