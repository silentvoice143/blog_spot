import * as React from "react";
import { Input } from "@/components/ui/input"; // from shadcn or your UI lib
import { cn } from "@/utils/class"; // utility to merge classNames

interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string; // wrapper class
  inputClassName?: string; // input-only class
  label?: string;
  labelClassName?: string;
  bordered?: boolean;
}

const CustomInput = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  (
    {
      iconLeft,
      iconRight,
      className,
      inputClassName,
      label,
      labelClassName,
      id,
      bordered,
      ...props
    },
    ref
  ) => {
    const inputId =
      id || props.name || `input-${Math.random().toString(36).slice(2, 8)}`;

    return (
      <div className={cn("w-full space-y-1 px-1", className)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn("text-sm font-medium text-gray-700", labelClassName)}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {iconLeft && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
              {iconLeft}
            </div>
          )}

          <Input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full px-3 py-2 text-sm border rounded-md transition placeholder:text-gray-400",
              "focus:ring-2 focus:ring-blue-500 focus:outline-none",
              iconLeft && "pl-10",
              iconRight && "pr-10",
              bordered ? "border-gray-300" : "border-transparent",
              inputClassName
            )}
            {...props}
          />

          {iconRight && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 pointer-events-none">
              {iconRight}
            </div>
          )}
        </div>
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
