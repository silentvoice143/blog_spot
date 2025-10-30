import { useEffect, useRef, useState } from "react";
import PostList from "../../components/posts/post-list";
import { PlusIcon } from "@heroicons/react/24/outline";
import Tab from "../../components/ui-v2/Tab";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import SmallCardPost from "@/components/posts/smallCardPost";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import API from "@/services/api";
import { getAllPost, getRecommendedPost } from "@/services/apiService";
import { Loader2 } from "lucide-react";
import Loader from "@/components/ui/loader";
export type TabItem = {
  id: number | string;
  label: React.ReactNode;
  nav: boolean;
  onPress?: () => void;
};

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number | string>(2);
  const [loading, setLoading] = useState(false);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  let [searchParams] = useSearchParams();
  const category = searchParams.get("category");

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
      setLoadingRecommendation(true);
      const response = await getRecommendedPost();
      console.log(response, "-----res");
      if (response.data.success) {
        setRecommended(response.data.recommendedPost);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingRecommendation(false);
    }
  };

  useEffect(() => {
    const fetchDAta = async (page = 1, limit = 10) => {
      try {
        if (loadingMore || loading || !hasMore) return;
        setLoading(true);
        let data = await getAllPost(category, `?page=${page}&limit=${limit}`);

        if (data.success) {
          setPosts([...posts, ...data.posts]);
          const pagination = data.pagination;
          if (pagination.page >= pagination.totalPages) {
            setHasMore(false);
          }
          setCurrentPage(pagination.page);
        } else {
          setPosts([]);
        }
      } catch (err: any) {
        console.log(err?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDAta(1);
  }, []);

  useEffect(() => {
    getRecommendedPostData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="h-full overflow-y-auto p-[32px] justify-center">
      <div className="flex flex-row justify-center">
        <div className={`flex flex-col flex-1 max-w-[800px] `}>
          <div className="w-full md:w-2/3">
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
          {activeTab === 2 ? (
            <PostList posts={posts} />
          ) : (
            "This is following tab."
          )}
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
    </div>
  );
};

export default Home;
