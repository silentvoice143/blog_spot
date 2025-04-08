import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";

import AllDevices from "./modals/all-devices";
import PasswordChangeModal from "./modals/password-change";

function Tab2() {
  const [toggleDevicesModal, setToggleDevicesModal] = useState(false);
  const [togglePasswordModal, setTogglePasswordModal] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <AllDevices
        isOpen={toggleDevicesModal}
        onClose={() => setToggleDevicesModal(false)}
      />
      <PasswordChangeModal
        isOpen={togglePasswordModal}
        onClose={() => setTogglePasswordModal(false)}
      />
      <div
        className="cursor-pointer group"
        onClick={() => setToggleDevicesModal(true)}
      >
        <p>Devices</p>
        <p className="text-xs">Edit your photo, name, bio</p>
      </div>
      <div
        className="cursor-pointer group"
        onClick={() => setTogglePasswordModal(true)}
      >
        <p>Password</p>
        <p className="text-xs">Edit your photo, name, bio</p>
      </div>
    </div>
  );
}

export default Tab2;
