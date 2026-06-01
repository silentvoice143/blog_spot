import { DoorOpen, Menu, SearchIcon, Settings, User } from "lucide-react";

import {

  BellIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CustomInput from "../ui-v2/CustomInput";
import { Button } from "../ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { draftPost } from "@/services/post-service";
import { toast } from "sonner";
import { useState } from "react";

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const location = useLocation();
  const { clearPost, setStep, step, post, setPost, isSaving, setIsSaving, logout, submitRef } = useStore();
  const navigate = useNavigate()
  const [search, setSearch] = useState("")


  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // const saveDraftNow = async () => {
  //   try {
  //     const hasContent =
  //       post?.title?.trim() ||
  //       post?.description?.trim() ||
  //       post?.content?.trim();

  //     if (!hasContent) return true;

  //     const payload = {
  //       ...post,
  //       status: "draft",
  //     };

  //     setIsSaving(true);

  //     const response = await draftPost(payload);

  //     if (response?.data?.post?._id) {
  //       setPost({
  //         ...post,
  //         postId: response.data.post._id,
  //       });
  //     }

  //     return true;
  //   } catch (err) {
  //     toast.error("Failed to save draft");
  //     return false;
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  return (
    <div className="h-20 flex items-center border-b border-gray-200 shadow-sm">
      <div className="max-w-8xl w-full mx-auto px-4 md:px-6 lg:px-8 xl3:px-0 flex justify-between">
        <div className="flex gap-2 items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 text-black-secondary hover:text-black-primary"
          >
            <Menu strokeWidth={1.5} />
          </button>
          <Link to="/"><h4>BlogSpot</h4></Link>

          {isSaving && <p className="text-black-secondary ml-4">Saving..</p>}
        </div>
        <div className="flex gap-4 sm:gap-8 items-center">


          {location.pathname === "/post/create" && step !== 2 ? <Button onClick={() => {
            const hasContents = post?.title?.trim() ||
              post?.description?.trim() ||
              post?.content?.trim();
            console.log("hasContents", hasContents, post?.title, post?.description, post?.content);

            if (hasContents) {
              submitRef.current?.();
              setStep(2)
            } else {

              toast.error("Please add some title, description and content.")
            }
          }} className="hidden sm:flex gap-2 items-center rounded-full !text-xs !h-8">
            Publish

          </Button> : location.pathname !== "/" ? null : <><CustomInput
            placeholder="Search articles and press Enter..."
            bordered
            inputClassName="!rounded-full"
            iconLeft={<SearchIcon strokeWidth={1.5} className="size-5" />}
            className="hidden sm:flex"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && search.trim()) {
                navigate(`/search?q=${encodeURIComponent(search)}`);
              }
            }}
          />
            <Button
              variant="ghost"
              className="sm:hidden rounded-full p-0 h-10 w-10 [&>svg]:!w-5 [&>svg]:!h-5"
            >
              <SearchIcon strokeWidth={2} />
            </Button><button onClick={() => {
              localStorage.removeItem("preview_post");
              clearPost();
              navigate("/post/create")
            }} className="hidden sm:flex gap-2 items-center text-black-secondary hover:text-black-primary">
              <PencilSquareIcon className="size-5" />
              <span className="font-medium">Write</span>
            </button></>}
          <button className="hidden sm:block text-black-secondary hover:text-black-primary">
            <BellIcon className="size-6 " />
          </button>
          <div className="cursor-pointer border p-1 rounded-full hover:border-black-primary">

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-black-primary">Account</DropdownMenuLabel>
                  <DropdownMenuItem className=""><User />My Profile</DropdownMenuItem>
                  <DropdownMenuItem className=""><Settings />Settings</DropdownMenuItem>

                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-1 bg-black-secondary/20" />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="text-red-500" onClick={handleLogout}><DoorOpen />Logout</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
