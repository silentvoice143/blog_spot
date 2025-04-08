import CustomInput from "@/components/ui-v2/CustomInput";
import CustomTextArea from "@/components/ui-v2/CustomTextArea";
import Modal from "@/components/ui-v2/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  onSave: ({
    name,
    bio,
    links,
  }: {
    name: String;
    bio: String;
    links: [{ title: String; url: String }];
  }) => void;
}

function EditProfileModal({ isOpen, onClose, data, onSave }: EditModalProps) {
  const [name, setName] = useState(data?.name);
  const [bio, setBio] = useState(data?.bio);
  const [links, setLinks] = useState(data?.links);

  const [linkData, setLinkData] = useState({ title: "", url: "" });

  const addLink = () => {
    setLinks([...links, linkData]);
    setLinkData({ title: "", url: "" });
  };

  const deleteLink = (link) => {
    console.log("deleting link---", link);

    const updatedLinks = links.filter(
      (l) => l.title !== link.title || l.url !== link.url
    );

    setLinks(updatedLinks);
  };

  useEffect(() => {
    setName(data?.name);
    setBio(data?.bio);
    setLinks(data?.links);
  }, [data]);

  return (
    <Modal header="Edit Profile" isOpen={isOpen} onClose={onClose}>
      <div className="flex-1 overflow-auto">
        <CustomInput
          type="text"
          label="Name"
          className="border border-gray-tertiary1 rounded-lg"
          value={name}
          placeholder="Enter name"
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <CustomTextArea
          className={"border border-gray-tertiary1 rounded-lg"}
          label="Bio"
          minRows={2}
          minChars={0}
          maxChars={200}
          value={bio}
          placeholder={"Write a short bio"}
          onChange={(e) => setBio(e.target.value)}
        />
        <div className="flex flex-col gap-4">
          <h3 className="font-medium text-base font-montserrat">Add Links</h3>
          <div className="flex gap-4">
            <CustomInput
              type="text"
              label="Title"
              placeholder="Enter title"
              className="border border-gray-tertiary1 rounded-lg"
              value={linkData.title}
              onChange={(e) =>
                setLinkData({ ...linkData, title: e.target.value })
              }
            />
            <CustomInput
              type="text"
              label="URLs"
              placeholder="Enter url"
              className="border border-gray-tertiary1 rounded-lg"
              value={linkData.url}
              onChange={(e) =>
                setLinkData({ ...linkData, url: e.target.value })
              }
            />
          </div>
          <Button className="px-6 flex-0 w-fit h-8" onClick={() => addLink()}>
            Add
          </Button>
          <div className="flex flex-wrap gap-2">
            {links?.length > 0 &&
              links?.map((link, idx) => (
                <Button
                  key={`${link} ${data?.id} ${idx}`}
                  variant="ghost"
                  className="p-0 h-fit hover:bg-transparent"
                  onClick={() => deleteLink(link)}
                >
                  <Badge variant="outline" className="px-2 py-1 flex gap-2">
                    <p className="text-xs font-montserrat">{link.title}</p>

                    <X className="w-4 h-4" />
                  </Badge>
                </Button>
              ))}
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <Button
          onClick={() => onSave({ name, bio, links })}
          className="bg-blue-500 hover:bg-blue-500/80 flex-1"
        >
          Save
        </Button>
        <Button onClick={onClose} className="flex-1" variant="outline">
          Cancel
        </Button>
      </div>
    </Modal>
  );
}

export default EditProfileModal;
