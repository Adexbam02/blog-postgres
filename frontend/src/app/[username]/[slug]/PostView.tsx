"use client";

import { useEffect } from "react";

type PostViewProps = {
  postId: number;
  userId?: number | null;
};

export default function PostView({ postId, userId }: PostViewProps) {
  useEffect(() => {
    const visitorId = localStorage.getItem("visitorId");

    // generate a visitorId if it doesn't exist
    if (!visitorId && !userId) {
      const newVisitorId = `visitor-${Date.now()}-${Math.floor(
        Math.random() * 10000,
      )}`;
      localStorage.setItem("visitorId", newVisitorId);
    }

    const sendView = async () => {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/views/${postId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(userId && {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }),
            },
            body: JSON.stringify({
              visitorId: userId ? null : localStorage.getItem("visitorId"),
            }),
          },
        );
      } catch (err) {
        console.error("Failed to record view:", err);
      }
    };

    sendView();
  }, [postId, userId]);

  return null; // this component does not render anything
}
