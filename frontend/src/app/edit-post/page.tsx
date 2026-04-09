"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PublishState {
  title: string;
  content: string;
  author: string;
  category: string;
  img_url: string;
}

export default function EditPostPage({
  params
}: {
  params: { postId: string };
}) {
  const router = useRouter();
  const [publish, setPublish] = useState<PublishState>({
    title: "",
    content: "",
    author: "",
    category: "",
    img_url: ""
  });

  const [publishing, setPublishing] = useState(false);

  // Load token and fetch post
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/sign-in");
      return;
    }

    const fetchPost = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const response = await fetch(
          `${apiUrl}/posts/id/${params.postId}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          console.error("Post not found");
          return;
        }

        const data = await response.json();

        setPublish({
          title: data.title || "",
          content: data.content || "",
          author: data.author || "",
          category: data.category || "",
          img_url: data.img_url || ""
        });
      } catch (error) {
        console.error("Error fetching post", error);
      }
    };

    fetchPost();
  }, [params.postId, router]);

  // Handle update
  const updatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);

    const token = localStorage.getItem("token");
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const response = await fetch(
        `${apiUrl}/posts/edit-post/${params.postId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(publish)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update post");
      }

      router.push(`/posts/${publish.author}`);
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

      <form onSubmit={updatePost} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="border p-3 w-full rounded"
          value={publish.title}
          onChange={(e) =>
            setPublish({ ...publish, title: e.target.value })
          }
        />

        <textarea
          placeholder="Content"
          className="border p-3 w-full rounded min-h-[200px]"
          value={publish.content}
          onChange={(e) =>
            setPublish({ ...publish, content: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Category"
          className="border p-3 w-full rounded"
          value={publish.category}
          onChange={(e) =>
            setPublish({ ...publish, category: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Image URL"
          className="border p-3 w-full rounded"
          value={publish.img_url}
          onChange={(e) =>
            setPublish({ ...publish, img_url: e.target.value })
          }
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded w-full"
          disabled={publishing}
        >
          {publishing ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
}
