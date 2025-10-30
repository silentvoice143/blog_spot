import React, { useRef, useEffect, useState } from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  minRows?: number;
  maxRows?: number;
  expandable?: boolean;
  label?: string;
  minChars?: number; // Minimum character count
  maxChars?: number; // Maximum character count
  showCharCount?: boolean;
}

const CustomTextArea: React.FC<TextAreaProps> = ({
  className = "",
  minRows = 1,
  maxRows,
  expandable = false,
  label,
  minChars,
  maxChars,
  showCharCount = true,
  ...props
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [charCount, setCharCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

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

  const handleInputChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    if (expandable && textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }

    const text = e.currentTarget.value;
    const currentCharCount = text.length;
    setCharCount(currentCharCount);

    // Check if the character count is within the allowed range
    if (minChars && currentCharCount < minChars) {
      setError(`Minimum character count is ${minChars}.`);
    } else if (maxChars && currentCharCount > maxChars) {
      setError(`Maximum character count is ${maxChars}.`);
    } else {
      setError(null);
    }

    props.onInput?.(e);
  };

  return (
    <div className="px-1">
      {label && <p className="text-base font-montserrat">{label}</p>}
      <textarea
        {...props}
        ref={textAreaRef}
        className={`w-full p-3 bg-transparent text-gray-900 text-base font-montserrat placeholder-gray-500 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
        rows={minRows}
        onInput={handleInputChange}
      />
      {showCharCount && (
        <div className="text-sm font-light text-gray-500 -mt-2 flex justify-end">
          <p>
            {charCount}/{maxChars > 0 ? maxChars : "∞"} characters
          </p>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default CustomTextArea;
