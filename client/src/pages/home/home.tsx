import { useEffect, useRef, useState } from "react";
import PostList from "../../components/posts/post-list";
import { PlusIcon } from "@heroicons/react/24/outline";
import Tab from "../../components/ui-v2/Tab";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import SmallCardPost from "@/components/posts/smallCardPost";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import API from "@/services/api";
import { getRecommendedPost } from "@/services/apiService";
export type TabItem = {
  id: number | string;
  label: React.ReactNode;
  nav: boolean;
  onPress?: () => void;
};

const Home = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<number | string>(2);

  const tab: TabItem[] = [
    {
      id: 1,
      label: <PlusIcon className="w-5 h-5 text-gray-tertiary1" />,
      nav: false,
      onPress: () => navigate("/post/create"),
    },
    {
      id: 2,
      label: <p className="text-base">For you</p>,
      nav: true,
      onPress: () => setActiveTab(2),
    },
    {
      id: 3,
      label: <p className="text-base">Following</p>,
      nav: true,
      onPress: () => setActiveTab(3),
    },
  ];

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
    <div className="flex flex-1 p-[32px] justify-center">
      {/* Left Content */}
      <div className={`flex flex-col flex-1 max-w-[800px] `}>
        <div className="w-2/3">
          <Tab
            tab={tab}
            activeTab={activeTab}
            setTab={(n) => {
              if (n === 1) {
                console.log("createPost");
              } else {
                setActiveTab(n);
              }
            }}
          />
        </div>
        <PostList />
      </div>

      {/* Right Content */}
      <div
        className={`w-[20%] hidden flex-col border-l-[1px] border-gray-lighter pl-5 gap-5 lg:flex`}
      >
        <div>
          <h2 className="mb-4 text-base font-medium">Most viewed</h2>
          <div className="flex flex-col gap-2">
            {recommended.map((post) => (
              <SmallCardPost key={post._id} post={post} />
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <h2 className="mb-4 text-base font-medium">Recommended tags</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="cursor-pointer text-nowrap">
              Generative AI
            </Badge>
            <Badge variant="secondary" className="cursor-pointer text-nowrap">
              Medical
            </Badge>
            <Badge variant="secondary" className="cursor-pointer text-nowrap">
              Technology
            </Badge>
            <Badge variant="secondary" className="cursor-pointer text-nowrap">
              Generative AI
            </Badge>
            <Badge variant="secondary" className="cursor-pointer text-nowrap">
              Medical
            </Badge>
            <Badge variant="secondary" className="cursor-pointer text-nowrap">
              Technology
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
