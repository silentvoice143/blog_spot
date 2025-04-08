import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";
import EmailChangeModal from "./modals/email-change";
import EditProfileModal from "./modals/edit-profile-modal";
import { userInfo } from "os";
import { useLoader } from "@/context/LoaderProvider";
import { updateUserData } from "@/services/apiService";

interface Tab1Props {
  user: any;
  setUserData: any;
}
function Tab1({ user, setUserData }: Tab1Props) {
  const [toggleEmailModal, setToggleEmailModal] = useState(false);
  const [toggleProfileModal, setToggleProfileModal] = useState(false);
  const { setLoading } = useLoader();

  const updateUserDetails = async (data) => {
    try {
      setLoading(true);
      const response = await updateUserData(user._id, data);
      console.log(response);
      if (response.status === 200) {
        setToggleProfileModal(false);
        setUserData((prev) => {
          return { ...prev, ...response.data.data };
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <EmailChangeModal
        isOpen={toggleEmailModal}
        onClose={() => setToggleEmailModal(false)}
      />
      <EditProfileModal
        isOpen={toggleProfileModal}
        onClose={() => setToggleProfileModal(false)}
        data={user}
        onSave={updateUserDetails}
      />
      <div
        className="cursor-pointer group flex justify-between"
        onClick={() => setToggleEmailModal(true)}
      >
        <p>Email</p>
        <p className="text-base text-gray-secondary1 group-hover:text-black">
          {user?.email}
        </p>
      </div>
      <div
        className="flex justify-between cursor-pointer group"
        onClick={() => setToggleProfileModal(true)}
      >
        <div className="flex flex-col">
          <p>Profile Information</p>
          <p className="text-xs">Edit your photo, name, bio</p>
        </div>
        <div className="flex gap-4 items-center">
          <p className="text-base text-gray-secondary1 group-hover:text-black">
            {user?.name}
          </p>
          <Avatar className="h-10 w-10 rounded-full overflow-hidden">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>SK</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default Tab1;
