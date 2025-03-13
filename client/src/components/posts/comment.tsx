import { Card, CardContent } from "../ui/card";
import ClapIcon from "../icons/ClapIcon";
import { useEffect, useState } from "react";
import CustomTextArea from "../ui-v2/CustomTextArea";
import { Button } from "../ui/button";
import CommentIcon from "../icons/CommentIcon";
import { addReply } from "@/services/apiService";

type commentProps = {
  postId: string;
  comment: any;
  onLike: () => void;
  fetchComment: () => void;
  hidebtn:boolean
};

function Comment({ postId, comment, onLike, fetchComment ,hidebtn}: commentProps) {
  const [toggleReply, setToggleReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const handleChange = (key: string, value: string) => {
    console.log(key, value);
    setReplyText(value);
  };
  const [replies, setReplies] = useState(comment.replies || []);
  console.log(comment, "----------comments");

  const handleAddReply = async () => {
    if (!replyText.trim()) return;
    try {
      const response = await addReply(
        {
          text: replyText,
          postId: postId,
        },
        comment._id
      );

      if (response.status === 201) {
        console.log(response, "-----replyresponse");
        setReplyText("");
        setReplyingTo(null);
        fetchComment();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const formatdate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(()=>{
    setReplies(comment.replies)
  },[comment])
  return (
    <Card className="border-none shadow-none outline-none rounded-xl">
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-4">
            <div className="flex items-center justify-center w-8 h-8 text-xs bg-green-300 rounded-full">
              {comment.userId.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-sm font-medium text-black-primary">
                {comment.userId.name}
              </h2>
              <p className="text-xs font-light text-gray-secondary1">
                {formatdate(new Date(comment.createdAt))}
              </p>
            </div>
          </div>
          <p className="text-sm font-light text-black-primary">
            {comment.text}
          </p>
          <div className="flex gap-4">
            <button
              onClick={onLike}
              className="flex items-center justify-center gap-2 cursor-pointer"
            >
              <ClapIcon height={16} width={16} />
              <p className="text-sm font-medium">1</p>
            </button>
            

            <button
              onClick={() => {
                setToggleReply(!toggleReply);
              }}
              className="text-xs font-medium underline cursor-pointer"
            >
              Reply
            </button>
            
          </div>
          {(toggleReply || showReplies) && (
            <div className="relative flex flex-col ml-2">
              <div className="absolute w-1 h-full bg-gray-secondary3"></div>

              {toggleReply && (
                <div className="flex-1 flex-col p-4 ml-4 rounded-xl bg-whiteshade-tertiary1">
                  <CustomTextArea
                    expandable={true}
                    minRows={4}
                    value={replyText}
                    onChange={(e) => handleChange("reply", e.target.value)}
                    className="px-0 py-0 text-base placeholder:text-gray-secondary2 text-gray-secondary1"
                    placeholder="Reply to this guy"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => setToggleReply(false)}
                      variant="secondary"
                      className="px-3 text-xs rounded-full h-7"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleAddReply()}
                      className="px-3 text-xs rounded-full h-7"
                    >
                      Respond
                    </Button>
                  </div>{" "}
                </div>
              )}

              <div className="flex flex-col flex-1 gap-4">
                {showReplies &&
                  replies?.length > 0 &&
                  replies?.map((reply, idx) => (
                    <Comment
                      fetchComment={fetchComment}
                      postId={postId}
                      key={`${reply.id} ${idx}`}
                      comment={reply}
                      onLike={() => {}}
                      hidebtn={true}
                    />
                  ))}
              </div>
            </div>
          )}
          <div className="ml-4">
          {!hidebtn&&<button
              onClick={() => {
                setShowReplies(!showReplies);
              }}
              className="flex items-center justify-center gap-2 cursor-pointer"
            >
              <p className="text-xs font-medium">{showReplies?"Hide replies":"Show Replies"}</p>
            </button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Comment;
