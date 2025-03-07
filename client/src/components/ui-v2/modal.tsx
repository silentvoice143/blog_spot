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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{header}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
