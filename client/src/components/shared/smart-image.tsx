import React, { useMemo, useState } from "react";
import { cn } from "@/utils/class";

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;

  showGradientFallback?: boolean; // 👈 new prop
}

// 🎨 gradient options
const gradients = [
  "from-purple-600 to-blue-500",
  "from-pink-500 to-orange-400",
  "from-green-500 to-emerald-400",
  "from-indigo-500 to-purple-500",
  "from-yellow-500 to-red-500",
  "from-cyan-500 to-blue-400",
];

const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className,

  showGradientFallback = false,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const hasSrc = Boolean(src && src.trim() !== "");

  const randomGradient = useMemo(() => {
    const index = Math.floor(Math.random() * gradients.length);
    return gradients[index];
  }, []);

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {/* ✅ Skeleton (only when image exists) */}
      {hasSrc && loading && !error && (
        <div className="absolute h-full w-full inset-0 animate-pulse bg-gray-300" />
      )}

      {hasSrc && error && (
        <div
          className={`absolute h-full w-full inset-0 bg-gradient-to-br ${randomGradient}`}
        />
      )}

      {/* ✅ Image */}
      {hasSrc && (
        <img
          src={src}
          alt={alt}
          {...props}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            loading || error ? "opacity-0" : "opacity-100",
          )}
        />
      )}
    </div>
  );
};

export default SmartImage;
