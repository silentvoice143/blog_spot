import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ReactNode } from "react";

interface ModalProps {
  header: string;
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  onSave?: () => void;
}

function Modal({ header, children, isOpen, onClose, onSave }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-32-34 font-semibold font-montserrat">
            {header}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
