import { Loader2 } from "lucide-react";
import React from "react";

function Loader() {
  return (
    <div className="h-screen w-screen absolute z-[100] flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <Loader2 className="animate-spin duration-600 text-blue-600 mb-4" />
        <h1 className="font-semibold text-2xl">Loading data...</h1>
        <h3>Please wait for a moment.</h3>
      </div>
    </div>
  );
}

export default Loader;
