import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";

function SmallCardPost({ post }) {
  const formatdate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const getAuthorInitials = (name) => {
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
    <Link className="relative" to={`/post/${post._id}`}>
      <Card className="p-0 border-none shadow-none outline-none w-fit max-w-[400px] flex-1 h-full">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 text-sm font-medium bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-full">
              {getAuthorInitials(post.author.name)}
            </div>
            <p className="text-sm font-light text-gray-secondary2">
              In Generative Ai by {post.author.name}
            </p>
          </div>
          <div className="flex flex-col gap-3 mt-3 flex-1">
            <h1 className="text-2xl font-bold font-montserrat">{post.title}</h1>
            <p
              className={`text-base text-wrap font-light text-gray-secondary1 truncate ... flex-1`}
            >
              {post.description}
            </p>
            <div className="flex justify-end gap-4">
              <div className="text-sm">
                {formatdate(new Date(post.createdAt))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default SmallCardPost;
