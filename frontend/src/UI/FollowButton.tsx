"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FollowButton({
  username,
  className,
}: {
  username: string;
  className?: string;
}) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check login
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isLoggedIn = !!token;
  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/following/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.ok) {
          const data = await res.json();
          setIsFollowing(data.isFollowing);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [username, isLoggedIn, token]);

  const handleFollow = async () => {
    if (!isLoggedIn) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/follow/${username}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.ok) setIsFollowing(true);
    router.refresh();
  };

  const handleUnfollow = async () => {
    if (!isLoggedIn) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/unfollow/${username}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.ok) setIsFollowing(false);
    router.refresh();
  };

  if (loading)
    return (
      <button className="border border-gray-100/10 text-white py-2 px-4 rounded-full">
        ...
      </button>
    );

  return (
    <button
      disabled={!isLoggedIn}
      onClick={isFollowing ? handleUnfollow : handleFollow}
      className={`shrink-0 border border-gray-100/10 text-white py-2 px-4 rounded-full transition cursor-pointer hover:bg-blue-500/20
        ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : ""}
        ${className ?? ""}
      `}
    >
      {!isLoggedIn ? "Login to follow" : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
