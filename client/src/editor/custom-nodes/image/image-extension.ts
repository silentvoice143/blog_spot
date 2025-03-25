// import Image from "@tiptap/extension-image";
// import { mergeAttributes } from "@tiptap/core";
// import { ReactNodeViewRenderer } from "@tiptap/react";
// import CustomImageComponent from "./custom-image";

// export default Image.extend({
//   name: "customImage",
//   selectable: true,
//   addAttributes() {
//     return {
//       ...this.parent?.(),
//       alt: { default: "" },
//       caption: { default: "" },
//       align: { default: "left" },
//       maximize:{default:false}
//     };
//   },

//   parseHTML() {
//     return [{ tag: "figure" }];
//   },

//   renderHTML({ HTMLAttributes }) {
//     return [
//       "figure",
//       mergeAttributes(HTMLAttributes),
//       ["img", { ...HTMLAttributes, contenteditable: "false" }],
//       ["figcaption", {}, HTMLAttributes.caption],
//     ];
//   },

//   addNodeView() {
//     return ReactNodeViewRenderer(CustomImageComponent);
//   },

//   addKeyboardShortcuts() {
//     return {
//       ...this.parent?.(),
//       "Mod-Alt-i": () => this.editor.commands.setImage({ src: "" }),
//     };
//   },
// });

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
      align: { default: "center" },
      maximize: { default: false },
    };
  },

  parseHTML() {
    return [{ tag: "figure" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      mergeAttributes(HTMLAttributes, {
        class: `custom-image-wrapper`,
      }),

      // First div: Outer container
      [
        "div",
        { class: `custom-image-outer-container flex flex-col ${
         HTMLAttributes.align === "center"
            ? "items-center"
            : HTMLAttributes.align === "right"
              ? "items-end"
              : "items-start"
        }` },

        // Second div: Inner container (for image & caption)
        [
          "div",
          {
            class: `custom-image-inner-container ${
              HTMLAttributes.maximize ? "w-full" : "w-1/2"
            }`,
          },

          // Image element
          [
            "img",
            {
              ...HTMLAttributes,
              class: "custom-image",
              contenteditable: "false",
            },
          ],

          // Caption (if exists)
          [
            "figcaption",
            {
              class: "custom-image-caption text-start",
            },
            HTMLAttributes.caption || "",
          ],
        ],
      ],
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

