import ClapIcon from "@/components/icons/ClapIcon";
import Comment from "@/components/posts/comment";
import CustomTextArea from "@/components/ui-v2/CustomTextArea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataContext } from "@/context/Dataprovider";
import { useLoader } from "@/context/LoaderProvider";
import { addComment, getpostdetail } from "@/services/apiService";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

  const getPostData = async () => {
    try {
      setLoading(true);
      const response = await getpostdetail(id);
      console.log(response.data.post, "post details");
      if (response.status === 200) {
        setPostData(response.data.post);
      } else {
        console.log("something is wrong");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getPostData();
    }
  }, [id]);

  const onComment = async () => {
    try {
      const response = await addComment({
        text: commentText,
        postId: id,
      });
      if (response.status === 201) {
        console.log(response.data);
        setCommentText("");
        getPostData(); // refresh the comments
      }
    } catch (err) {
      console.log(err);
    }
  };

  const formatdate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="relative flex justify-center flex-1 w-screen h-auto p-8 overflow-x-hidden overflow-y-auto">
      <div className="flex flex-col gap-6 w-[800px]">
        {postData ? (
          <>
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => navigate(`/post/edit/${postData._id}`)}
              >
                Edit
              </Button>
              {postData.status !== "publish" && (
                <Button variant="outline" className="border-green-400">
                  Publish
                </Button>
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
                <Button onClick={onComment} className="h-10 rounded-full ">
                  send
                </Button>
              </div>
              <h1 className="text-xl font-semibold">
                Responses ({postData.comments.length})
              </h1>

              <div className="flex flex-col gap-4">
                {postData.comments.map((comment) => (
                  <Comment
                    user={comment.user}
                    comment={comment.text}
                    date={formatdate(new Date(comment.createdAt))}
                    commentId={comment._id}
                    onComment={onComment}
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
