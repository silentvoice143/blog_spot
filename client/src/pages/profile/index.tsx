import SmallCardPost from "@/components/posts/smallCardPost";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  getRecommendedPost,
  getUserData,
  updateUserData,
} from "@/services/apiService";
import { Edit2Icon, Edit3Icon, EditIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import EditProfileModal from "./modals/edit-profile-modal";
import { useNavigate, useParams } from "react-router-dom";
import { useLoader } from "@/context/LoaderProvider";
import { DataContext } from "@/context/Dataprovider";

function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [copied, setCopied] = useState(false);
  const { userId } = useParams();
  const { setLoading } = useLoader();
  const { account } = useContext(DataContext);
  const navigate = useNavigate();

  const getUserDetail = async () => {
    try {
      setLoading(true);
      const response = await getUserData(userId);

      if (response.status === 200) {
        console.log(response.data.user, "-----user data");
        setUserData(response.data.user);
      } else {
        console.log("something wrong");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserDetails = async (data) => {
    try {
      setLoading(true);
      const response = await updateUserData(userId, data);
      console.log(response);
      if (response.status === 200) {
        setIsModalOpen(false);
        setUserData((prev) => {
          return { ...prev, ...response.data.data };
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const profileURL = `${window.location.origin}/profile/${userId}`;
    navigator.clipboard.writeText(profileURL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  useEffect(() => {
    getUserDetail();
  }, []);
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col items-center flex-1 relative">
        <EditProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={userData}
          onSave={updateUserDetails}
        />
        <div className="w-[1000px] px-8 py-12 flex flex-col gap-4">
          <div className="flex gap-12">
            <Avatar className="h-[200px] w-[200px]">
              <AvatarImage src="https://images.pexels.com/photos/1097456/pexels-photo-1097456.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
              <AvatarFallback>SK</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-4 justify-center">
              <div>
                <h1 className="text-40-48 font-semibold font-montserrat">
                  {userData?.name}
                </h1>
              </div>

              <div className="flex gap-6 mt-4">
                <div>
                  <h3 className="text-xl font-montserrat">
                    {userData?.totalPosts}
                  </h3>
                  <p className="text-base font-montserrat">posts</p>
                </div>
                <div>
                  <h3 className="text-xl font-montserrat">
                    {userData?.followers?.length}
                  </h3>
                  <p className="text-base font-montserrat">followers</p>
                </div>
                <div>
                  <h3 className="text-xl font-montserrat">
                    {userData?.following?.length}
                  </h3>
                  <p className="text-base font-montserrat">following</p>
                </div>
              </div>
            </div>
          </div>
          {/* <Separator /> */}
          {userData?.bio && (
            <div className="mt-6">
              <h3 className="text-base font-semibold font-montserrat">Bio</h3>
              <p className="text-base font-montserrat">{userData?.bio}</p>
            </div>
          )}
          <div className="flex gap-4 mb-6">
            {userId === account.id && (
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="px-6"
              >
                Edit profile
              </Button>
            )}
            <Button
              variant="outline"
              className={`px-6 ${copied ? "border-green-500 text-green-500 hover:text-green-700" : ""}`}
              onClick={handleCopy}
            >
              {copied ? "Link Copied!" : "Share Profile"}
            </Button>
          </div>
          <Separator />
          <div className="w-full">
            <h1 className="text-xl font-semibold mb-6">Recent posts</h1>
            <div className="grid grid-cols-2 gap-10 scrollbar-none">
              {userData?.recentPosts.map((post) => (
                <div key={post._id} className="w-fit  flex flex-shrink-0">
                  <SmallCardPost post={post} />
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => navigate("/stories")}
            >
              Show all posts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
