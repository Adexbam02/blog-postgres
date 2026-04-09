"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { modules, formats } from "../../utils/quillFormat";
import { castoroTitling } from "@/fonts/fonts";

type DecodedToken = {
  id: number;
  username: string;
  email: string;
  exp: number;
};

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

function Page() {
  const router = useRouter();
  const [publish, setPublish] = useState({
    title: "",
    author: "",
    content: "",
    category: "",
    img_url: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [publishing, setPublishing] = useState(false);

  //  Check if user is logged in before showing page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/sign-in");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);

      // Token expired check
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.push("/sign-in");
        return;
      }

      // Automatically set author from token
      setPublish((prev) => ({ ...prev, author: decoded.username }));
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      router.push("/sign-in");
    }
  }, [router]);

  const publishPost = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!publish.title.trim() || !publish.content.trim()) return;

    setPublishing(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to publish a post!");
      router.push("/sign-in");
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

    let finalImageUrl = publish.img_url;

    if (imageFile) {
      try {
        // Create a new FormData just for Cloudinary
        const cloudFormData = new FormData();
        cloudFormData.append("file", imageFile);
        cloudFormData.append("upload_preset", "ml_default"); // <-- PUT YOUR PRESET NAME HERE

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/dmr4gb8mj/image/upload`, // <-- PUT YOUR CLOUD NAME HERE
          {
            method: "POST",
            body: cloudFormData,
          },
        );

        const cloudData = await cloudRes.json();
        if (cloudData.secure_url) {
          finalImageUrl = cloudData.secure_url; // Get the public URL from Cloudinary
        } else {
          throw new Error("Cloudinary upload failed");
        }
      } catch (err: any) {
        console.error("Error uploading to Cloudinary:", err.message);
        setPublishing(false);
        return; // Stop if image upload fails
      }
    }

    // 2. --- SEND THE FINAL URL TO YOUR BACKEND ---
    try {
      // Now your backend just receives JSON, not FormData
      const response = await fetch(`${apiUrl}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: publish.title,
          content: publish.content,
          author: publish.author,
          category: publish.category,
          img_url: finalImageUrl, // Send the Cloudinary URL or preset URL
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to publish post");
      }

      router.push("/");
    } catch (error: any) {
      console.error("Error publishing post:", error.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans text-gray-900 selection:bg-indigo-500/30">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#fafafa]/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-800 transition-colors font-medium"
          >
            &larr; Back
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <span className="text-xs font-bold tracking-[0.15em] text-gray-400 uppercase bg-gray-100 px-3 py-1 rounded-full">
            Draft
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-gray-400 hidden md:block">
            Unsaved changes
          </span>
          <button
            onClick={() => publishPost()}
            disabled={publishing || !publish.title.trim()}
            className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {publishing ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row gap-8 px-6 py-10">
        {/* EDITOR AREA */}
        <div className="flex-1 w-full max-w-[850px] mx-auto bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-14 md:px-16">
          <input
            type="text"
            onChange={(e) => setPublish({ ...publish, title: e.target.value })}
            value={publish.title}
            placeholder="Article Title..."
            className={`w-full text-5xl md:text-[56px] font-extrabold text-gray-900 placeholder:text-gray-300 border-none outline-none bg-transparent mb-10 leading-tight tracking-tight ${castoroTitling.className}`}
            required
          />

          <div className="w-full min-h-[500px]">
            {/* Global CSS overrides for ReactQuill to make it completely seamless and distraction-free */}
            <style>{`
               .ql-toolbar.ql-snow { border: none !important; border-bottom: 2px solid #f3f4f6 !important; padding: 0 0 1rem 0 !important; font-family: inherit; margin-bottom: 1.5rem; }
               .ql-container.ql-snow { border: none !important; font-size: 1.125rem !important; font-family: inherit; }
               .ql-editor { padding: 0 !important; line-height: 1.8 !important; color: #374151 !important; min-height: 500px; }
               .ql-editor.ql-blank::before { color: #d1d5db !important; font-style: normal !important; left: 0 !important; font-size: 1.25rem; font-weight: 300; }
               .ql-editor h1, .ql-editor h2, .ql-editor h3 { font-weight: 800; color: #111827; margin-top: 2rem; margin-bottom: 1rem; }
               .ql-editor p { margin-bottom: 1.5rem; }
             `}</style>
            <ReactQuill
              theme="snow"
              modules={modules}
              formats={formats}
              value={publish.content}
              onChange={(value) => setPublish({ ...publish, content: value })}
              placeholder="Tell your story..."
              className="w-full"
            />
          </div>
        </div>

        {/* POST SETTINGS SIDEBAR */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="sticky top-[100px] space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-8">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-5">
                Post Settings
              </h3>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
                  Category
                </label>
                <input
                  type="text"
                  onChange={(e) =>
                    setPublish({ ...publish, category: e.target.value })
                  }
                  value={publish.category}
                  placeholder="e.g. Technology, Lifestyle"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-medium placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
                  Cover Image
                </label>
                <div className="relative overflow-hidden w-full h-[180px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImageFile(e.target.files ? e.target.files[0] : null)
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                    required={!publish.img_url}
                  />
                  {imageFile ? (
                    <div className="absolute inset-0 p-3 bg-white z-0">
                      <div className="w-full h-full bg-indigo-50/50 rounded-xl flex flex-col items-center justify-center border border-indigo-100/50 p-4 text-center">
                        <svg
                          className="w-10 h-10 text-indigo-500 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm font-semibold text-indigo-900 truncate w-full px-2">
                          {imageFile.name}
                        </span>
                        <span className="text-xs text-indigo-600 mt-1 font-medium">
                          Ready to upload
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center px-6 text-center">
                      <svg
                        className="w-10 h-10 text-gray-400 group-hover:text-gray-600 transition-colors mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <span className="text-sm font-bold text-gray-600">
                        Click to upload image
                      </span>
                      <span className="text-xs text-gray-400 mt-1 font-medium">
                        PNG or JPG up to 5MB
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
                  Post Author
                </label>
                <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-600 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 text-sm font-black shadow-sm">
                    {publish.author ? publish.author[0].toUpperCase() : "?"}
                  </div>
                  <span className="font-bold text-gray-800">
                    {publish.author || "Loading..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
