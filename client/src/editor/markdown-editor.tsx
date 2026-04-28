import MDEditor from "@uiw/react-md-editor";
import React from "react";

const MarkdownEditor = ({ value = "", onChange, placeholder }) => {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(value) => onChange(value || "")}
        height={500}
        preview="edit"
        textareaProps={{
          placeholder: placeholder || "Write markdown here...",
        }}
      />
    </div>
  );
};

export default MarkdownEditor;
