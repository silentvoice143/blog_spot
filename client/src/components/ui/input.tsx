import * as React from "react";
import { cn } from "@/utils/class";

interface InputProps extends React.ComponentProps<"input"> {
  bordered?: boolean;
}

function Input({ className, type, bordered = true, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        bordered
          ? [
              "border border-input",
              "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            ]
          : [
              "border-none",
              "outline-none",
              "ring-0",
              "focus:outline-none",
              "focus:ring-0",
              "focus:border-none",
              "focus:shadow-none",
              "active:border-none",
              "active:shadow-none",
              "hover:border-none",
            ],
        className
      )}
      {...props}
    />
  );
}

export { Input };
