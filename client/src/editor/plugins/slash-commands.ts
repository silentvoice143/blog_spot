import { Extension } from "@tiptap/core";
import Suggestion, { SuggestionProps } from "@tiptap/suggestion";
import { Editor } from "@tiptap/react";
import { Range } from "@tiptap/core";

interface CommandProps {
    editor: Editor;
    range: Range;
    props: {
        command: ({ editor, range }: { editor: Editor; range: Range }) => void;
    };
}

export const SlashCommands = Extension.create({
    name: "slashCommands",

    addOptions() {
        return {
            suggestion: {
                char: "/",
                command: ({ editor, range, props }: CommandProps) => {
                    props.command({ editor, range });
                },
                items: ({ query }: { query: string }) => {
                    return [
                        {
                            title: "Heading 1",
                            command: ({
                                editor,
                                range,
                            }: {
                                editor: Editor;
                                range: Range;
                            }) => {
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
                            command: ({
                                editor,
                                range,
                            }: {
                                editor: Editor;
                                range: Range;
                            }) => {
                                editor
                                    .chain()
                                    .focus()
                                    .deleteRange(range)
                                    .setNode("heading", { level: 2 })
                                    .run();
                            },
                        },
                        {
                            title: "Bullet List",
                            command: ({
                                editor,
                                range,
                            }: {
                                editor: Editor;
                                range: Range;
                            }) => {
                                editor
                                    .chain()
                                    .focus()
                                    .deleteRange(range)
                                    .toggleBulletList()
                                    .run();
                            },
                        },
                        // Add more commands as needed
                    ].filter((item) =>
                        item.title.toLowerCase().startsWith(query.toLowerCase())
                    );
                },
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});
