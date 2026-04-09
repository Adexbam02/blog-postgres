"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Ellipsis } from "lucide-react";
import { Profile } from "../../../../public/imgs/imgs";
import { timeAgo } from "@/utils/timeAgo";
import { CommentType } from "./CommentSection";

type Props = {
  comment: CommentType;
  currentUserId: number | null;
  onDelete: () => void;
};

export default function CommentItem({
  comment,
  currentUserId,
  onDelete,
}: Props) {
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const close = () => setOpenMenu(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  useEffect(() => (
    console.log("CommentItem rendered with comment:", comment)
  ), [comment]);
  return (
    <div className="flex flex-col gap-4 mb-10 relative">
      <div className="flex justify-between">
        <div className="flex items-start">
          <Image
            src={comment.profile_picture_url || Profile}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full w-10 h-10"
          />
          <div className="ml-4 text-sm text-gray-500">
            <p>{comment.username}</p>
            <p>{timeAgo(comment.created_at)}</p>
          </div>
        </div>

        <Ellipsis
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenu((v) => !v);
          }}
        />

        {openMenu && (
          <div className="absolute right-0 top-8 bg-gray-700 p-2 rounded-md text-sm flex flex-col items-start gap-2">
            <button>Copy link</button>
            <button>Share Comment</button>
            {currentUserId === comment.user_id && (
              <button
                className="text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setOpenMenu(false);
                }}
              >
                Delete Comment
              </button>
            )}
          </div>
        )}
      </div>

      <p className="text-gray-400">{comment.content}</p>
    </div>
  );
}
