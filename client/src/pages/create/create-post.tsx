import { useContext, useEffect, useRef, useState } from "react";
import CustomTextArea from "@/components/ui-v2/CustomTextArea";
import Tiptap from "@/editor";
import { DataContext } from "@/context/Dataprovider";
import NavbarV2 from "@/components/Navbar/navbar-v2";
import { savePost, uploadFile } from "@/services/apiService";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ChangeIcon from "@/components/icons/ChangeIcon";
import MultiSelect from "@/components/ui-v2/MultiSelect";
import { useLoader } from "@/context/LoaderProvider";
import TextEditorPage from "./components/text-editor-page";
import MarkDownEditorPage from "./components/markdown-editor-page";
import { Eye } from "lucide-react";
import { useStore } from "@/store";
import { uploadSingleFile } from "@/services/upload-service";

const CreatePost = () => {
  const { post, setPost } = useStore((state) => state);
  const [createdPostData, setCreatedPostData] = useState(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedFile(file);
    }
  };
  const handleSave = async (type: "publish" | "draft") => {
    if (type === "publish") {
      try {
        setLoading(true);
        let imgRes;
        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);
          imgRes = await uploadSingleFile(formData);
          if (imgRes.status !== 200) {
            console.log("failed to upload image");
            return;
          }
        }
        const dataObj = {
          title: createdPostData.title,
          description: createdPostData.description,
          content: createdPostData.content,
          picture: imgRes?.data?.fileUrl ?? "",
          tags: selectedTags,
          status: type,
        };
        console.log("Saving as publish", dataObj);
        const response = await savePost(dataObj);
        if (response.status === 201) {
          setCreatedPostData(null);
          navigate(`/post/${response?.data?.post._id}`, { replace: true });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const dataObj = {
          title: createdPostData.title,
          description: createdPostData.description,
          content: createdPostData.content,
          status: type,
        };

        const response = await savePost(dataObj);
        if (response.status === 201) {
          console.log(response.data);
          setCreatedPostData(null);
          navigate(`/post/${response.data.post._id}`, { replace: true });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // const handleChange = (key: string, value: string) => {
  //   setCreatedPostData?.({ ...createdPostData, [key]: value });
  // };
  const handleChange = (key: string, value: string) => {
    setPost({
      ...post,
      [key]: value,
    });
  };

  const handlePreview = () => {
    if (!post) return;

    // open preview page
    window.open("/post/preview", "_blank");
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768); // mobile breakpoint
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => {
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-3">
            Desktop Only Feature
          </h1>
          <p className="text-gray-600">
            This feature is not available for mobile yet. Please open it on
            desktop or laptop for the best experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden">
      <div className="w-full flex-1 flex flex-col">
        {step === 1 ? (
          <div className="flex flex-1 relative">
            <TextEditorPage
              createdPostData={post}
              handleChange={handleChange}
            />
            <button
              onClick={() => handlePreview()}
              className="flex items-center justify-center border border-neutral-200 shadow-sm h-10 w-10 rounded-full fixed top-[100px] right-12 bg-transparent hover:bg-neutral-200 transition-all duration-300"
            >
              <Eye size={20} className="text-black-secondary" />
            </button>
          </div>
        ) : (
          // <MarkDownEditorPage
          //   createdPostData={createdPostData}
          //   handleChange={handleChange}
          // />
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="w-[800px] border-1 flex gap-6">
              <div className="flex-1">
                <h2 className="font-semibold mb-2 text-gray-secondary1">
                  Story Preview
                </h2>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <div
                  onClick={() =>
                    !selectedImage && fileInputRef.current?.click()
                  }
                  className="h-[200px] w-full bg-red-300 relative rounded-xl overflow-hidden flex items-center justify-center mb-6"
                >
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <>
                      <img
                        src="\images.jpg"
                        alt=""
                        className="absolute top-0 left-0 w-full h-full"
                      />
                      <p className="absolute z-20 flex items-center justify-center h-full text-gray-700 cursor-default">
                        Click to upload an image
                      </p>
                    </>
                  )}

                  {selectedImage && (
                    <Button
                      variant="secondary"
                      className="absolute w-8 h-8 top-2 right-2 rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent clicking from triggering file input
                        fileInputRef.current?.click();
                      }}
                    >
                      <ChangeIcon />
                    </Button>
                  )}
                </div>
                <h1 className="px-0 font-semibold text-lg placeholder:text-gray-secondary2 text-gray-secondary1">
                  {createdPostData.title}
                </h1>
                <h3 className="px-0 text-sm placeholder:text-gray-secondary2 text-gray-secondary1">
                  {createdPostData.description}
                </h3>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: createdPostData.content }}
                />
              </div>
              <div className="flex-1">
                <h2 className="font-normal mb-2 text-gray-secondary1">
                  Published By:{" "}
                  <span className="font-semibold">Satyam Kumar</span>
                </h2>
                <div className="">
                  <MultiSelect
                    subheading="Select the categories for your post and let user find it conveniently."
                    onChange={(selected) => setSelectedTags(selected)}
                    placeholder="Select upto four tags..."
                    options={[
                      { value: "one", label: "1" },
                      { value: "two", label: "2" },
                      { value: "three", label: "3" },
                      { value: "4", label: "4" },
                      { value: "5", label: "5" },
                      { value: "6", label: "6" },
                      { value: "7", label: "7" },
                      { value: "8", label: "8" },
                      { value: "9", label: "9" },
                    ]}
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    className="mt-4 px-6 h-9 hover:bg-greenshade-primary/80 bg-greenshade-primary rounded-full text-xs"
                    onClick={() => handleSave("publish")}
                  >
                    Publish now
                  </Button>
                  <Button
                    className="mt-4 px-6 h-9 hover:bg-gray-200/80 bg-white text-black-primary rounded-full text-xs"
                    onClick={() => handleSave("publish")}
                  >
                    Schedule for later
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
