import { CheckIcon } from "@heroicons/react/24/outline";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

interface CommandListProps {
  items: Array<{
    title: string;
    icon: string;
    command: (props: any) => void;
  }>;
  command: (item: any) => void;
}

export interface CommandListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const CommandList = forwardRef<CommandListRef, CommandListProps>(
  (props, ref) => {
    const { items, command } = props;
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Auto-select first item when items change
    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === "ArrowUp") {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }

        if (event.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }

        if (event.key === "Enter") {
          if (items[selectedIndex]) {
            command(items[selectedIndex]);
          }
          return true;
        }

        return false;
      },
    }));

    // Scroll selected item into view
    useEffect(() => {
      const element = document.querySelector(`[data-index="${selectedIndex}"]`);
      if (element) {
        element.scrollIntoView({ block: "nearest" });
      }
    }, [selectedIndex]);

    return (
      <div className="bg-white rounded-16 shadow-lg border p-1 overflow-hidden max-h-[300px] min-w-48 overflow-y-auto">
        {items.map((item, index) => (
          <button
            key={index}
            data-index={index}
            className={`flex items-center justify-between gap-2 w-full p-2 text-sm rounded hover:bg-gray-50 ${
              index === selectedIndex && "bg-gray-50"
            }`}
            onClick={() => command(item)}
          >
            <div className="flex gap-2">
              <span className="flex items-center justify-center w-4 h-4">
                {item.icon}
              </span>
              <span className="text-14 text-neutral-text-primary">
                {item.title}
              </span>
            </div>
            {index === selectedIndex && (
              <CheckIcon
                className="w-4 h-4 text-blue-secondary"
                strokeWidth={2}
              />
            )}
          </button>
        ))}
      </div>
    );
  }
);

CommandList.displayName = "CommandList";
