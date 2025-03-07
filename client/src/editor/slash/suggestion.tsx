import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { CommandList, CommandListRef } from "./command-list";

type Editor = any;
type Range = any;

export const suggestion = {
  items: ({ query, editor }: { query: string; editor: Editor }) => {
    return [
      {
        title: "Heading 1",
        icon: "H1",
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 1 })
            .run();
        },
      },
      {
        title: "Heading 2",
        icon: "H2",
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 2 })
            .run();
        },
      },
      {
        title: "Bold",
        icon: "B",
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleBold().run();
        },
      },
      {
        title: "Italic",
        icon: "I",
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleItalic().run();
        },
      },
      {
        title: "Bullet List",
        icon: "•",
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: "Numbered List",
        icon: "1.",
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        title: "Quote",
        icon: '"',
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleBlockquote().run();
        },
      },
      {
        title: "Align Left",
        icon: "←",
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).setTextAlign("left").run();
        },
      },
      {
        title: "Align Center",
        icon: "↔",
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setTextAlign("center")
            .run();
        },
      },
      {
        title: "Align Right",
        icon: "→",
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).setTextAlign("right").run();
        },
      },
      {
        title: "Upload Image",
        icon: "📷",
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).uploadImage().run();
        },
      },
    ].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  },

  render: () => {
    let component: ReactRenderer<CommandListRef>;
    let popup: any;

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(CommandList, {
          props,
          editor: props.editor,
        });

        // Create single tippy instance instead of array
        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        })[0]; // Get the first instance
      },

      onUpdate(props: any) {
        component.updateProps(props);

        if (popup) {
          popup.setProps({
            getReferenceClientRect: props.clientRect,
          });
        }
      },

      onKeyDown(props: { event: KeyboardEvent }) {
        if (props.event.key === "Escape") {
          popup?.hide();
          return true;
        }

        return component.ref?.onKeyDown?.(props) || false;
      },

      onExit() {
        // Safely destroy tippy and component
        if (popup) {
          popup.destroy();
        }
        if (component) {
          component.destroy();
        }
      },
    };
  },
};
