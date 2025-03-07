import CustomDropdown from "@/components/ui-v2/CustomDropDown";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { ListBulletIcon, StrikethroughIcon } from "@heroicons/react/24/outline";
import { BubbleMenu } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  BoldIcon,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  ListOrderedIcon,
  RemoveFormattingIcon,
  Subscript,
  Superscript,
  Underline,
} from "lucide-react";
import { useState } from "react";

function ToolMenu({ editor }) {
  const [textTypeValue, setTextTypeValue] = useState<string>("Regular Text");
  const isImageSelected = editor.isActive("customImage");
  const options1 = [
    {
      label: "Regular Text",
      cmd: "regular",
    },
    {
      label: "Heading 1",
      cmd: "heading1",
    },
    {
      label: "Heading 2",
      cmd: "heading2",
    },
    {
      label: "Heading 3",
      cmd: "heading3",
    },
  ];

  const handleTextModify = (cmd) => {
    if (cmd === "regular") {
      editor.chain().focus().setParagraph().run();
      setTextTypeValue("Regular Text");
    }
    if (cmd === "heading1") {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
      setTextTypeValue("Heading 1");
    }
    if (cmd === "heading2") {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
      setTextTypeValue("Heading 2");
    }
    if (cmd === "heading3") {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
      setTextTypeValue("Heading 3");
    }
  };

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: "top",
      }}
    >
      <div
        className={`${isImageSelected ? "hidden" : "flex"} items-center gap-1 px-2 py-1 bg-white border shadow-lg rounded-xl `}
      >
        <div className="flex flex-col gap-2">
          <CustomDropdown
            value={textTypeValue}
            options={options1}
            onClick={handleTextModify}
          />
          <div className="flex gap-1">
            <Toggle
              className="!w-8 !h-8 p-0 min-w-[8]"
              pressed={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <ListBulletIcon />
            </Toggle>
            <Toggle
              className="!w-8 !h-8 p-0 min-w-[8]"
              pressed={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrderedIcon />
            </Toggle>
            <Toggle
              pressed={editor.isActive("strike")}
              className="relative !w-8 !h-8 p-0 min-w-[8]"
              onClick={() => editor.chain().focus().toggleMark("strike").run()}
            >
              <StrikethroughIcon className="w-4 h-4" />
            </Toggle>
            <Toggle
              pressed={editor.isActive("subscript")}
              className="relative !w-8 !h-8 p-0 min-w-[8]"
              onClick={() => editor.chain().focus().toggleSubscript().run()}
            >
              <Subscript className="w-4 h-4" />
            </Toggle>
            <Toggle
              pressed={editor.isActive("superscript")}
              className="relative !w-8 !h-8 p-0 min-w-[8]"
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
            >
              <Superscript className="w-4 h-4" />
            </Toggle>
          </div>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
            <Toggle
              className="!w-8 !h-8 p-0 min-w-[8]"
              pressed={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <BoldIcon />
            </Toggle>
            <Toggle
              className="!w-8 !h-8 p-0 min-w-[8]"
              pressed={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic />
            </Toggle>
            <Toggle
              className="!w-8 !h-8 p-0 min-w-[8]"
              pressed={editor.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <Underline />
            </Toggle>
          </div>
          <div className="flex gap-1">
            <Toggle
              className="!w-8 !h-8 p-0 min-w-[8]"
              pressed={editor.isActive({ textAlign: "left" })}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
              <AlignLeft />
            </Toggle>
            <Toggle
              className="!w-8 !h-8 p-0 min-w-[8]"
              pressed={editor.isActive({ textAlign: "center" })}
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
            >
              <AlignCenter />
            </Toggle>
            <Toggle
              className="!w-8 !h-8 p-0 min-w-[8]"
              pressed={editor.isActive({ textAlign: "right" })}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              <AlignRight />
            </Toggle>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Toggle
            pressed={false}
            className="!w-8 !h-8 p-0 min-w-[8]"
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
          >
            <RemoveFormattingIcon />
          </Toggle>
          <Toggle
            pressed={false}
            className="!w-8 !h-8 p-0 min-w-[8]"
            onClick={() => editor.chain().focus().uploadImage().run()}
          >
            <ImageIcon />
          </Toggle>
        </div>
      </div>
    </BubbleMenu>
  );
}

export default ToolMenu;
