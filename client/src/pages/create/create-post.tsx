import { useCallback, useContext, useEffect, useRef, useState } from "react";
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
import { CustomSelect } from "@/components/shared/custom-select";
import { CATEGORIES } from "@/constant/category";

const CreatePost = () => {
  const {
    post, setPost, step, setStep, isSaving,
    setIsSaving, isPublishing, setIsPublishing, setIsScheduling, isScheduling, setSubmitRef
  } = useStore((state) => state);
  const lastSavedRef = useRef("");
  const debouncedSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);

  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [categoryOptions, setCategoryOptions] = useState(CATEGORIES.options)
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

      const response = await (type === "publish" ? publishPost : schedulePost)({ postId: post?.postId, tags: selectedTags.map((tag: string) => tag.toLowerCase()), picture: pictureUrl, scheduledAt: date });
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




  // Core save logic — extracted so both autosave and submit can call it
  const savePost = useCallback(async (postData: typeof post, forceSave = false) => {
    const hasContent =
      postData?.title?.trim() ||
      postData?.description?.trim() ||
      postData?.content?.trim();

    if (!hasContent) return;

    const currentPost = JSON.stringify({
      title: postData?.title || "",
      description: postData?.description || "",
      content: postData?.content || "",
    });

    // Skip if nothing changed (unless forced by submit)
    if (!forceSave && lastSavedRef.current === currentPost) return;
    if (isSavingRef.current) return;

    try {
      isSavingRef.current = true;
      setIsSaving(true);

      localStorage.setItem("preview_post", JSON.stringify(postData));
      window.dispatchEvent(new StorageEvent("storage", {
        key: "preview_post",
        newValue: JSON.stringify(postData),
      }));

      const payload = { ...postData, status: "draft" };
      const response = await draftPost(payload);

      if (response?.data.post?._id) {
        setPost({ ...postData, postId: response.data.post._id });
      }

      lastSavedRef.current = currentPost;
    } catch (err) {
      // handle error
    } finally {
      isSavingRef.current = false;
      setTimeout(() => setIsSaving(false), 1000);
    }
  }, []);

  // Debounced autosave — runs 2s after last change, only on step 1
  useEffect(() => {
    if (step !== 1) return;

    // Cancel any pending debounce
    if (debouncedSaveRef.current) clearTimeout(debouncedSaveRef.current);

    debouncedSaveRef.current = setTimeout(() => {
      savePost(post);
    }, 2000);

    return () => {
      if (debouncedSaveRef.current) clearTimeout(debouncedSaveRef.current);
    };
  }, [post, step, savePost]);

  const submitRef = useRef<(() => Promise<void>) | null>(null);


  const handleSubmit = useCallback(async () => {
    if (debouncedSaveRef.current) {
      clearTimeout(debouncedSaveRef.current);
      debouncedSaveRef.current = null;
    }
    await savePost(post, true);
    // ...rest of submit logic
  }, [post, savePost]);

  // Register it so Header can call it
  useEffect(() => {
    submitRef.current = handleSubmit;
    setSubmitRef(submitRef);
  }, [handleSubmit, setSubmitRef]);


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
                      <CustomSelect
                        multiSelect
                        selected={selectedTags}
                        onChange={(selected) => setSelectedTags(selected as any)}
                        placeholder="Select upto four tags..."
                        options={categoryOptions}
                        enableCreateOption
                        onCreateOption={(value) => {
                          setCategoryOptions((prev) => [...prev, { label: value, value }]);
                          setSelectedTags((prev) => [...prev, value])
                        }}
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
