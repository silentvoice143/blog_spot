import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import SmartImage from "../shared/smart-image";

// ✅ Type for post
export interface SmallPost {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  picture?: string;
  author: {
    name: string;
  };
}

interface SmallCardPostProps {
  post: SmallPost;
}

const SmallCardPost: React.FC<SmallCardPostProps> = ({ post }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getAuthorInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase() || "A"
    );
  };

  return (
    <Link className="relative block" to={`/post/${post._id}`}>
      <Card className="p-0 border-none shadow-none outline-none w-fit max-w-[400px] flex-1 h-full">
        <CardContent className="p-0 h-full flex flex-col gap-3">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="flex shrink-0 items-center justify-center w-8 h-8 text-sm font-medium bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-full">
              {getAuthorInitials(post.author.name)}
            </div>
            <p className="text-sm text-black-primary font-medium">
              In Generative Ai by {post.author.name}
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-3 flex-1">
            <h1 className="text-xl font-bold font-montserrat line-clamp-2">
              {post.title}
            </h1>

            <p className="text-sm font-normal text-black-secondary line-clamp-3 flex-1">
              {post.description}
            </p>

            <div className="flex justify-end gap-4">
              <div className="text-sm">
                {formatDate(new Date(post.createdAt))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SmallCardPost;
