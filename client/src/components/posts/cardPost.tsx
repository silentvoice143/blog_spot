import { useState } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  BookmarkPlus,
  MoreHorizontal,
} from "lucide-react";
import SmartImage from "../shared/smart-image";
import { formatDate } from "@/utils/common-utils";
import { Button } from "../ui/button";

// Mock Card components for the example
const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg ${className}`}>{children}</div>
);

const CardContent = ({ children, className }) => (
  <div className={className}>{children}</div>
);



export default function CardPost(props) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(props.likes || 23);
  const [showMore, setShowMore] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    // Mock share functionality
    navigator
      .share?.({
        title: props.title,
        text: props.content,
        url: window.location.href,
      })
      .catch(() => {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      });
  };

  const getAuthorInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase() || "A"
    );
  };

  return (
    <Card className="p-0 transition-all duration-200 max-w-[800px] w-full relative group cursor-pointer">
      <CardContent className="p-6">
        {/* Header with author info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 text-sm font-medium bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-full">
              <span>{getAuthorInitials(props.author)}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-gray-800">
                  {props.author}
                </p><Button className="rounded-full h-6 px-2 text-xs" variant="outline">Follow</Button>
              </div>
              {props.tags && <p className="text-xs text-gray-500 text-ellipsis  overflow-hidden text-nowrap">in {props.tags}</p>}
            </div>
          </div>

          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setShowMore(!showMore)}
          >
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold font-montserrat text-gray-900 leading-tight mb-3 transition-colors">
              {props.title}
            </h1>

            <p className="text-base text-gray-600 leading-relaxed line-clamp-3 mb-6">
              {props.content}
            </p>
          </div>

          {props.picture && (
            <div className="">
              <SmartImage
                src={props?.picture}
                alt={props.title}
                className="hidden sm:block h-20 w-40 md:h-32 md:w-48 object-cover rounded-xl hover:scale-105 transition-transform duration-200 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Footer with date and actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          {/* Left: Date */}
          <div className="text-sm text-gray-500 font-medium">
            {formatDate(props.dop)}
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-1">
            {/* Like button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-gray-100 ${isLiked ? "text-red-500 bg-red-50" : "text-gray-600"
                }`}
            >
              <ThumbsUp
                className={`h-4 w-4 transition-transform duration-200 ${isLiked ? "fill-current scale-110" : ""
                  }`}
              />
              <span className="text-sm font-medium">{likeCount}</span>
            </button>

            {/* Comment button */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200">
              <MessageCircle
                className={`h-4 w-4 transition-transform duration-200 ${isLiked ? "fill-current scale-110" : ""
                  }`}
              />
              <span className="text-sm font-medium">{props.comments || 0}</span>
            </button>

            {/* Bookmark button */}
            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-full transition-all duration-200 hover:bg-gray-100 ${isBookmarked ? "text-yellow-500 bg-yellow-50" : "text-gray-600"
                }`}
            >
              <BookmarkPlus
                className={`h-4 w-4 transition-transform duration-200 ${isBookmarked ? "fill-current scale-110" : ""
                  }`}
              />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-green-600 transition-all duration-200"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* More options dropdown */}
        {showMore && (
          <div className="absolute top-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 min-w-[120px]">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Save post
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Hide post
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Report
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
