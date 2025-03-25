import ClapIcon from "@/components/icons/ClapIcon";
import Comment from "@/components/posts/comment";
import CustomTextArea from "@/components/ui-v2/CustomTextArea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataContext } from "@/context/Dataprovider";
import { useLoader } from "@/context/LoaderProvider";
import {
  addComment,
  addReply,
  addViewPost,
  deletePost,
  followUser,
  getComments,
  getfollowUser,
  getpostdetail,
  unfollowUser,
  updatePost,
} from "@/services/apiService";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import DeleteIcon from "@/components/icons/DeleteIcon";

export type PostType = {
  title: string;
  content: string;
  description: string;
  tags: string[];
  author: { _id: string; name: string; email: string };
  picture: string;
  status: string;
  view: number;
  _id: string;
  comments: any;
};

function Post() {
  const { id } = useParams();
  const { setLoading } = useLoader();
  const { account } = useContext(DataContext);
  const navigate = useNavigate();
  const [postData, setPostData] = useState<PostType>();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [following, setFollowing] = useState(false);
  const [status, setStatus] = useState<"publish" | "draft" | null>(null);

  useEffect(() => {
    if (id) {
      getPostData();
      fetchComments();
    }
  }, []);

  useEffect(() => {
    // Listen to popstate (back/forward button) event to ensure the user doesn't go back
    const handlePopState = () => {
      navigate("/", { replace: true });
    };

    // Attach event listener for popstate
    window.addEventListener("popstate", handlePopState);

    return () => {
      // Clean up the event listener when the component is unmounted
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const getPostData = async () => {
    try {
      setLoading(true);
      const response = await getpostdetail(id);
      console.log(response.data.post, "post details");
      if (response.status === 200) {
        setPostData(response.data.post);
        setStatus(response.data.post.status);
        handleFollow(response.data.post.author._id);
      } else {
        console.log("something is wrong");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(id);
      if (response.status === 200) {
        console.log(response.data);
        setComments(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const response = await addComment({
        text: commentText,
        postId: id,
        parentId: null,
      });

      if (response.status === 201) {
        console.log(response, "comments");
        setCommentText("");
        setComments((prev) => {
          return [response.data.comment, ...prev];
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const handleLike = async (commentId) => {
  //   try {
  //     await likeComment(commentId, user.token);
  //     fetchComments();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // console.log(account.id, postData.author._id);

  const handleFollow = async (authorId) => {
    try {
      console.log("calling this api....");
      const response = await getfollowUser({ authorId: authorId });
      if (response.status === 200) {
        console.log(response.data);
        setFollowing(response.data.follow);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollowing = async () => {
    try {
      const response = await followUser({
        userId: postData.author._id,
        followerId: account.id,
      });
      console.log(response, "----response");
      if (response.status === 200) {
        setFollowing(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleunFollowing = async () => {
    try {
      const response = await unfollowUser({
        userId: account.id,
        followerId: postData.author._id,
      });
      console.log(response, "----response");
      if (response.status === 200) {
        setFollowing(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const dataObj = {
        ...postData,
        status: "publish",
      };

      const response = await updatePost(dataObj, id);

      if (response.status === 200) {
        console.log(response.data, "----update data");
        setStatus("publish");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      setLoading(true);
      const dataObj = {
        ...postData,
        status: "publish",
      };

      const response = await deletePost(id);

      if (response.status === 200) {
        console.log(response.data, "----delete data");
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddView = async () => {
    try {
      setLoading(true);

      const response = await addViewPost(id);

      if (response.status === 200) {
        console.log(response.data, "----view added data");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set the timeout for 2 minutes (120,000ms)
    const timer = setTimeout(() => {
      handleAddView();
    }, 120000); // 2 minutes

    // Cleanup function to clear the timer if the component is unmounted before 2 minutes
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex justify-center flex-1 w-screen h-auto p-8 overflow-x-hidden overflow-y-auto">
      <div className="flex flex-col gap-6 w-[800px]">
        {postData ? (
          <>
            <div className="flex ">
              <div className="flex flex-1 gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        navigate(`/profile/${postData.author._id}`)
                      }
                      className="cursor-pointer hover:text-greenshade-primary transition-colors duration-75"
                    >
                      Satyam Kumar
                    </button>
                    {postData.author._id !== account.id ? (
                      following ? (
                        <Button
                          className="h-6 px-2 text-xs"
                          variant="outline"
                          onClick={() => handleunFollowing()}
                        >
                          Unfollow
                        </Button>
                      ) : (
                        <Button
                          className="h-6 px-2 text-xs"
                          variant="outline"
                          onClick={() => handleFollowing()}
                        >
                          follow
                        </Button>
                      )
                    ) : null}
                  </div>
                  <p className="text-xs">12 Jan, 2024</p>
                </div>
              </div>
              {postData.author._id === account.id && (
                <div className="flex gap-4">
                  <Button
                    className="h-8"
                    variant="outline"
                    onClick={() => navigate(`/post/edit/${postData._id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="h-8 w-8 p-0 border-red-500 bg-red-200/20 hover:bg-red-200/30"
                    variant="outline"
                    onClick={() => handleDeletePost()}
                  >
                    <DeleteIcon />
                  </Button>
                  {status !== "publish" && (
                    <Button
                      onClick={() => handleUpdate()}
                      variant="outline"
                      className="border-green-400 h-8"
                    >
                      Publish
                    </Button>
                  )}
                </div>
              )}
            </div>
            <h1 className="px-0 font-semibold text-40-48 placeholder:text-gray-secondary2 text-gray-secondary1">
              {postData.title}
            </h1>
            <h3 className="px-0 text-lg placeholder:text-gray-secondary2 text-gray-secondary1">
              {postData.description}
            </h3>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: postData.content }}
            />
            <div className="flex flex-col gap-6">
              <h1 className="text-xl font-semibold">
                Wanna give some feedback? Leave a comment below!
              </h1>
              <CustomTextArea
                expandable={true}
                minRows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="p-4 text-base placeholder:text-gray-secondary2 text-gray-secondary1 bg-whiteshade-tertiary1 rounded-xl"
                placeholder="Reply to this guy"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleAddComment}
                  className="h-10 rounded-full "
                >
                  send
                </Button>
              </div>
              <h1 className="text-xl font-semibold">
                Responses ({comments.length})
              </h1>

              <div className="flex flex-col gap-4 flex-1">
                {comments.map((comment, idx) => (
                  <Comment
                    hidebtn={false}
                    fetchComment={fetchComments}
                    postId={id}
                    key={`${comment.id} ${idx}`}
                    comment={comment}
                    onLike={() => {}}
                  />
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Post;
