import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { getTimeAgo } from "@/utils/common-utils";

function NotificationCard({ data }) {
  return (
    <div
      className="flex items-center w-full cursor-pointer flex-col px-4"
      onClick={() => {}}
    >
      <div className="flex items-center gap-2 mb-3 w-full">
        <div className="h-12 w-12 border border-gray-secondary2 rounded-full flex justify-center items-center flex-shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.pn" />
            <AvatarFallback>
              {data?.fromUser?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex gap-1">
          <div className="text-gray-secondary1">
            <p className="inline">
              <span className="font-semibold">{data?.fromUser?.name}</span>
              {data.type === "follow" && <span> started following you.</span>}
              {data.type === "comment" && (
                <span> commented on your post ldsfjkl kljdkl dkljfk lj.</span>
              )}
              {data.type === "like" && <span> liked your post.</span>}
              {data.type === "new_post" && <span> posted a new post.</span>}
            </p>
            <p className="text-gray-secondary2 text-sm ml-1 inline">
              · {getTimeAgo(data.createdAt)}
            </p>
          </div>
        </div>
      </div>
      <Separator className="w-2/3" />
    </div>
  );
}

export default NotificationCard;
