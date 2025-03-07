import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { TrashIcon } from "@heroicons/react/24/outline";
import { NodeViewWrapper } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  FullscreenIcon,
  MinimizeIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CustomImageComponent = (props: any) => {
  const { node, updateAttributes, selected, editor, deleteNode } = props;
  const { src, caption, align } = node.attrs;
  const [isEditing, setIsEditing] = useState(false);
  const [alignment, setAlignment] = useState("center");
  const [fullImage, setFullImage] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Detect if the image is selected independently or as part of a selection
  useEffect(() => {
    if (selected) {
      const { $from, $to } = editor.state.selection;
      const imageNodeSelected =
        $from.nodeAfter && $from.nodeAfter.type.name === "customImage";
      const textNodeSelected =
        $to.nodeAfter && $to.nodeAfter.type.name !== "customImage";

      // Only focus the caption input if this is the only node selected (image node)
      if (imageNodeSelected && !textNodeSelected) {
        if (inputRef.current) {
          inputRef.current?.focus();
        }
      }
    }
  }, [selected, editor.selection]);

  const handleDelete = () => {
    deleteNode();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      const pos = editor.state.selection.$anchor.pos;

      const nextLinePosition = pos + 1;

      editor.chain().focus().setTextSelection(nextLinePosition).run();
      e.preventDefault();
    }

    // Handle Enter key to insert the content
    if (e.key === "Enter") {
      e.preventDefault();
      setIsEditing(false);
      const pos = editor.state.selection.$anchor.pos;

      editor
        .chain()
        .focus()
        .setTextSelection(pos + 1)
        .run();
      editor.commands.insertContent("<p></p>");
    }
  };

  return (
    <NodeViewWrapper className={`relative text-${align}`}>
      {/* IMAGE */}

      <div
        className={`flex flex-col editor-image ${
          alignment === "center"
            ? "items-center"
            : alignment === "right"
              ? "items-start"
              : "items-end"
        }`}
      >
        {selected && (
          <div
            className="flex items-center h-10 gap-2 px-4 bg-white border shadow-lg rounded-xl w-fit -top-14"
            style={{
              position: "absolute",
              zIndex: 50,
            }}
          >
            <Toggle
              className="h-6 w-6 min-w-0 p-0 cursor-pointer !rounded-6"
              pressed={alignment === "right"}
              onPressedChange={() => {
                setAlignment("right");
              }}
            >
              <AlignLeft />
            </Toggle>

            <Toggle
              className="h-6 w-6 min-w-0 p-0 cursor-pointer !rounded-6"
              pressed={alignment === "center"}
              onPressedChange={() => {
                setAlignment("center");
              }}
            >
              <AlignCenter />
            </Toggle>

            <Toggle
              className="h-6 w-6 min-w-0 p-0 cursor-pointer !rounded-6"
              pressed={alignment === "left"}
              onPressedChange={() => {
                setAlignment("left");
              }}
            >
              <AlignRight />
            </Toggle>

            <Separator orientation="vertical" className="h-6 mx-1" />
            <Toggle
              className="h-6 w-6 min-w-0 p-0 cursor-pointer !rounded-6"
              pressed={alignment === "left"}
              onPressedChange={() => {
                setAlignment("center");
                setFullImage(!fullImage);
              }}
            >
              {fullImage ? <MinimizeIcon /> : <FullscreenIcon />}
            </Toggle>

            <Separator orientation="vertical" className="h-6 mx-1" />
            <Toggle
              className="h-6 w-6 min-w-0 p-0 cursor-pointer !rounded-6"
              size="sm"
              onPressedChange={() => {
                console.log("deleting node..");
                handleDelete();
              }}
            >
              <TrashIcon className="w-4 h-4" />
            </Toggle>
          </div>
        )}
        <img
          className={`${fullImage ? "w-full" : "w-1/2"} ${selected ? "selected-image" : ""} m-0`}
          src={src}
          alt={caption}
          // onClick={() => setIsEditing(true)}
          onKeyDown={handleKeyDown}
        />

        {/* CAPTION INPUT (ONLY WHEN SELECTED) */}
        {selected ? (
          <input
            ref={inputRef}
            type="text"
            value={caption}
            className={`${fullImage ? "w-full" : "w-1/2"} px-0 py-1 border-none rounded-md outline-none text-16-24 font-400 placeholder:text-neutral-text-disabled text-neutral-text-tertiary`}
            placeholder="Add caption..."
            onChange={(e) => updateAttributes({ caption: e.target.value })}
            onBlur={() => setIsEditing(false)}
            onKeyDown={handleKeyDown}
          />
        ) : (
          caption && (
            <figcaption
              className={`${fullImage ? "w-full" : "w-1/2"} mt-1 text-16-24 font-400 text-neutral-text-tertiary text-center`}
            >
              {caption}
            </figcaption>
          )
        )}
      </div>
    </NodeViewWrapper>
  );
};

export default CustomImageComponent;
