import { useContext, useEffect } from "react";
import CustomTextArea from "@/components/ui-v2/CustomTextArea";
import Tiptap from "@/editor";
import { DataContext } from "@/context/Dataprovider";
import { getpostdetail } from "@/services/apiService";
import { useLoader } from "@/context/LoaderProvider";
import { useParams } from "react-router-dom";

const CreatePost = () => {
  const { createdPostData, setCreatedPostData } = useContext(DataContext) || {};
  const { setLoading } = useLoader();
  const { id } = useParams();

  const handleChange = (key: string, value: string) => {
    console.log(key, value);
    setCreatedPostData?.({ ...createdPostData, [key]: value });
  };

  const getPostData = async () => {
    try {
      setLoading(true);
      const response = await getpostdetail(id);
      console.log(response.data.post, "post details");
      if (response.status === 200) {
        setCreatedPostData(response.data.post);
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
            {createdPostData?.content && (
              <Tiptap
                placeholder="Write your post content here..."
                value={createdPostData?.content || ""}
                onChange={(value) => handleChange("content", value)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
