import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CustomImageComponent from "./custom-image";

export default Image.extend({
  name: "customImage",
  selectable: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      alt: { default: "" },
      caption: { default: "" },
      align: { default: "left" },
    };
  },

  parseHTML() {
    return [{ tag: "figure" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      mergeAttributes(HTMLAttributes),
      ["img", { ...HTMLAttributes, contenteditable: "false" }],
      ["figcaption", {}, HTMLAttributes.caption],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomImageComponent);
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      "Mod-Alt-i": () => this.editor.commands.setImage({ src: "" }),
    };
  },
});
