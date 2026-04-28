import { useStore } from "@/store";
import React from "react";

const Preview = () => {
  const post = useStore((state) => state.post);
  return (
    <div className="py-6 px-4">
      <div className="max-w-[800px] mx-auto">
        <h1 className="px-0 mb-4 placeholder:text-gray-secondary2 text-gray-secondary1">
          {post?.title}
        </h1>
        <h2 className="px-0 placeholder:text-gray-secondary2 text-gray-secondary1">
          {post?.description}
        </h2>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post?.content }}
        />
      </div>
    </div>
  );
};

export default Preview;
