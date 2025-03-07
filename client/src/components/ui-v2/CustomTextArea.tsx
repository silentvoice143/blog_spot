import React, { useRef, useEffect } from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  minRows?: number;
  maxRows?: number;
  expandable?: boolean;
}

const CustomTextArea: React.FC<TextAreaProps> = ({
  className = "",
  minRows = 1,
  maxRows,
  expandable = false,
  ...props
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (expandable && textAreaRef.current) {
      const textarea = textAreaRef.current;
      textarea.style.height = "auto"; // Reset height to recalculate
      textarea.style.height = `${textarea.scrollHeight}px`;

      if (maxRows) {
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
        const maxHeight = maxRows * lineHeight;
        if (textarea.scrollHeight > maxHeight) {
          textarea.style.height = `${maxHeight}px`;
          textarea.style.overflowY = "auto";
        } else {
          textarea.style.overflowY = "hidden";
        }
      }
    }
  }, [props.value]);

  return (
    <textarea
      {...props}
      ref={textAreaRef}
      className={`w-full p-3 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none resize-none ${className}`}
      rows={minRows}
      onInput={(e) => {
        if (expandable && textAreaRef.current) {
          textAreaRef.current.style.height = "auto";
          textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
        props.onInput?.(e);
      }}
    />
  );
};

export default CustomTextArea;
