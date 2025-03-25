import CustomTextArea from "@/components/ui-v2/CustomTextArea";
import { Input } from "@/components/ui/input";
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
  const { node, updateAttributes, selected, editor, deleteNode, getPos } =
    props;
  const { src, caption, align, maximize } = node.attrs;
  const [alignment, setAlignment] = useState(align);
  const [fullImage, setFullImage] = useState(maximize);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (selected) {
      editor.commands.focus(); // Ensure focus stays in editor
    }
  }, [selected]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const pos = editor.state.selection.$anchor.pos;

    if (e.key === "Enter") {
      e.preventDefault();
      editor.commands.insertContentAt(pos + 1, "<p></p>");
      editor.commands.setTextSelection(pos + 2); // Move cursor into the new paragraph
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextNodePos = pos + 1;
      editor.commands.setTextSelection(nextNodePos);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents losing focus
    editor.commands.focus();
    editor.commands.setNodeSelection(getPos()); // Re-selects the image node
  };

  return (
    <NodeViewWrapper className={`relative text-${alignment}`}>
      <div
        className={`flex flex-col editor-image ${
          alignment === "center"
            ? "items-center"
            : alignment === "right"
              ? "items-end"
              : "items-start"
        }`}
      >
        {/* Toolbar for Alignment and Deletion */}
        {selected && (
          <div className="flex items-center h-10 gap-2 px-4 bg-white border shadow-lg rounded-xl w-fit -top-14 absolute z-50">
            <Toggle
              className="h-6 w-6 min-w-0 p-0 cursor-pointer"
              pressed={alignment === "left"}
              disabled={maximize}
              onPressedChange={() => {
                setAlignment("left");
                updateAttributes({ align: "left" });
              }}
            >
              <AlignLeft />
            </Toggle>

            <Toggle
              className="h-6 w-6 min-w-0 p-0 cursor-pointer"
              pressed={alignment === "center"}
              disabled={maximize}
              onPressedChange={() => {
                setAlignment("center");
                updateAttributes({ align: "center" });
              }}
            >
              <AlignCenter />
            </Toggle>

            <Toggle
              className="h-6 w-6 min-w-0 p-0 cursor-pointer"
              pressed={alignment === "right"}
              disabled={maximize}
              onPressedChange={() => {
                setAlignment("right");
                updateAttributes({ align: "right" });
              }}
            >
              <AlignRight />
            </Toggle>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <Toggle
              className="h-6 w-6 min-w-0 p-0 cursor-pointer"
              pressed={fullImage}
              onPressedChange={() => {
                setFullImage(!fullImage);
                updateAttributes({ maximize: !fullImage });
                updateAttributes({ align: "center" });
                setAlignment("center");
              }}
            >
              {fullImage ? <MinimizeIcon /> : <FullscreenIcon />}
            </Toggle>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <Toggle
              className="h-6 w-6 min-w-0 p-0 cursor-pointer"
              size="sm"
              onPressedChange={deleteNode}
            >
              <TrashIcon className="w-4 h-4" />
            </Toggle>
          </div>
        )}

        {/* Image Display */}
        <div className={`${fullImage ? "w-full" : "w-1/2"} m-0 relative`}>
          <img
            className={`w-full ${selected ? "selected-image" : ""}`}
            src={src}
            alt={caption}
            tabIndex={-1} // Prevents text cursor from appearing
            onKeyDown={handleKeyDown}
            onClick={handleImageClick} // Prevents cursor in next line
          />
          {selected && (
            <CustomTextArea
              minRow={1}
              expandable={true}
              ref={inputRef}
              value={caption}
              className={`w-fullborder-none rounded-md outline-none text-start text-sm text-gray-600 ${selected ? "block" : "hidden"} px-0 py-1`}
              placeholder="Add caption..."
              onChange={(e) => updateAttributes({ caption: e.target.value })}
            />
          )}

          {caption && !selected && (
            <figcaption
              dangerouslySetInnerHTML={{
                __html: caption.replace(/\n/g, "<br />"), // Replace line breaks with <br />
              }}
              className="mt-1 text-sm text-gray-500 text-start"
            ></figcaption>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default CustomImageComponent;
