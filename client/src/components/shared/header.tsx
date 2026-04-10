import { Menu, SearchIcon } from "lucide-react";
import React from "react";
import WriteIcon from "../icons/write";
import {
  BellAlertIcon,
  BellIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CustomInput from "../ui-v2/CustomInput";

const Header = () => {
  return (
    <div className="h-20 flex items-center border-b border-gray-200 shadow-sm">
      <div className="max-w-8xl w-full mx-auto px-4 md:px-6 lg:px-8 xl3:px-0 flex justify-between">
        <div className="flex gap-2 items-center">
          <button className="p-2 text-black-secondary hover:text-black-primary">
            <Menu strokeWidth={1.5} />
          </button>
          <h3>BlogSpot</h3>
        </div>
        <div className="flex gap-8 items-center">
          <CustomInput
            placeholder="Search.."
            bordered
            inputClassName="!rounded-full"
            iconLeft={<SearchIcon strokeWidth={1.5} className="size-5" />}
          />
          <button className="flex gap-2 items-center text-black-secondary hover:text-black-primary">
            <PencilSquareIcon className="size-5" />
            <span className="font-medium">Write</span>
          </button>
          <button className="text-black-secondary hover:text-black-primary">
            <BellIcon className="size-6 " />
          </button>
          <div className="cursor-pointer border p-1 rounded-full hover:border-black-primary">
            <Avatar className="">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
