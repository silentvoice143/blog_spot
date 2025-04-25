import {
  useNavigate,
  Link,
  useParams,
  useLocation,
  Links,
} from "react-router-dom";
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
import { BellIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import WriteIcon from "../icons/write";
import { Button } from "../ui/button";
import CreatePostModal from "@/pages/create/modals/create-post-modal";
import { useLoader } from "@/context/LoaderProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import SearchBox from "../ui-v2/SearchBox";
import { useNotifications } from "@/context/NotificationProvider";
import { useNavbarContext } from "@/context/Navbar";
import { SearchIcon } from "lucide-react";
import { Separator } from "../ui/separator";

export default function Navbar({ setAuthentication }) {
  const { setLoading } = useLoader();
  const { setAccount } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState<{
    type: "publish" | "draft";
    isOpen: boolean;
  }>({
    type: "publish",
    isOpen: false,
  });

  const { account } = useContext(DataContext);
  const { notifications, unreadCount } = useNotifications();
  const { setShowNotifications } = useNavbarContext();

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
      <div className="flex gap-6 items-center">
        <h1
          onClick={handlelogoclick}
          className="font-semibold text-32-34 font-montserrat cursor-pointer"
        >
          Blogspot
        </h1>
        <SearchBox />
        <Button
          variant="ghost"
          className="p-2 rounded-full mr-4 md:hidden"
          onClick={() => console.log("search")}
        >
          <SearchIcon height={20} width={20} className="h-5 w-5 " />
        </Button>
      </div>
      <div className="flex items-center gap-4 ">
        {location.pathname === "/post/create" && (
          <Button
            onClick={() => setModalOpen({ type: "draft", isOpen: true })}
            variant="default"
            className="rounded-full"
          >
            Save to draft
          </Button>
        )}
        {location.pathname === "/post/create" && (
          <Button
            onClick={() => setModalOpen({ type: "publish", isOpen: true })}
            variant="default"
            className="rounded-full"
          >
            Publish
          </Button>
        )}
        {location.pathname.includes("/post/edit") && (
          <Button
            onClick={() => setModalOpen({ type: "publish", isOpen: true })}
            variant="default"
            className="rounded-full"
          >
            Save
          </Button>
        )}
        {modalOpen.isOpen && (
          <CreatePostModal
            type={modalOpen.type}
            isOpen={modalOpen.isOpen}
            onClose={() => setModalOpen({ ...modalOpen, isOpen: false })}
          />
        )}
        <button onClick={() => setShowNotifications(true)} className="relative">
          {unreadCount > 0 && (
            <div className="absolute -top-1 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></div>
          )}
          <BellIcon className="h-[18px] w-[18px]" />
        </button>
        {location.pathname !== "/post/create" &&
          !location.pathname.includes("/post/edit") && (
            <div className="write">
              <Link
                to="/post/create"
                className="hidden md:flex items-center h-10 gap-2 px-3 py-2 rounded-full hover:bg-gray-tertiary"
              >
                <WriteIcon />
                <span className="text-base">Write</span>
              </Link>
            </div>
          )}
        <DropdownMenu>
          <DropdownMenuTrigger className="w-10 h-10 text-base rounded-full">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[180px]" align="end">
            <DropdownMenuItem
              className="md:hidden"
              onClick={() => navigate(`/post/create`)}
            >
              <WriteIcon />
              <span className="text-sm">Write</span>
            </DropdownMenuItem>
            <Separator className="my-1" />
            <DropdownMenuItem
              onClick={() => navigate(`/profile/${account.id}`)}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/stories`)}>
              Stories
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/settings`)}>
              Setting
            </DropdownMenuItem>
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
