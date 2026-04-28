import CustomTextArea from "@/components/ui-v2/CustomTextArea";
import Tiptap from "@/editor";
import MarkdownEditor from "@/editor/markdown-editor";
import React from "react";

const MarkDownEditorPage = ({ createdPostData, handleChange }) => {
  return (
    <>
      <div className="relative flex flex-col items-center flex-1  h-auto p-8 overflow-x-hidden overflow-y-auto">
        <div className="flex w-[800px]">
          <div className="flex flex-col flex-1">
            <CustomTextArea
              showCharCount={false}
              expandable={true}
              value={createdPostData?.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="px-0 !font-semibold !text-40-48 placeholder:text-gray-secondary2 text-gray-secondary1"
              placeholder="Type your title here..."
            />
            <CustomTextArea
              showCharCount={false}
              expandable={true}
              value={createdPostData?.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="px-0 text-lg placeholder:text-gray-secondary2 text-gray-secondary1"
              placeholder="Type your description here..."
            />
            <div className="mt-4 ">
              <MarkdownEditor
                placeholder="Write your post content here..."
                value={createdPostData?.content || ""}
                onChange={(value) => handleChange("content", value)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarkDownEditorPage;
