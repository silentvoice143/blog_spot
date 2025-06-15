import React, { useState } from "react";
import CustomInput from "./CustomInput";
import { SearchIcon } from "lucide-react";

function SearchBox() {
  const [text, setText] = useState("");
  return (
    <div className="hidden md:flex items-center border border-gray-secondary3 rounded-full h-10 relative">
      <CustomInput
        iconLeft={<SearchIcon className="h-4 w-4 text-gray-secondary1" />}
        inputClassName=""
        bordered={false}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className=""
      />
    </div>
  );
}

export default SearchBox;
