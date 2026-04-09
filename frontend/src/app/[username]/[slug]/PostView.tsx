// "use client";

// import { useEffect, useRef, useState } from "react";

// interface Post {
//   id: string;
//   content: string;
// }

// interface PostViewProps {
//   post: Post;
// }

// function PostView({ post }: PostViewProps) {
//   const [hasRecordedView, setHasRecordedView] = useState(false);

//   const timeVisibleRef = useRef(0);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const isVisibleRef = useRef(true);
//   const hasSentRef = useRef(false); // HARD guard

//   function getVisitorId() {
//     let id = localStorage.getItem("visitor_id");
//     if (!id) {
//       id = crypto.randomUUID();
//       localStorage.setItem("visitor_id", id);
//     }
//     return id;
//   }

//   const recordView = async () => {
//     if (hasSentRef.current) return;
//     hasSentRef.current = true;

//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//       const token = localStorage.getItem("token");

//       const headers: Record<string, string> = {
//         "Content-Type": "application/json",
//       };

//       const body: Record<string, any> = {};

//       if (token) {
//         headers.Authorization = `Bearer ${token}`;
//       } else {
//         body.visitorId = getVisitorId();
//       }

//       const res = await fetch(`${apiUrl}/posts/views/${post.id}`, {
//         method: "POST",
//         headers,
//         body: JSON.stringify(body),
//       });

//       if (res.ok) {
//         setHasRecordedView(true);
//         if (intervalRef.current) {
//           clearInterval(intervalRef.current);
//         }
//       }
//     } catch (error) {
//       console.error("Error recording view:", error);
//       hasSentRef.current = false; // allow retry on failure
//     }
//   };

//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       isVisibleRef.current = !document.hidden;
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     intervalRef.current = setInterval(() => {
//       if (isVisibleRef.current && !hasRecordedView) {
//         timeVisibleRef.current += 1;

//         if (timeVisibleRef.current >= 30) {
//           recordView();
//         }
//       }
//     }, 1000);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [hasRecordedView]);

//   return null;
// }

// export default PostView;

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
        Math.random() * 10000
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
          }
        );
      } catch (err) {
        console.error("Failed to record view:", err);
      }
    };

    sendView();
  }, [postId, userId]);

  return null; // this component does not render anything
}
