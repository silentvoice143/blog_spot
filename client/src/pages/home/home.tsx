import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import PostList from "../../components/posts/post-list";
import { PlusIcon } from "@heroicons/react/24/outline";
import Tab from "../../components/ui-v2/Tab";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SmallCardPost from "@/components/posts/smallCardPost";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getAllPost, getRecommendedPost } from "@/services/apiService";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-in";
import TypingText from "@/components/animations/typing-text";
import MainLayout from "@/layout/main-layout";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import PostCard, { Post } from "@/components/shared/post-card";
import CardPost from "@/components/posts/cardPost";
import { formatDate } from "@/utils/common-utils";
import { CATEGORIES } from "@/constant";
import { useStore } from "@/store";

export type TabItem = {
  id: number | string;
  label: React.ReactNode;
  nav: boolean;
  onPress?: () => void;
};

const Home = () => {
  const { isAuthenticated } = useStore();
  // const isAuthenticated = true;
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

  const { ref: topRef, inView: topInView } = useInView({
    threshold: 0,
  });

  const { ref: bottomRef, inView: bottomInView } = useInView({
    threshold: 1,
  });
  const [mode, setMode] = useState<"relative" | "fixed" | "absolute">(
    "relative",
  );
  const sidebarContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (bottomInView) {
      setMode("absolute");
    } else if (!topInView) {
      setMode("fixed");
    } else {
      setMode("relative");
    }
  }, [topInView, bottomInView]);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-tl from-green-tertiary/80 to-green-primary text-white">
        {/* Header  */}
        <div className="border-b-2 border-b-white">
          <div className="max-w-[1440px] xl2:mx-auto">
            <div className="py-3 px-6 md:px-20 lg:px-24 flex justify-between ">
              <Link to={"/"}>
                <h2 className="">BlogSpot</h2>
              </Link>
              <div className="space-x-6">
                <Link
                  className="inline-block font-medium transition-transform duration-200 hover:scale-105"
                  to={"/login"}
                >
                  Our Story
                </Link>
                <Link
                  className="inline-block font-medium transition-transform duration-200 hover:scale-105"
                  to={"/login"}
                >
                  Write
                </Link>
                <Link
                  className="inline-block font-medium transition-transform duration-200 hover:scale-105"
                  to={"/login"}
                >
                  sign In
                </Link>
                <Button
                  onClick={() => navigate("/login")}
                  className="rounded-full bg-white text-green-primary hover:bg-white"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Body  */}
        <div className="flex-1 flex">
          <div className="flex-1 flex py-10 px-6 md:px-20 lg:px-24 max-w-[1440px] mx-auto">
            <div className="flex-1 flex flex-col justify-center gap-6">
              <div className="flex items-center flex-wrap gap-6">
                <h1 className="">
                  <TypingText text="IDEA" speed={0.06} />
                </h1>

                <h1 className="">
                  <TypingText text="TURNS" speed={0.06} delay={0.3} />
                </h1>

                <h1 className="text-5xl md:text-8xl ">
                  <TypingText text="INTO" speed={0.06} delay={0.6} />
                </h1>

                <h1 className="text-5xl md:text-8xl  z-10">
                  <TypingText text="CREATIVITY" speed={0.06} delay={0.9} />
                </h1>
              </div>
              <div className="relative">
                <FadeIn delay={0.4} distance={8}>
                  <p className="mr-8 md:mr-40">
                    Give your creativity a voice—express your ideas, share your
                    vision, and turn imagination into something meaningful that
                    others can see, feel, and connect with.
                  </p>
                </FadeIn>
                <div className="absolute right-0 -bottom-20">
                  <img
                    src="/images/feather.png"
                    alt=""
                    className="h-96 opacity-70"
                  />
                </div>
              </div>
              <div>
                <Button
                  onClick={() => navigate("/login")}
                  className="rounded-full px-8 bg-white hover:scale-105 hover:bg-white/80 text-black-primary transition-transform duration-100"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t-2 border-t-white">
          <div className="max-w-[1440px] xl2:mx-auto">
            <div className="py-3 px-6 md:px-20 lg:px-24 flex items-center justify-between ">
              <p className="font-medium">
                © {new Date().getFullYear()} BlogSpot. All rights reserved.
              </p>
              <div className="space-x-6">
                <Link className="font-medium" to={"/"}>
                  About Us
                </Link>
                <Link className="font-medium" to={"/"}>
                  Profile
                </Link>
                <Link className="font-medium" to={"/"}>
                  Linked In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dummyPosts: Post[] = [
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
      tags: ["Tech", "AI"],
      title: "The Rise of Artificial Intelligence",
      excerpt:
        "AI is reshaping industries and redefining how humans interact with machines.",
      author: "Aarav Sharma",
      date: "Apr 10, 2026",
      readTime: "6 min",
    },

    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
      tags: ["Programming", "React"],
      title: "Mastering React in 2026",
      excerpt:
        "React continues to evolve with new hooks and performance improvements.",
      author: "Rohan Gupta",
      date: "Apr 6, 2026",
      readTime: "7 min",
    },
    {
      image: "",
      tags: ["Design", "UI/UX"],
      title: "Design Trends You Should Follow",
      excerpt:
        "Minimalism, glassmorphism, and bold typography are leading design trends.",
      author: "Neha Kapoor",
      date: "Apr 5, 2026",
      readTime: "5 min",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
      tags: ["Finance", "Crypto"],
      title: "Understanding Crypto Markets",
      excerpt:
        "Crypto markets are volatile but offer huge opportunities for investors.",
      author: "Karan Mehta",
      date: "Apr 3, 2026",
      readTime: "6 min",
    },
    {
      image: "https://source.unsplash.com/random/300x400?productivity",
      tags: ["Productivity", "Self Growth"],
      title: "Boost Your Daily Productivity",
      excerpt:
        "Simple habits can drastically improve your daily efficiency and focus.",
      author: "Simran Kaur",
      date: "Apr 1, 2026",
      readTime: "3 min",
    },
  ];

  const dummyCardPosts = [
    {
      _id: "1",
      title: "Understanding Async JavaScript",
      description:
        "Async JavaScript allows non-blocking execution using promises and async/await.",
      createdAt: "2026-04-10T10:30:00Z",
      email: "aarav.sharma@example.com",
      picture:
        "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
      author: {
        name: "Aarav Sharma",
      },
      tags: ["JavaScript", "Async", "Programming"],
      comments: [{}, {}, {}], // 3 comments
    },
    {
      _id: "2",
      title: "React vs Next.js in 2026",
      description:
        "Choosing between React and Next.js depends on your app's needs and SEO requirements.",
      createdAt: "2026-04-08T14:20:00Z",
      email: "priya.verma@example.com",
      picture:
        "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
      author: {
        name: "Priya Verma",
      },
      tags: ["React", "Next.js", "Frontend"],
      comments: [{}, {}],
    },
    {
      _id: "3",
      title: "Mastering Tailwind CSS",
      description:
        "Tailwind CSS helps you build modern UI faster with utility-first classes.",
      createdAt: "2026-04-06T09:15:00Z",
      email: "rohan.gupta@example.com",
      picture:
        "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
      author: {
        name: "Rohan Gupta",
      },
      tags: ["CSS", "Tailwind", "Design"],
      comments: [{}],
    },
    {
      _id: "4",
      title: "Node.js Performance Tips",
      description:
        "Improve Node.js performance using clustering, caching, and async patterns.",
      createdAt: "2026-04-05T18:00:00Z",
      email: "neha.kapoor@example.com",
      picture: "",
      author: {
        name: "Neha Kapoor",
      },
      tags: ["Node.js", "Backend", "Performance"],
      comments: [{}, {}, {}, {}],
    },
    {
      _id: "5",
      title: "Getting Started with MongoDB",
      description:
        "MongoDB is a NoSQL database that stores data in flexible JSON-like documents.",
      createdAt: "2026-04-03T11:45:00Z",
      email: "karan.mehta@example.com",
      picture:
        "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
      author: {
        name: "Karan Mehta",
      },
      tags: ["MongoDB", "Database"],
      comments: [],
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen px-8 justify-center">
        <div className="h-full flex flex-1 flex-row justify-center">
          <div
            className={`h-full flex flex-col flex-1 max-w-[800px] py-8 sm:border-r`}
          >
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
              // <PostList posts={posts} />
              <div className="flex flex-col gap-4">
                <div className="flex-1 sm:pr-4">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    plugins={[
                      Autoplay({
                        delay: 2000,
                      }),
                    ]}
                  >
                    <CarouselContent className="">
                      {dummyPosts.map((post, i) => (
                        <CarouselItem key={i}>
                          <PostCard post={post} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>

                  <div className="my-8">
                    {dummyCardPosts.map((data, idx) => (
                      <div key={data._id}>
                        <CardPost
                          title={data.title}
                          content={data.description}
                          dop={formatDate(new Date(data.createdAt))}
                          email={data.email}
                          picture={data.picture}
                          author={data.author.name}
                          tags={data.tags.join(",")}
                          id={data._id}
                          comments={data.comments.length}
                        />
                        {idx !== dummyCardPosts.length - 1 && (
                          <Separator className="bg-gray-200 my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div></div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex-1 pr-4">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    plugins={[
                      Autoplay({
                        delay: 2000,
                      }),
                    ]}
                  >
                    <CarouselContent className="">
                      {dummyPosts.map((post, i) => (
                        <CarouselItem key={i}>
                          <PostCard post={post} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>

                  <div className="my-8">
                    {dummyCardPosts.map((data, idx) => (
                      <div key={data._id}>
                        <CardPost
                          title={data.title}
                          content={data.description}
                          dop={formatDate(new Date(data.createdAt))}
                          email={data.email}
                          picture={data.picture}
                          author={data.author.name}
                          tags={data.tags.join(",")}
                          id={data._id}
                          comments={data.comments.length}
                        />
                        {idx !== dummyCardPosts.length - 1 && (
                          <Separator className="bg-gray-200 my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div></div>
              </div>
            )}
          </div>

          {/* Right Content */}
          <div
            className="relative w-[30%] hidden lg:block"
            ref={sidebarContainerRef}
          >
            {/* <div ref={topRef} className="h-[1px] w-full bg-red-300"></div> */}
            {/* SIDEBAR */}
            <div className="">
              <div className="flex flex-col pl-5 gap-5 py-8">
                <div>
                  <h2 className="mb-4 text-base font-medium">Most viewed</h2>
                  <div className="flex flex-col gap-2">
                    {dummyCardPosts.map((post, idx) => (
                      <div>
                        <SmallCardPost key={post._id} post={post} />
                        {idx !== dummyCardPosts.length - 1 && (
                          <Separator className="bg-gray-200 my-6" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h2 className="mb-4 text-base font-medium">
                    Recommended tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="cursor-pointer text-nowrap hover:bg-gray-200"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* <div ref={bottomRef} className="h-[1px] w-full bg-red-300"></div> */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
