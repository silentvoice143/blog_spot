import CustomInput from "@/components/ui-v2/CustomInput";
import Modal from "@/components/ui-v2/modal";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosedIcon } from "lucide-react";
import React, { useState } from "react";

function PasswordChangeModal({ isOpen, onClose }) {
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [toggleEye, setToggleEye] = useState(false);
  const [otp, setOtp] = useState("");
  return (
    <Modal header={"Change password"} isOpen={isOpen} onClose={onClose}>
      {step === 1 && (
        <div>
          <div className="flex gap-2 w-full items-center">
            <CustomInput
              type={toggleEye ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="ghost"
              className="self-end mb-4"
              onClick={() => setToggleEye(!toggleEye)}
            >
              {toggleEye ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeClosedIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button onClick={() => setStep(2)}>Save</Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <CustomInput
            type="text"
            label={"Enter Otp"}
            placeholder="Enter Otp"
            value={otp}
            subdescription="Enter the otp sent to you registered email"
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button>Verify</Button>
        </div>
      )}
    </Modal>
  );
}

export default PasswordChangeModal;
