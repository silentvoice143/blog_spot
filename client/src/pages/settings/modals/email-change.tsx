import CustomInput from "@/components/ui-v2/CustomInput";
import Modal from "@/components/ui-v2/modal";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

function EmailChangeModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  return (
    <Modal header={"Email"} isOpen={isOpen} onClose={onClose}>
      {step === 1 && (
        <div>
          <CustomInput
            type="text"
            label={"Email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={() => setStep(2)}>Save</Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <CustomInput
            type="text"
            label={"Enter Otp"}
            value={email}
            subdescription="Enter the otp sent to you registered email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button>Verify</Button>
        </div>
      )}
    </Modal>
  );
}

export default EmailChangeModal;
