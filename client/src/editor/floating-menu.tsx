import React, { useEffect, useRef, useState } from "react";
import { FloatingMenu } from "@tiptap/react";
import { Image, PlusIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "sonner";

function FloatingMenuToolbar({ editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <FloatingMenu editor={editor} className="">
      <div className={`absolute flex gap-2 rounded-full -left-16 -top-5`}>
        <Toggle
          pressed={false}
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 border-[1px] rounded-full bg-white cursor-pointer"
        >
          <PlusIcon className="w-4 h-4 text-gray-secondary1" />
        </Toggle>
        <div
          ref={menuRef}
          className={`flex transition-all ${isOpen ? "w-fit" : "w-0"} gap-2 overflow-hidden`}
        >
          <Toggle
            onClick={() => {
              toast("Image uploading!", {
                description: "Please wait image is uploading",
                // action: {
                //   label: "Undo",
                //   onClick: () => console.log("Undo"),
                // },
              });
              editor.chain().focus().uploadImage().run();
              setIsOpen(false);
            }}
            pressed={false}
            className={`p-2 border-[1px] rounded-full bg-white cursor-pointer transition-all transform ${
              isOpen
                ? "scale-100 rotate-0 visible"
                : "scale-50 rotate-45 invisible"
            }`}
          >
            <Image className="w-4 h-4 text-gray-secondary1" />
          </Toggle>
        </div>
      </div>
    </FloatingMenu>
  );
}

export default FloatingMenuToolbar;
