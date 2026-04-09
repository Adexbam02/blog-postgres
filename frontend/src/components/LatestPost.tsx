"use client";
import { truncateText } from "@/utils/truncateText";
import { Post1, User } from "../../public/imgs/imgs";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Post {
  id: number;
  img_url: string;
  title: string;
  category: string;
  author: string;
  created_at: string;
  slug: string;
  profile_picture_url?: string; // added
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const fetchPosts = async (): Promise<Post[]> => {
  try {
    const res = await fetch(`${apiUrl}/posts`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

const getUserPublicProfile = async (username: string) => {
  try {
    const res = await fetch(`${apiUrl}/user/profile/${username}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn(`Profile fetch failed for ${username}:`, res.status);
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

export default function LatestPost() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadPostsWithProfiles = async () => {
      const postData = await fetchPosts();

      // Fetch each author's profile
      const postsWithProfiles = await Promise.all(
        postData.map(async (post) => {
          const user = await getUserPublicProfile(post.author);
          return {
            ...post,
            profile_picture_url: user?.profile_picture_url || null,
          };
        }),
      );
      setPosts(postsWithProfiles);
    };

    loadPostsWithProfiles();
  }, []);

  return (
    <div className="md:min-h-screen md:px-[150px] md:py-[32px]">
      <div>
        <h1 className="text-[20px] font-bold text-white">Latest Posts</h1>

        <div className="md:grid md:grid-cols-3 md:gap-[20px] mt-[32px] justify-between">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                href={`/${post.author.toLowerCase()}/${encodeURIComponent(
                  post.slug.toLowerCase().replace(/\s+/g, "-"),
                )}`}
                key={post.id}
                className="max-w-[339px] min-w-[339px] max-h-[432px] min-h-[432px] bg-[#181A2A] border border-[#242535] rounded-[12px] flex flex-col items-start overflow-hidden p-[16px]"
              >
                <Image
                  src={post.img_url || Post1}
                  alt={post.title}
                  width={360}
                  height={240}
                  unoptimized
                  className="rounded-[8px] min-h-[200px] max-h-[200px] w-full object-cover mb-[16px]"
                />

                <div className="flex flex-col items-start justify-between h-full mt-[16px] gap-[10px]">
                  <h3 className="text-[14px] text-[#4B6BFB] rounded-[6px] p-1 bg-[#4B6BFB]/5">
                    {post.category}
                  </h3>

                  <h1 className="font-semibold text-[24px] text-white leading-[100%] max-w-[300px]">
                    {truncateText(post.title, 50)}
                    {/* {post.title} */}
                  </h1>

                  <div className="mt-[8px] flex items-center justify-between w-full flex-nowrap">
                    <span className="flex items-center">
                      <Image
                        src={post.profile_picture_url || User}
                        alt={post.author}
                        width={40}
                        height={40}
                        className="rounded-full inline-block mr-2 w-[30px] h-[30px] object-cover border border-amber-50"
                      />
                      <span className="text-white">{post.author}</span>
                    </span>
                    <span className="text-gray-400 text-[14px] ml-4">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-400">No posts available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
