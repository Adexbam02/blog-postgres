"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { modules, formats } from "../../utils/quillFormat";
import NavbarCopy from "@/components/NavbarCopy";
import NavbarWrite from "@/components/NavbarWrite";

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

  const publishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to publish a post!");
      router.push("/sign-in");
      return;
    }
    const apiUrl = process.env.API_URL || "http://127.0.0.1:5000";
    // const apiUrl = process.env.API_URL || "http://localhost:5000";

    // Create FormData
    const formData = new FormData();
    formData.append("title", publish.title);
    formData.append("content", publish.content);
    formData.append("category", publish.category);
    formData.append("author", publish.author);

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
          "Content-Type": "application/json", // <-- CHANGE THIS BACK TO JSON
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

      // ... (rest of your success logic)
      router.push("/");
    } catch (error: any) {
      console.error("Error publishing post:", error.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className=" md:min-h-screen md:px-[150p] md:py-8 flex justify-center overflow-hidden bg-[242535] flex-col md:grid grid-cols-5">
      {/* <NavbarWrite /> */}
      <div className="bg-gray-400">a</div>
      <div className="w-full px-[10px] md:col-span-3 flex flex-col items-center">
        <div className="w-full bg-red400 h-[40px] flex items-center justify-end p2">
          <span className="w-fit h-fit py-1 px-2 bg-black flex items-center justify-center text-white font-medium">
            <h1>Draft</h1>
          </span>
        </div>
        <form className="w-full" onSubmit={publishPost}>
          <textarea
            onChange={(e) => setPublish({ ...publish, title: e.target.value })}
            value={publish.title}
            name="title"
            placeholder="Title"
            className="min-w-full max-h-[70px] text-[30px] p-[20px] outline-none border-b-2 bg-[181A2A] 
          border-[#e0e1e5]/20 overflow-hidden resize-none leading-[100%] placeholder:text-gray-500"
            required
          ></textarea>

          {/* <div className="mt-5 flex items-start justify-start w-full gap-0"> */}
          <div className="w-full min-h-[450px] max-h-[400px] bg-[181A2A] outline-none border-b-2  border-[#e0e1e5]/20 pb-5">
            <ReactQuill
              theme="snow"
              modules={modules}
              formats={formats}
              value={publish.content}
              onChange={(value) => setPublish({ ...publish, content: value })}
              placeholder="Write your story..."
              className="custom-quill w-full h-screen text-white text-[18px] bg-white"
            />
          </div>
          {/* </div> */}

          <input
            type="hidden"
            name="author"
            value={publish.author}
            className="mt-5 w-full cursor-pointer bg-[#181A2A] border-b-2 border-[#e0e1e5]/20 text-white p-5 outline-none" // Added basic styling
            required
          />

          <div className="flex w-full items-center justify-between">
            <div className="mt-5">
              <input
                onChange={(e) =>
                  setPublish({ ...publish, category: e.target.value })
                }
                value={publish.category}
                name="category"
                type="text"
                placeholder="Category (e.g., Lifestyle)"
                required
                className="text-white text-[16px] p-2.5 outline-none border-b-2 bg-[#181A2A] border-[#e0e1e5]/20 resize-none"
              />

              {/* Image selection */}
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) =>
                  setImageFile(e.target.files ? e.target.files[0] : null)
                }
                className="mt-2.5 text-white  text-[16px] p-2.5 outline-none border-b-2 bg-[#181A2A] border-[#e0e1e5]/20 resize-none ml-1.5 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="mt-5 cursor-pointer bg-[#181A2A] border-b-2 border-[#e0e1e5]/20 text-white p-2.5 outline-none whitespace-nowrap"
            >
              {publishing ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-black h-screen">b</div>
    </div>
  );
}

export default Page;
