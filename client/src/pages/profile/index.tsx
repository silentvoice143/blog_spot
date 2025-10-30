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
import EditProfileModal from "@/components/user/modal/edit-profile-modal";
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
        <div className="w-full max-w-5xl px-4 sm:px-6 md:px-8 py-6 sm:py-10 md:py-12 flex flex-col gap-4 md:gap-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12">
            <Avatar className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 mx-auto sm:mx-0">
              <AvatarImage src="https://images.pexels.com/photos/1097456/pexels-photo-1097456.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
              <AvatarFallback>SK</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-4 justify-center text-center sm:text-left">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-montserrat">
                  {userData?.name}
                </h1>
              </div>

              <div className="flex gap-6 md:gap-8 justify-center sm:justify-start mt-2 md:mt-4 flex-wrap">
                <div>
                  <h3 className="text-lg sm:text-xl font-montserrat font-semibold">
                    {userData?.totalPosts}
                  </h3>
                  <p className="text-sm sm:text-base font-montserrat text-gray-600">
                    posts
                  </p>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-montserrat font-semibold">
                    {userData?.followers?.length}
                  </h3>
                  <p className="text-sm sm:text-base font-montserrat text-gray-600">
                    followers
                  </p>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-montserrat font-semibold">
                    {userData?.following?.length}
                  </h3>
                  <p className="text-sm sm:text-base font-montserrat text-gray-600">
                    following
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {userData?.bio && (
            <div className="mt-4 md:mt-6">
              <h3 className="text-sm sm:text-base font-semibold font-montserrat">
                Bio
              </h3>
              <p className="text-sm sm:text-base font-montserrat text-gray-700">
                {userData?.bio}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 sm:gap-4 mb-4 md:mb-6 flex-wrap">
            {userId === account.id && (
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="px-4 sm:px-6 text-sm sm:text-base"
              >
                Edit profile
              </Button>
            )}
            <Button
              variant="outline"
              className={`px-4 sm:px-6 text-sm sm:text-base ${
                copied
                  ? "border-green-500 text-green-500 hover:text-green-700"
                  : ""
              }`}
              onClick={handleCopy}
            >
              {copied ? "Link Copied!" : "Share Profile"}
            </Button>
          </div>

          <Separator />

          {/* Recent Posts Section */}
          <div className="w-full">
            <h1 className="text-lg sm:text-xl font-semibold mb-4 md:mb-6">
              Recent posts
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              {userData?.recentPosts?.map((post) => (
                <div key={post._id} className="w-full flex flex-shrink-0">
                  <SmallCardPost post={post} />
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="mt-6 w-full sm:w-auto"
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
