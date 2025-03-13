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

const CreatePost = ({ setAuthentication }) => {
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
          imgRes = await uploadFile(formData);
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
          console.log(response.data);
          setCreatedPostData(null);
          navigate(`/post/${response.data._id}`, { replace: true });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("saving as draft");
      try {
        setLoading(true);
        const dataObj = {
          title: createdPostData.title,
          description: createdPostData.description,
          content: createdPostData.content,
          status: type,
        };
        console.log("Saving as publish", dataObj);
        const response = await savePost(dataObj);
        if (response.status === 201) {
          console.log(response.data);
          setCreatedPostData(null);
          navigate(`/post/${response.data._id}`, { replace: true });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (key: string, value: string) => {
    setCreatedPostData?.({ ...createdPostData, [key]: value });
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      {step === 1 ? (
        <>
          <NavbarV2
            handleDraft={() => handleSave("draft")}
            setAuthentication={setAuthentication}
            setSteps={(s: number) => setStep(s)}
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
                    value={createdPostData?.content || ""}
                    onChange={(value) => handleChange("content", value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
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
                onClick={() => !selectedImage && fileInputRef.current?.click()}
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
  );
};

export default CreatePost;
