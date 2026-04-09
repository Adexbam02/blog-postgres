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
import { castoroTitling } from "@/fonts/fonts";

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

  const data = await res.json();
  return data.comments || data || [];
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
    <div className="min-h-screen bg-[#fafafa] text-gray-800 selection:bg-indigo-500/30">
      <main className="max-w-[1000px] mx-auto px-6 py-12 md:py-20">
        {/* HERO SECTION */}
        <header className="mb-14 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-500 tracking-wide uppercase mb-8 shadow-sm">
            {post.category}
          </div>

          <h1
            className={`text-4xl md:text-6xl lg:text-[72px] leading-[1.1] font-extrabold mb-10 text-transparent bg-clip-text bg-linear-to-b from-gray-900 to-gray-500 tracking-tight ${castoroTitling.className}`}
          >
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <address className="flex items-center gap-4 not-italic">
              <Image
                src={user?.profile_picture_url || Profile}
                alt={post.author}
                width={56}
                height={56}
                className="object-cover rounded-full border-2 border-white/10 w-14 h-14 shadow-md"
              />
              <div className="flex flex-col items-start gap-1">
                <span className="font-semibold text-gray-900 text-base">
                  <Link
                    href={`/${post.author}`}
                    className="hover:text-indigo-400 transition-colors"
                  >
                    {post.author}
                  </Link>
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <span>{readingTime}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                  <span>{views} views</span>
                </span>
              </div>
            </address>
          </div>
        </header>

        {/* COVER IMAGE */}
        {post.img_url && (
          <div className="relative w-full aspect-video md:aspect-[21/9] mb-16 group rounded-4xl overflow-hidden border border-white/10 shadow-2xl bg-[#1A1C23]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            <img
              src={post.img_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}

        {/* POST CONTENT */}
        <article className="max-w-[760px] mx-auto relative relative">
          {/* <PostView postId={post.id} userId={userId} /> */}

          {/* Floater / Menu */}
          <div className="absolute -left-20 top-0 hidden xl:flex flex-col gap-4">
            <PostMenu postId={post.id} />
          </div>

          <div
            className={`prose prose-invert prose-lg md:prose-xl max-w-none text-[17px] text-gray-300 leading-relaxed marker:text-indigo-500 prose-headings:text-white prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-img:rounded-2xl ${georgia.className}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* ENGAGEMENT BAR */}
          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 py-6 border-y border-[#1a1a1a]">
            <LikeButton postId={post.id} isLoggedIn={isLoggedIn} />
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Share
              </span>
              <ShareButtons />
            </div>
          </div>
        </article>

        {/* AUTHOR PROFILE CARD */}
        <div className="max-w-[760px] mx-auto mt-24 relative group">
          {/* Subtle gradient background effect container */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-[2.5rem] blur-lg opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

          <div className="relative bg-[#131417] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <Link href={`/${post.author}`} className="shrink-0 relative">
                  <Image
                    src={user?.profile_picture_url || Profile}
                    alt={post.author}
                    width={88}
                    height={88}
                    className="object-cover rounded-full border-[3px] border-[#2A2D3A] w-22 h-22 shadow-lg relative z-10"
                  />
                  <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md scale-110"></div>
                </Link>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-indigo-400/80 font-bold tracking-[0.2em] uppercase">
                    About the Author
                  </span>
                  <Link
                    href={`/${post.author}`}
                    className="text-3xl font-extrabold text-white hover:text-indigo-300 transition-colors"
                  >
                    {post.author}
                  </Link>
                  <p className="text-sm text-gray-400 font-medium mt-1 tracking-wide">
                    {user.followers} followers{" "}
                    <span className="mx-2 text-gray-600">•</span>{" "}
                    {user.following} following
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <FollowButton
                  username={user.username}
                  initialFollowing={false}
                />
              </div>
            </div>
            {user.bio && (
              <p className="mt-8 text-gray-300 leading-relaxed text-lg max-w-2xl font-light">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* COMMENTS SECTION */}
        <div className="max-w-[760px] mx-auto mt-24">
          <CommentsSection
            postId={post.id}
            comments={comments}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </main>
    </div>
  );
}
