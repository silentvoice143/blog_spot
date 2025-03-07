import ChangeIcon from "@/components/icons/ChangeIcon";
import Modal from "@/components/ui-v2/modal";
import MultiSelect from "@/components/ui-v2/MultiSelect";
import { Button } from "@/components/ui/button";
import { DataContext } from "@/context/Dataprovider";
import { savePost, uploadFile } from "@/services/apiService";

import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

interface modalProps {
  type?: "draft" | "publish";
  isOpen: boolean;
  onClose?: () => void;
}
function CreatePostModal({ type = "publish", isOpen, onClose }: modalProps) {
  const { createdPostData, setCreatedPostData } = useContext(DataContext) || {};
  const navigate = useNavigate();

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
  const handleSave = async () => {
    if (type === "publish") {
      try {
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
          onClose();
          navigate("/");
        }
      } catch (err) {
        console.log(err);
      } finally {
      }
    } else {
      console.log("saving as draft");
    }
  };
  return (
    <Modal
      onSave={() => {}}
      onClose={onClose}
      isOpen={isOpen}
      header="Post detail"
    >
      <div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />

        <div
          onClick={() => !selectedImage && fileInputRef.current?.click()}
          className="h-[200px] w-full bg-red-300 relative rounded-xl overflow-hidden flex items-center justify-center"
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
        <div className="mt-4">
          <MultiSelect
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
        <Button className="mt-4 rounded-xl" onClick={() => handleSave()}>
          {type === "publish" ? "Publish" : "Save to draft"}
        </Button>
      </div>
    </Modal>
  );
}

export default CreatePostModal;
