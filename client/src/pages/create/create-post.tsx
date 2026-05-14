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
import { Eye, X } from "lucide-react";
import { useStore } from "@/store";
import { uploadSingleFile } from "@/services/upload-service";
import { draftPost, publishPost, schedulePost } from "@/services/post-service";
import { toast } from "sonner";
import { DateTimePicker } from "@/components/shared/date-time-picker";

const CreatePost = () => {
  const { post, setPost, step, setStep, isSaving, setIsSaving, isPublishing, setIsPublishing, isScheduling, setIsScheduling } = useStore((state) => state);
  const lastSavedRef = useRef("");

  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedFile(file);
    }
  };

  const handleChange = (key: string, value: string) => {
    setPost({
      ...post,
      [key]: value,
    });
  };

  const handlePreview = () => {

    // open preview page
    window.open("/post/preview", "_blank");
  };



  const handlePublish = async (type: "publish" | "schedule") => {

    try {
      setIsPublishing(true);
      let pictureUrl = "";

      // upload thumbnail if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadResponse = await uploadSingleFile(formData);

        pictureUrl =
          uploadResponse?.data?.url ||
          uploadResponse?.data?.fileUrl ||
          "";
      }

      const response = await (type === "publish" ? publishPost : schedulePost)({ postId: post?.postId, tags: ["hello"], picture: pictureUrl, scheduledAt: date });
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setPost({});
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsPublishing(false);
    }
  }


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

  useEffect(() => {
    const interval = setInterval(async () => {
      if (step !== 1) {
        setIsSaving(false);
        return
      };
      if (isSaving) return;

      try {
        const hasContent =
          post?.title?.trim() ||
          post?.description?.trim() ||
          post?.content?.trim();

        if (hasContent) {

          const currentPost = JSON.stringify({
            title: post?.title || "",
            description: post?.description || "",
            content: post?.content || "",
          });

          if (lastSavedRef.current === currentPost) {
            return;
          }

          setIsSaving(true)

          localStorage.setItem(
            "preview_post",
            JSON.stringify(post)
          );
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'preview_post',
            newValue: JSON.stringify(post)
          }));



          const payload = {
            ...post,
            status: "draft",
          }

          const response = await draftPost(payload);

          console.log(response?.data.post?._id, payload, response?.data?.post, "-----response of post auto save")

          // save returned postId
          if (response?.data.post?._id) {
            setPost({
              ...post,
              postId: response.data.post._id,
            });
          }

          lastSavedRef.current = currentPost;
        }
      } catch (err) {

      } finally {
        setIsSaving(false)
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [post, step]);


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
          <div className="flex flex-col flex-1  justify-center p-8">
            <div className="max-w-[800px] mx-auto">
              <div className="text-right mb-4"><Button variant="ghost" className="rounded-full !h-10 !w-10" onClick={() => setStep(1)}><X /></Button></div>
              <div className=" flex flex-col gap-6">
                <div className="flex-1 flex gap-6 md:gap-10">
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
                    <div className="flex gap-4 mt-8">
                      <Button
                        className="px-6 h-9 rounded-full text-xs "
                        onClick={() => handlePublish("publish")}
                      >
                        Publish now
                      </Button>
                      <DateTimePicker onSubmit={() => {
                        console.log("submit clicked");
                        handlePublish("schedule")
                      }} onCancel={() => setDate(undefined)} value={date} onChange={(date) => setDate(date)}>
                        <Button
                          className="px-6 h-9 hover:bg-gray-200/80 bg-white text-black-primary rounded-full text-xs"
                        >
                          Schedule for later
                        </Button>
                      </DateTimePicker>
                    </div>
                  </div>

                </div>
                <div className="space-y-4">
                  <h1 className="px-0 placeholder:text-gray-secondary2 text-gray-secondary1">
                    {post.title}
                  </h1>
                  <h4 className="px-0  placeholder:text-gray-secondary2 text-gray-secondary1">
                    {post.description}
                  </h4>
                  <div
                    className="prose mt-4"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
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
