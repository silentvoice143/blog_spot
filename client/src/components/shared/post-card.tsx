import React, { useMemo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SmartImage from "./smart-image";
import { Post } from "@/lib/types/post";





const gradients = [
  "from-purple-600 to-blue-500",
  "from-pink-500 to-orange-400",
  "from-green-500 to-emerald-400",
  "from-indigo-500 to-purple-500",
  "from-yellow-500 to-red-500",
  "from-cyan-500 to-blue-400",
];

const PostCard = ({ post }: { post: Post }) => {
  const initials = post.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const randomGradient = useMemo(() => {
    const index = Math.floor(Math.random() * gradients.length);
    return gradients[index];
  }, []);

  return (
    <div className="relative aspect-[1/1] sm:aspect-[2/1] rounded-md overflow-hidden cursor-pointer ">
      {/* Image / fallback */}
      {post.picture ? (
        <SmartImage
          src={post.picture}
          alt={post.title}
          className="absolute inset-0"
          showGradientFallback={true}
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${randomGradient}`}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black-primary/85 via-black-primary/40 to-black-primary/10" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 gap-2 ">
        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap">
          {post.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] font-medium px-2.5 py-0.5 rounded-full
              bg-white/20 text-white border border-white/25 backdrop-blur-sm"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="font-serif font-semibold text-white leading-snug">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-white/75 leading-relaxed line-clamp-2">
          {post.description}
        </p>

        {/* Author */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/20">
          <Avatar className="w-7 h-7 border border-white/50">
            <AvatarFallback className="bg-white/20 text-white text-[10px]">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="text-[11px] font-medium text-white">{post?.author?.name}</p>
            <p className="text-[10px] text-white/60">{new Date(post.publishedAt as string).toLocaleDateString()}</p>
          </div>

          {/* <span className="ml-auto text-[10px] text-white/60">
            {post.readTime} read
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
