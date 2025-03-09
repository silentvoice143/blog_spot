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
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import WriteIcon from "../icons/write";
import { Button } from "../ui/button";
import CreatePostModal from "@/pages/create/modals/create-post-modal";
import { useLoader } from "@/context/LoaderProvider";

export default function Navbar({ setAuthentication }) {
  const [drop, setDrop] = useState(false);
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
        {location.pathname !== "/post/create" &&
          !location.pathname.includes("/post/edit") && (
            <div className="write">
              <Link
                to="/post/create"
                className="flex items-center h-10 gap-2 px-3 py-2 rounded-full hover:bg-gray-tertiary"
              >
                <WriteIcon />
                <span className="text-base">Write</span>
              </Link>
            </div>
          )}
        <DropdownMenu>
          <DropdownMenuTrigger className="w-10 h-10 text-base rounded-full bg-gray-secondary1 focus:outline-none">
            SK
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[180px]" align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
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
