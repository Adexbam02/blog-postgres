"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Profile } from "../../../../public/imgs/imgs";
import { ChevronDown } from "lucide-react";
import Comment from "./Comment";
import CommentItem from "./CommentItem";
import DeleteCommentModal from "./DeleteCommentModal";
import { useRouter } from "next/navigation";

export type CommentType = {
  id: number;
  username: string;
  profile_picture_url: string | null;
  content: string;
  created_at: string;
  user_id: number;
};

type CommentsSectionProps = {
  comments: CommentType[];
  postId: number;
  isLoggedIn: boolean;
};

export default function CommentsSection({
  comments,
  postId,
  isLoggedIn,
}: CommentsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(3);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const router = useRouter();
  const loadMoreCount = 3;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(payload.userId);
    } catch {
      setCurrentUserId(null);
    }
  }, []);

  async function deleteComment(commentId: number) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${apiUrl}/posts/comment/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      router.refresh();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  }

  return (
    <div className="mt-1 pt-6 flex flex-col gap-4 relative">
      <h2 className="text-2xl font-semibold">
        {`Comments(${comments.length})`}
      </h2>

      <div className="flex flex-col gap-6">
        <Image
          src={Profile}
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full w-10 h-10"
        />
        <Comment postId={postId} isLoggedIn={isLoggedIn} />
      </div>

      {comments.length > 0 ? (
        <div className="mt-8 border-t border-gray-700 py-6">
          {comments.slice(0, visibleCount).map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onDelete={() => setConfirmDeleteId(comment.id)}
            />
          ))}

          {visibleCount < comments.length && (
            <button
              onClick={() => setVisibleCount((v) => v + loadMoreCount)}
              className="mx-auto mt-4 flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full"
            >
              Show More ({comments.length - visibleCount})
              <ChevronDown />
            </button>
          )}
        </div>
      ) : (
        <p className="mt-8 text-gray-400">No comments yet.</p>
      )}

      <DeleteCommentModal
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId !== null) {
            deleteComment(confirmDeleteId);
            setConfirmDeleteId(null);
          }
        }}
      />
    </div>
  );
}