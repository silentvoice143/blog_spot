import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

interface MultiSelectProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  onChange: (selected: string[]) => void;
  minSelect?: number;
  maxSelect?: number;
  subheading?:string;
}

export default function MultiSelect({
  options,
  placeholder = "Select options",
  onChange,
  minSelect = 1,
  maxSelect = 3,
  subheading=""
}: MultiSelectProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleSelection = (value: string) => {
    let newSelection = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value) // Remove if exists
      : [...selectedValues, value]; // Add if not exists

    if (newSelection.length < minSelect) {
      setError(`You must select at least ${minSelect} option(s).`);
    } else if (newSelection.length > maxSelect) {
      setError(`You can select up to ${maxSelect} options.`);
      return; // Stop adding more selections
    } else {
      setError(null);
    }

    setSelectedValues(newSelection);
    onChange(newSelection); // Send values to parent
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Select Trigger */}
      <div
        className="flex items-center gap-2 px-3 border rounded-md cursor-pointer min-h-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap items-center w-full gap-2">
          {selectedValues.length > 0 ? (
            selectedValues.map((value) => (
              <Badge
                key={value}
                variant="secondary"
                className="flex items-center h-7"
              >
                {options.find((opt) => opt.value === value)?.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 ml-1 text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent dropdown from opening
                    toggleSelection(value);
                  }}
                >
                  ✕
                </Button>
              </Badge>
            ))
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div><p className="text-xs text-gray-secondary1 mt-2">{subheading}</p>

      {/* Dropdown Content with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute left-0 z-[9999] w-full mt-1 bg-white border rounded-md shadow-lg h-[120px] overflow-auto"
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  selectedValues.includes(option.value) ? "bg-gray-200" : ""
                }`}
                onClick={() => toggleSelection(option.value)}
              >
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Validation Message */}
      {error && (
        <div className="flex items-center mt-1 text-sm text-red-600">
          <AlertCircle size={16} className="mr-1" />
          {error}
        </div>
      )}
    </div>
  );
}
