import CustomInput from "@/components/ui-v2/CustomInput";
import Modal from "@/components/ui-v2/modal";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosedIcon } from "lucide-react";
import React, { useState } from "react";

function PasswordChangeModal({ isOpen, onClose }) {
  const [old_password, setOldPassword] = useState("");
  const [new_password, setNewPassword] = useState("");

  const [toggleEye, setToggleEye] = useState(false);

  return (
    <Modal header={"Change password"} isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="flex gap-2 w-full items-center">
          <CustomInput
            label="Old password"
            type="text"
            value={old_password}
            onChange={(e) => setOldPassword(e.target.value)}
            className="flex-1"
            placeholder="*********"
          />
        </div>
        <div className="flex gap-2 w-full items-center overflow-hidden relative">
          <CustomInput
            label="New password"
            type={toggleEye ? "text" : "password"}
            value={new_password}
            onChange={(e) => setNewPassword(e.target.value)}
            className="flex-1"
            placeholder="**********"
          />
          <Button
            variant="ghost"
            className="self-end mb-4 absolute right-0 h-[38px] hover:bg-transparent"
            onClick={() => setToggleEye(!toggleEye)}
          >
            {toggleEye ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeClosedIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Button onClick={() => {}}>Save</Button>
      </div>
    </Modal>
  );
}

export default PasswordChangeModal;
