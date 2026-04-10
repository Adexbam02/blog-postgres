"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, UserPlus, Bell, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getRelativeTime } from "@/utils/getRelativeTime";

interface Notification {
  id: number;
  type: "like" | "comment" | "follow" | string;
  message: string;
  is_read: boolean;
  created_at: string;
  post_id: number | null;
  actor_username: string | null;
  actor_avatar: string | null;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/sign-in");
        return;
      }

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch notifications");

        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [router]);

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case "comment":
        return (
          <MessageCircle className="w-5 h-5 text-indigo-500 fill-indigo-500" />
        );
      case "follow":
        return <UserPlus className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pt-12 pb-24">
      <div className="max-w-[700px] mx-auto px-6">
        <header className="mb-8 flex items-center justify-between border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Notifications
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Catch up on your latest interactions
            </p>
          </div>
          <div className="bg-gray-100 p-3 rounded-full relative">
            <Bell className="w-6 h-6 text-gray-700" />
            {notifications.some((n) => !n.is_read) && (
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-100"></span>
            )}
          </div>
        </header>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white mt-10">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <Bell className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              You're all caught up!
            </h3>
            <p className="text-gray-500 mt-2 font-medium">
              When someone interacts with your posts, you'll see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`group relative flex items-start gap-4 p-5 rounded-2xl transition-all duration-200 border cursor-pointer
                  ${notification.is_read ? "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm" : "bg-indigo-50/30 border-indigo-100 shadow-sm"}
                `}
              >
                {/* Unread dot */}
                {!notification.is_read && (
                  <div className="absolute top-6 right-5 w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                )}

                {/* Avatar / Icon Stack */}
                <div className="relative shrink-0 mt-1">
                  {notification.actor_avatar ? (
                    <Image
                      src={notification.actor_avatar}
                      alt={notification.actor_username || "User"}
                      width={44}
                      height={44}
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-linear-to-tr from-gray-200 to-gray-300 flex items-center justify-center border-2 border-white shadow-sm">
                      <span className="text-gray-600 font-bold text-sm">
                        {(
                          notification.actor_username?.[0] || "?"
                        ).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                    {getIcon(notification.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pr-6">
                  <p className="text-base text-gray-800">
                    <span className="font-bold text-gray-900 mr-1">
                      {notification.actor_username || "Someone"}
                    </span>
                    <span className="text-gray-600">
                      {notification.type === "like" && "liked your post"}
                      {notification.type === "comment" &&
                        "commented on your post"}
                      {notification.type === "follow" &&
                        "started following you"}
                      {/* Fallback for exact message */}
                      {!["like", "comment", "follow"].includes(
                        notification.type,
                      ) && notification.message}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400 font-medium mt-1.5 flex items-center gap-2">
                    {getRelativeTime(notification.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
