import SmallCardPost from "@/components/posts/smallCardPost";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getRecommendedPost } from "@/services/apiService";
import { Edit2Icon, Edit3Icon, EditIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

function Profile() {
  const [recommended, setRecommended] = useState([]);

  const getRecommendedPostData = async () => {
    try {
      const response = await getRecommendedPost();
      console.log(response.status, "---------post datas");

      if (response.status === 200) {
        console.log(response.data, "---------post datas");
        setRecommended(response.data.recommendedPost);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRecommendedPostData();
  }, []);
  return (
    <div className="flex flex-col items-center flex-1 relative">
      <div className="w-[1000px] px-8 py-12 flex flex-col gap-6">
        <div className="flex gap-12">
          <Avatar className="h-[200px] w-[200px]">
            <AvatarImage src="https://images.pexels.com/photos/1097456/pexels-photo-1097456.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
            <AvatarFallback>SK</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-gray-secondary1">Name</p>
              <h1 className="text-40-48 font-semibold">Satyam Kumar</h1>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-secondary1 w-[100px]">Email</p>
              <div className="bg-gray-tertiary p-2 rounded-md w-[250px]">
                <p className="text-sm text-gray-secondary1">sat@gmail.com</p>
              </div>
              <Button variant="outline" className="h-10 w-10">
                <Edit2Icon />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-secondary1 w-[100px]">Password</p>
              <div className="bg-gray-tertiary p-2 rounded-md w-[250px]">
                <p className="text-sm text-gray-secondary1 pt-1">*********</p>
              </div>
              <Button variant="outline" className="h-10 w-10">
                <Edit2Icon />
              </Button>
            </div>
          </div>
        </div>
        <Separator />
        <div className="w-full">
          <h1 className="text-xl font-semibold my-4">Recent posts</h1>
          <div className="flex gap-10 overflow-y-auto scrollbar-none">
            {recommended.map((post) => (
              <div className="w-fit flex flex-shrink-0">
                <SmallCardPost key={post._id} post={post} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
