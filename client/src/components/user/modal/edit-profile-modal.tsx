import CustomInput from "@/components/ui-v2/CustomInput";
import CustomTextArea from "@/components/ui-v2/CustomTextArea";
import DynamicModal from "@/components/ui-v2/modal";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Link as LinkIcon, Plus, User } from "lucide-react";
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
    if (linkData.title.trim() && linkData.url.trim()) {
      setLinks([...links, linkData]);
      setLinkData({ title: "", url: "" });
    }
  };

  const deleteLink = (link) => {
    const updatedLinks = links.filter(
      (l) => l.title !== link.title || l.url !== link.url
    );
    setLinks(updatedLinks);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && linkData.title.trim() && linkData.url.trim()) {
      e.preventDefault();
      addLink();
    }
  };

  useEffect(() => {
    setName(data?.name);
    setBio(data?.bio);
    setLinks(data?.links);
  }, [data]);

  const handleSave = () => {
    onSave({ name, bio, links });
  };

  return (
    <DynamicModal
      header={{
        title: (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
              <User size={18} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 font-montserrat">
                Profile
              </h2>
              <p className="text-sm text-neutral-600">Profile details</p>
            </div>
          </div>
        ),
      }}
      footer={
        <div className="flex w-full gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button onClick={onClose} className="flex-1 h-10" variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Changes
          </Button>
        </div>
      }
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col gap-6 flex-1 overflow-auto">
        {/* Profile Information Section */}
        <div className="space-y-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-900">
              Display Name
            </label>
            <CustomInput
              type="text"
              className="w-full"
              value={name}
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              autoFocus
              bordered
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-900">Bio</label>
            <CustomTextArea
              className="border border-neutral-300 rounded-lg w-full"
              minRows={3}
              minChars={0}
              maxChars={1000}
              value={bio}
              placeholder="Tell us about yourself..."
              onChange={(e) => setBio(e.target.value)}
              showCharCount={false}
            />
            <p className="text-xs text-gray-500 mt-1">
              {bio?.length || 0}/200 characters
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Links Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold text-base text-gray-900">
              Social Links
            </h3>
          </div>

          {/* Add Link Form */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">
                  Link Title
                </label>
                <CustomInput
                  type="text"
                  placeholder="e.g., Portfolio, LinkedIn"
                  value={linkData.title}
                  onChange={(e) =>
                    setLinkData({ ...linkData, title: e.target.value })
                  }
                  onKeyPress={handleKeyPress}
                  bordered
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">URL</label>
                <CustomInput
                  type="text"
                  placeholder="https://example.com"
                  value={linkData.url}
                  onChange={(e) =>
                    setLinkData({ ...linkData, url: e.target.value })
                  }
                  onKeyPress={handleKeyPress}
                  bordered
                />
              </div>
            </div>
            <Button
              className="w-full md:w-auto px-4 h-9 bg-gray-900 hover:bg-gray-800"
              onClick={addLink}
              disabled={!linkData.title.trim() || !linkData.url.trim()}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Link
            </Button>
          </div>

          {/* Links Display */}
          {links?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Added Links ({links.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {links.map((link, idx) => (
                  <Badge
                    key={`${link.title}-${link.url}-${idx}`}
                    variant="outline"
                    className="px-3 py-2 flex items-center gap-2 text-sm hover:bg-gray-50 transition-colors border-gray-300"
                  >
                    <LinkIcon className="w-3 h-3 text-gray-500" />
                    <span className="font-medium text-gray-700">
                      {link.title}
                    </span>
                    <button
                      onClick={() => deleteLink(link)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${link.title}`}
                    >
                      <X className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {links?.length === 0 && (
            <div className="text-center py-6 text-sm text-gray-500">
              No links added yet. Add your social profiles or portfolio links
              above.
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
    </DynamicModal>
  );
}

export default EditProfileModal;
