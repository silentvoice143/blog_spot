import React, { useState } from "react";
import CustomInput from "./CustomInput";
import { SearchIcon } from "lucide-react";

function SearchBox() {
  const [text, setText] = useState("");
  return (
    <div className="flex items-center border border-gray-secondary3 rounded-full h-10 px-2 relative">
      <SearchIcon className="h-4 w-4 absolute left-2 text-gray-secondary1" />
      <CustomInput
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border-none !mb-0 pr-4 pl-6"
      />
    </div>
  );
}

export default SearchBox;
