"use client";
import { useState } from "react";

interface LikeButtonProps {
  postId: string;
  initialLikes?: number;
}

export default function LikeButton({
  postId,
  initialLikes = 0,
}: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked((prev) => !prev);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const res = await fetch(`${apiUrl}/posts/${postId}/like`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to update like status");
      }
      const data = await res.json();
      setLikeCount(data.likes_count);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLike}
        className="cursor-pointer bg-transparent border-none p-0 text-gray-400" // Added text-gray-400
        aria-label="Like post"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className={isLiked ? "fill-white" : "fill-none stroke-current"}
          strokeWidth="0.5"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>
      <p className="text-gray-400">{likeCount}</p>
    </div>
  );
}
