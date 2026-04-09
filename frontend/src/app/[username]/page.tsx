"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { truncateText } from "@/utils/truncateText";
import FollowButton from "@/UI/FollowButton";
import { timeAgo } from "@/utils/timeAgo";
type UserProfile = {
  username: string;
  email: string;
  bio: string | null;
  profile_picture_url: string | null;
  banner_picture_url: string | null;
  posts: {
    id: number;
    slug: string;
    title: string;
    content: string;
    category: string;
    img_url: string | null;
    likes: number;
    created_at: string;
  }[];
};

export default function UserProfilePage() {
  const params = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [following, setFollowing] = useState<number>(0);
  const [followers, setFollowers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);

  const username = params.username;
  console.log(params);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setIsLoggedIn(true);
      setLoggedInUsername(payload.username);
    } catch {
      setIsLoggedIn(false);
      setLoggedInUsername(null);
    }
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/user/profile/profile/${username}`);

        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchFollowing() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/user/profile/${username}`);

        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setFollowers(data.followers);
        setFollowing(data.following);
        console.log("FOLLOWING DATA", data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    fetchProfile();
    fetchFollowing();
  }, [username]);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading profile…</p>;

  if (!profile)
    return <p className="text-center mt-10 text-red-500">User not found</p>;

  const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "");

  return (
    <div className="grid grid-cols-4">
      <div>a</div>
      <div className="w-full mx-auo mt10  bg-blac col-span-2 border-x border-black/30 min-h-screen">
        <div>
          <div className="flex flex-col relative">
            <div className="w-full h-[200px] relative bg-black">
              {profile.banner_picture_url && (
                <Image
                  src={profile.banner_picture_url}
                  alt="Banner"
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>

            <div className="w-[135px] h-[135px] rounded-md border-2 border-black/30 absolute left-6 bottom-[-60px] bg-black overflow-hidden ">
              <Image
                src={profile.profile_picture_url || "/default-profile.png"}
                alt="Profile Picture"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>

          <div className="mt-20 px-6">
            <div className="flex w-full justify-between">
              <div className="flex flex-col items-start gap-">
                <h2 className="text-2xl font-bold">{profile.username}</h2>
                <p>{profile.email}</p>
              </div>

              {/* <button>Edit Profile | Follow</button> */}
              <div>
                {!isLoggedIn && null}

                {isLoggedIn && loggedInUsername === profile.username && (
                  <Link href="/edit-profile">
                    <button className="border border-white bg-black text-white cursor-pointer hover:bg-black/80 px-4 py-1 ">
                      Edit Profile
                    </button>
                  </Link>
                )}

                {isLoggedIn && loggedInUsername !== profile.username && (
                  <FollowButton
                    className="bg-amber-500 text-black border-black/30 border-2 px-6 py-1"
                    username={profile.username}
                  />
                )}
              </div>
            </div>

            <p className="my-5 font-semibold">{profile.bio}</p>
          </div>

          <div className="flex w-full gap-3 px-6 font-semibold mb-10">
            <p>{followers} Followers</p>
            <p>{following} Following</p>
          </div>
        </div>

        <button className="flex px-6 cursor-pointer border-b border-black/50 py-2 hover:bg-black/10  transaition-all ease-in-out duration-300 ">
          Posts
        </button>

        {/* Divider */}
        <div className="h-px bg-gray-300 my10" />

        {profile.posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <div className="">
            {profile.posts.map((post) => (
              <Link
                key={post.id}
                href={`/${profile.username}/${post.slug}`}
                className="w-full p-5 border-b border-black/30 flex flex-col justify-between"
              >
                <div className="w-full flex flex-row-reverse justify-between gap-2">
                  {post.img_url && (
                    <div className="w-[30%] h-[130px] shrink-0 overflow-hidden mb-3">
                      <Image
                        src={post.img_url}
                        alt={post.title}
                        width={600}
                        height={400}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}

                  <div className="flex flex-col items-start gap-2">
                    <h3 className="text-[30px] leading-[120%] text-wrap  font-semibold">
                      {truncateText(post.title, 50)}
                      {/* {post.title} */}
                    </h3>
                    <p className="text-gray-500">
                      {stripHtml(truncateText(post.content, 120))}
                    </p>
                  </div>
                </div>

                <div className="flex  items-center  gap-5">
                  <div className="flex gap-3 items-center">
                    <p className="text-gray-500 text-sm">
                      {timeAgo(post.created_at)}
                      {/* {new Date(post.created_at).toLocaleDateString()} */}
                    </p>
                    <p className=" bg-white rounded text-sm font-medium">
                      {post.category}
                    </p>
                    <p>{post.likes} Likes</p>
                    <p>Comments</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div>b</div>
    </div>
  );
}
