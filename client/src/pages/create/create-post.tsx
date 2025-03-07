import { useContext, useEffect } from "react";
import CustomTextArea from "@/components/ui-v2/CustomTextArea";
import Tiptap from "@/editor";
import { DataContext } from "@/context/Dataprovider";

const CreatePost = () => {
  const { createdPostData, setCreatedPostData } = useContext(DataContext) || {};

  const handleChange = (key: string, value: string) => {
    console.log(key, value);
    setCreatedPostData?.({ ...createdPostData, [key]: value });
  };

  return (
    <div className="relative flex justify-center flex-1 w-screen h-auto p-8 overflow-x-hidden overflow-y-auto">
      <div className="flex w-[800px]">
        <div className="flex flex-col flex-1">
          <CustomTextArea
            expandable={true}
            value={createdPostData?.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="px-0 font-semibold text-40-48 placeholder:text-gray-secondary2 text-gray-secondary1"
            placeholder="Type your title here..."
          />
          <CustomTextArea
            expandable={true}
            value={createdPostData?.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="px-0 text-lg placeholder:text-gray-secondary2 text-gray-secondary1"
            placeholder="Type your description here..."
          />
          <div className="mt-4 ">
            <Tiptap
              placeholder="Write your post content here..."
              value={createdPostData?.content || ""}
              onChange={(value) => handleChange("content", value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
