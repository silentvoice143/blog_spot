import { Response } from "express";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import { Slice } from "@tiptap/pm/model";
import { toast } from "sonner";
import { Editor } from "@tiptap/core";
import { uploadFile } from "@/services/apiService";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageUpload: {
      uploadImage: () => ReturnType;
    };
  }
}

export const ImageUploadPlugin = Extension.create({
  name: "imageUpload",

  addCommands() {
    return {
      uploadImage:
        () =>
        ({ editor }: { editor: Editor }) => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return false;

            try {
              // const fileUrl = URL.createObjectURL(file);
              const formData = new FormData();
              formData.append("file", file);
              const response = await uploadFile(formData);
              if (response.status !== 200) {
                console.log("Uplaod failed");
                return;
              }
              const { state } = editor;
              const { selection, doc } = state;
              const range = {
                from: selection.from,
                to: selection.to,
              };
              editor.chain().deleteRange(range).focus().run();

              const chain = editor.chain().focus();
              chain
                .insertContent({
                  type: "customImage",
                  attrs: {
                    src: response.data.fileUrl,
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
              return true;
            } catch (error) {
              console.error("Failed to upload image:", error);
              return false;
            }
          };
          input.click();
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("imageUpload"),
        props: {
          handleDrop(
            view: EditorView,
            event: DragEvent,
            _slice: Slice,
            _moved: boolean
          ) {
            const hasFiles = event.dataTransfer?.files?.length;
            if (!hasFiles) return false;

            const images = Array.from(event.dataTransfer.files).filter((file) =>
              file.type.startsWith("image/")
            );

            if (images.length === 0) return false;

            event.preventDefault();

            const { schema } = view.state;
            const coordinates = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });

            images.forEach(async (image) => {
              try {
                const response = await uploadFile(image);
                const node = schema.nodes.image.create({
                  src: response.imgURL,
                });
                const transaction = view.state.tr.insert(
                  coordinates?.pos || 0,
                  node
                );
                view.dispatch(transaction);
              } catch (error) {
                console.error("Failed to upload image:", error);
              }
            });

            return true;
          },
          handlePaste(view: EditorView, event: ClipboardEvent, _slice: Slice) {
            const items = Array.from(event.clipboardData?.items || []);
            const images = items.filter((item) =>
              item.type.startsWith("image/")
            );

            if (images.length === 0) return false;

            event.preventDefault();

            const { schema } = view.state;
            const pos = view.state.selection.from;

            images.forEach(async (item) => {
              const file = item.getAsFile();
              if (!file) return;

              try {
                const response = await uploadFile(file);
                const node = schema.nodes.image.create({
                  src: response.imgURL,
                });
                const transaction = view.state.tr.insert(pos, node);
                view.dispatch(transaction);
              } catch (error) {
                console.error("Failed to upload image:", error);
              }
            });

            return true;
          },
        },
      }),
    ];
  },
});
