"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

type LikeButtonProps = {
  postId: number;
  isLoggedIn: boolean;
};

export default function LikeButton({ postId, isLoggedIn }: LikeButtonProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Load initial like count + whether user liked it
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const token = localStorage.getItem("token");

        // Get total likes
        const countRes = await fetch(`${apiUrl}/posts/${postId}/likes`);
        const countData = await countRes.json();
        setLikeCount(countData.total || 0);

        // If logged in, check if user liked
        if (token) {
          const statusRes = await fetch(`${apiUrl}/posts/${postId}/liked`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const statusData = await statusRes.json();
          setLiked(statusData.liked || false);
        }
      } catch (err) {
        console.error("Failed to load like state:", err);
      }
    };

    fetchLikes();
  }, [postId, apiUrl]);

  // Toggle like
  const toggleLike = async () => {
    if (!isLoggedIn) {
      alert("You must log in to like posts.");
      router.push("/login");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (liked) {
        // UNLIKE
        await fetch(`${apiUrl}/posts/like/${postId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        // LIKE
        await fetch(`${apiUrl}/posts/like/${postId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  return (
    <button
      onClick={toggleLike}
      className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-lg hover:bg-[#2a2a2a] transition cursor-pointer"
    >
      <Heart
        size={20}
        className={liked ? "fill-red-500 text-red-500" : "text-gray-400"}
      />
      <span>{likeCount}</span>
    </button>
  );
}
