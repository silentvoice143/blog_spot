import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CheckIcon } from "@heroicons/react/24/outline";

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -5 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -5 },
};

export default function CustomDropdown({ value, options, onClick }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative flex-shrink-0 inline-block text-left"
      ref={dropdownRef}
    >
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between flex-1 w-full gap-2 px-4 py-1 bg-gray-100 rounded-lg hover:bg-gray-200"
      >
        {value}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            transition={{ duration: 0.15 }}
            className="absolute z-10 w-48 mt-2 bg-white border border-gray-200 shadow-lg rounded-xl"
          >
            <ul className="px-2 py-2">
              {options.map((item, idx) => (
                <li
                  onClick={() => {
                    onClick(item.cmd);
                    console.log("clicked");
                  }}
                  key={`${idx} dropitem ${item.label}`}
                  className="flex justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <span>{item.label}</span>
                  {item.label === value && <CheckIcon className="w-6 h-4" />}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
