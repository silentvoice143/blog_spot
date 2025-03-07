import React, { useRef } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "../v2-ui/button";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import useUpload from "@/hooks/useUpload";

interface AttachMediaProps {
  editor: Editor;
}

function AttachMedia({ editor }: AttachMediaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload } = useUpload();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("Media uploading...");

    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = ""; // Reset input to allow selecting the same file again

    try {
      await upload(file, async (media) => {
        if (!media) return;

        // Get editor state
        const { state } = editor;
        const { selection, doc } = state;
        const range = { from: selection.from, to: selection.to }; // Get selected text range

        // Start editing chain
        const chain = editor.chain().focus();

        // If there's a selection (text is highlighted), delete it
        if (range.from !== range.to) {
          chain.deleteRange(range);
        }

        // Insert image at the selection position (or cursor if no selection)
        chain
          .insertContent({
            type: "customImage",
            attrs: {
              src: media.url,
              alt: "Inserted Image",
              caption: "",
              align: "center",
            },
          })
          .run();

        const pos = editor.state.selection.$anchor.pos;
        const contentAfterCursor = doc.textBetween(
          range.from,
          Math.min(doc.nodeSize - 2, range.from + 50),
          "\n",
          "\n"
        );

        if (contentAfterCursor.length === 0) {
          editor
            .chain()
            .focus()
            .setTextSelection(pos + 1)
            .run();

          editor.commands.insertContent("<p></p>");
        }
      });
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  return (
    <div className="flex justify-end mb-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <Button
        variant={"outline"}
        className="h-10 !px-3 !rounded-12"
        onClick={() => fileInputRef.current?.click()}
      >
        <PaperClipIcon className="h-4 w-4 !mr-2" strokeWidth={2} />
        Attach media
      </Button>
    </div>
  );
}

export default AttachMedia;
