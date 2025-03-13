import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { DataContext } from "../../context/Dataprovider";
import { logoutUser } from "../../services/apiService";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Button } from "../ui/button";

import { useLoader } from "@/context/LoaderProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type props = {
  setAuthentication?: any;
  setSteps?: (n: number) => void;
  handleUpdatePost?: () => void;
  handleDraft?: () => void;
};

export default function NavbarV2({
  setAuthentication,
  setSteps,
  handleUpdatePost,
  handleDraft,
}: props) {
  const { setLoading } = useLoader();
  const { setAccount } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { account } = useContext(DataContext);

  const handlelogoclick = () => {
    navigate("/");
  };

  const logouthandle = async () => {
    try {
      setLoading(true);
      let response = await logoutUser();
      if (response.status === 200) {
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("accessToken");
        setAuthentication(false);
        setAccount({ email: "", token: "", name: "", id: "" });
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative flex flex-0 items-center justify-between h-[85px] px-10 navbar border-b-[1px] border-gray-lighter">
      <h1
        onClick={handlelogoclick}
        className="font-semibold text-32-34 font-montserrat"
      >
        Blogspot
      </h1>
      <div className="flex items-center gap-4 ">
        {location.pathname === "/post/create" && (
          <Button
            onClick={() => handleDraft()}
            variant="default"
            className="rounded-full bg-greenshade-primary !text-xs h-8 hover:bg-greenshade-primary/80"
          >
            Save to draft
          </Button>
        )}
        {location.pathname === "/post/create" && (
          <Button
            onClick={() => {
              setSteps(2);
            }}
            variant="default"
            className="rounded-full bg-greenshade-primary !text-xs h-8 hover:bg-greenshade-primary/80"
          >
            Publish
          </Button>
        )}
        {location.pathname.includes("/post/edit") && (
          <Button
            onClick={() => {
              handleUpdatePost();
            }}
            variant="default"
            className="rounded-full bg-greenshade-primary !text-xs h-8 hover:bg-greenshade-primary/80"
          >
            Update the post
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className="w-10 h-10 text-base rounded-full bg-gray-secondary1 focus:outline-none">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>SK</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[180px]" align="end">
            <DropdownMenuItem
              onClick={() => navigate(`/profile/${account.id}`)}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Stories</DropdownMenuItem>
            <DropdownMenuItem>Setting</DropdownMenuItem>
            <DropdownMenuItem>Help</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                logouthandle();
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
