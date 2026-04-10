import Header from "@/components/shared/header";
import React, { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex flex-col relative">
      <div className="sticky top-0 z-[9999] bg-white">
        <Header />
      </div>
      <div className="flex-1 flex-col max-w-7xl mx-auto w-full">{children}</div>
      {/* <div className="bg-green-primary text-white">Footer</div> */}
    </div>
  );
};

export default MainLayout;
