import React, { useEffect, useState } from "react";

const Preview = () => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const syncPreview = () => {
      const savedPost = localStorage.getItem("preview_post");

      if (savedPost) {
        setPost(JSON.parse(savedPost));
      }
    };


    syncPreview();

    const interval = setInterval(() => {
      syncPreview();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const hasContent =
    post?.title?.trim() ||
    post?.description?.trim() ||
    post?.content?.trim();

  if (!hasContent) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-3">
            Nothing to Preview
          </h1>
          <p className="text-gray-500">
            You haven’t created any post content yet.
            Start writing your story to see the preview here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      <div className="max-w-[800px] mx-auto">
        <h1 className="mb-4 text-gray-secondary1 font-semibold text-3xl">
          {post?.title}
        </h1>

        <h2 className="mb-6 text-gray-secondary1 text-lg">
          {post?.description}
        </h2>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post?.content }}
        />
      </div>
    </div>
  );
};

export default Preview;