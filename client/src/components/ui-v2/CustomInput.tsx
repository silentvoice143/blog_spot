import * as React from "react";
import { Input } from "@/components/ui/input"; // shadcn Input path
import { cn } from "@/utils/class"; // utility to merge classNames

interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string; // for outer wrapper
  inputClassName?: string; // for the input element
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
      <div className={cn("w-full", className)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-gray-700 mb-1",
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {iconLeft && (
            <div className="absolute left-3 pointer-events-none flex items-center">
              {iconLeft}
            </div>
          )}
          <Input
            bordered={bordered}
            id={inputId}
            ref={ref}
            className={cn(
              "w-full focus:border-none focus:outline-none",
              iconLeft && "!pl-8",
              iconRight && "!pr-8",
              inputClassName
            )}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 pointer-events-none flex items-center">
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
