import { Card, CardContent } from "../ui/card";
import ClapIcon from "../icons/ClapIcon";
import { useState } from "react";
import CustomTextArea from "../ui-v2/CustomTextArea";
import { Button } from "../ui/button";

type commentProps = {
  comment: string;
  user: { name: string; email: string; id: string };
  onLike: () => void;
  onComment: ({ postId, text, user }) => void;
  date: string;
  commentId: string; // unique identifier for the comment
};

function Comment({
  comment,
  user,
  onLike,
  onComment,
  date,
  commentId,
}: commentProps) {
  const [toggleReply, setToggleReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const handleChange = (key: string, value: string) => {
    console.log(key, value);
    setReplyText(value);
  };
  return (
    <Card className="border-none shadow-none outline-none rounded-xl">
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-4">
            <div className="flex items-center justify-center w-8 h-8 text-xs bg-green-300 rounded-full">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-sm font-medium text-black-primary">
                {user.name}
              </h2>
              <p className="text-xs font-light text-gray-secondary1">{date}</p>
            </div>
          </div>
          <p className="text-sm font-light text-gray-secondary1">{comment}</p>
          <div className="flex gap-4">
            <button
              onClick={onLike}
              className="flex items-center justify-center gap-2 cursor-pointer"
            >
              <ClapIcon height={16} width={16} />
              <p className="text-sm font-medium">1</p>
            </button>
            <button
              onClick={() => setToggleReply(!toggleReply)}
              className="text-sm font-medium underline cursor-pointer"
            >
              Reply
            </button>
          </div>
          {toggleReply && (
            <div className="relative flex ml-2">
              <div className="absolute w-1 h-full bg-gray-secondary3"></div>
              <div className="flex-1 p-4 ml-4 rounded-xl bg-whiteshade-tertiary1">
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
                  <Button className="px-3 text-xs rounded-full h-7">
                    Respond
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default Comment;
