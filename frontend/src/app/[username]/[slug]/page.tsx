// "use client";

import LikeButton from "./LikeButton";
import { geologica, georgia } from "../../fonts/fonts";
import { notFound } from "next/navigation";
import PostMenu from "../../../components/PostMenu";
import Image from "next/image";
import { Profile } from "../../../../public/imgs/imgs";
import Link from "next/link";
import ShareButtons from "@/components/ShareButton";
import { getReadingTime } from "@/utils/getReadingTime";
import FollowButton from "@/UI/FollowButton";
import CommentsSection from "./CommentSection";
// import { useRouter } from "next/navigation";
import PostView from "./PostView";

async function getPost(username: string, slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${apiUrl}/posts/${username}/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

async function getUserPublicProfile(username: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${apiUrl}/user/profile/${username}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    console.log("Profile fetch failed:", res.status);
    return null;
  }

  const data = await res.json();
  // console.log("Fetched profile:", data);
  return data;
}

async function followAuthor(username: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${apiUrl}/user/follow/${username}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) {
    // console.log("Follow request failed:", res.status);
    return null;
  }
  return res.json();
}

async function getComments(postId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${apiUrl}/posts/comment/${postId}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    console.log("comments request failed:", res.status);
    // return null;
    return [];
  }

  // console.log("Comments fetched:", await res.clone().json());
  return res.json();
}

async function getViews(postId: number) {
  // const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${apiUrl}/posts/views/${postId}`);

  if (!res.ok) {
    console.log("Views request failed:", res.status);
    return null;
  }
  // router.refresh();
  const viewsData = await res.json();
  console.log("Views data:", viewsData);
  return viewsData.views;
}

async function postView(postId: number) {
  // const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${apiUrl}/posts/views/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      visitorId: localStorage.getItem("visitorId"),
    }),
  });
  if (!res.ok) {
    console.log("Post view request failed:", res.status);
    return null;
  }
  // router.refresh();
  return res.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;

  // fetch both post and user profile
  const [post, user] = await Promise.all([
    getPost(username, slug),
    getUserPublicProfile(username),
  ]);

  const comments = await getComments(post.id);

  if (!post) return notFound();
  const readingTime = getReadingTime(post.content.replace(/<[^>]*>/g, ""));

  const isLoggedIn = true;
  const userId = isLoggedIn ? post.id : null; // Replace with actual userId if available
  const views = await getViews(post.id);

  return (
    <main className="max-w-3xl mx-auto p-6 text-white bg-[#242535]">
      <h1
        className={`text-[42px] leading-[100%] font-bold mb-4 ${geologica.className}`}
      >
        {post.title}
      </h1>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start justify-center space-x-4">
          <Image
            src={user?.profile_picture_url || Profile}
            alt={post.author}
            width={40}
            height={40}
            className="object-cover rounded-full border border-amber-50 w-10 h-10"
          />
          <div className="flex flex-col items-start">
            <Link href={``} className="text-gray-400 hover:underline-offset-1">
              {" "}
              {post.author}
            </Link>
            <p className="italic text-gray-400">{readingTime}</p>
          </div>
        </div>
        <PostMenu postId={post.id} />
      </div>

      {post.img_url && (
        <img
          src={post.img_url}
          alt={post.title}
          className="w-full rounded-lg mb-6"
        />
      )}

      <div
        className={`prose prose-invert max-w-none font-light text-[20px] ${georgia.className}`}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-8 flex items-center justify-between space-x-4">
        <LikeButton postId={post.id} isLoggedIn={isLoggedIn} />

        <ShareButtons />
      </div>

      <div className="flex justify-between items-start mt-12 ">
        <div className="flex items-start justify-center space-x-[2rem]">
          <Link
            href={`/${post.author}`}
            className="flex items-center justify-center shrink-0"
          >
            <Image
              src={user?.profile_picture_url || Profile}
              alt={post.author}
              width={40}
              height={40}
              className="object-cover rounded-full border border-amber-50 w-15 h-15 flex items-center justify-center"
            />
          </Link>

          <div className="flex items-start justify-center flex-col gap-2 ">
            <Link href={`/${post.author}`} className="text-[25px] font-medium">
              Written by {post.author}
            </Link>
            <p className="text-gray-400">{`${user.followers} followers · ${user.following} following`}</p>
            <p>{user.bio}</p>
          </div>
        </div>

        {/* <FollowButton username={user.username} /> */}
        <FollowButton username={user.username} initialFollowing={false} />
      </div>

      <PostView postId={post.id} userId={userId} />
      <div>Views: {views}</div>

      <div className="whitespace-pre-line border-t border-gray-700 mt-12 pt-6 flex flex-col gap-4">
        <CommentsSection
          postId={post.id}
          comments={comments}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </main>
  );
}
