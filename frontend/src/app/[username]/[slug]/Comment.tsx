"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "react-quill-new/dist/quill.snow.css";

type CommentProps = {
  postId: number;
  isLoggedIn: boolean;
};

function Comment({ postId, isLoggedIn }: CommentProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [comment, setComment] = useState("");
  const router = useRouter();

  const handleCommentSubmit = async () => {
    if (!isLoggedIn) {
      alert("You must log in to comment on posts.");
      router.push("/login");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${apiUrl}/posts/comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: comment }),
      });

      setComment(""); // clear textarea after success
      router.refresh();
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  return (
    <div className="w-full flex flex-col">
 
      <textarea
        name="comment"
        id="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What are your thoughts?"
        className="outline-none bg-[#1a1a1a] rounded-t-sm p-2 resize-none h-[150px]"
      />

      <div className="flex justify-end gap-4 bg-[#1a1a1a] rounded-b-sm p-2">
        <button
          onClick={() => setComment("")}
          className="cursor-pointer hover:underline"
        >
          Cancel
        </button>

        <button
          onClick={handleCommentSubmit}
          disabled={!comment.trim()}
          className={`rounded-full px-4 py-2 transition-all duration-300 ${
            comment.trim()
              ? "bg-white text-[#1a1a1a] cursor-pointer"
              : "bg-gray-500/50 text-gray-300 cursor-not-allowed"
          }`}
        >
          Respond
        </button>
      </div>
    </div>
  );
}

export default Comment;
