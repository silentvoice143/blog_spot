import { useContext, useEffect } from "react";
import CustomTextArea from "@/components/ui-v2/CustomTextArea";
import Tiptap from "@/editor";
import { DataContext } from "@/context/Dataprovider";
import { getpostdetail, updatePost } from "@/services/apiService";
import { useLoader } from "@/context/LoaderProvider";
import { useNavigate, useParams } from "react-router-dom";
import NavbarV2 from "@/components/Navbar/navbar-v2";

const EditPost = ({ setAuthentication }) => {
  const { createdPostData, setCreatedPostData } = useContext(DataContext) || {};
  const { setLoading } = useLoader();
  const { id } = useParams();
  const navigate = useNavigate();

  const handleChange = (key: string, value: string) => {
    console.log(key, value);
    setCreatedPostData?.({ ...createdPostData, [key]: value });
  };

  const getPostData = async () => {
    try {
      setLoading(true);
      const response = await getpostdetail(id);

      if (response.status === 200) {
        setCreatedPostData(response.data.post);
        setLoading(false);
      } else {
        console.log("something is wrong");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const dataObj = {
        title: createdPostData.title,
        description: createdPostData.description,
        content: createdPostData.content,
        status: createdPostData.status,
      };

      const response = await updatePost(dataObj, id);

      if (response.status === 200) {
        setCreatedPostData(null);
        navigate(`/post/${id}`, { replace: true });
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

  if (!createdPostData) {
    return null; // You can render a loading state here
  }

  return (
    <div>
      <NavbarV2
        setAuthentication={setAuthentication}
        setSteps={() => {}}
        handleUpdatePost={handleUpdate}
      />
      <div className="relative flex flex-col items-center flex-1 w-screen h-auto p-8 overflow-x-hidden overflow-y-auto">
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
                value={createdPostData?.content ?? ""}
                onChange={(value) => handleChange("content", value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
