"use client";
import { useState } from "react";
import { Ellipsis, Trash, PenLine } from "lucide-react";


const delePost = async (id: number) => {
  try {
    const res = await fetch(`http://localhost:5000/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);

    if (!res.ok) throw new Error(data.error || "Failed to delete post");

    console.log("Post deleted!");
  } catch (error) {
    console.error(error);
  }
};


export default function PostMenu({ postId }: { postId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [trash, setTrash] = useState(false);

  return (
    <div className="relative">
      {/* Delete Confirmation Modal */}
      <div
        className={`fixed inset-0 bg-black/60 items-center justify-center ${
          trash ? "flex" : "hidden"
        }`}
      >
        <div className="bg-[#181A2A] w-[500px] h-[200px] rounded-2xl p-5 flex items-center justify-center">
          <Trash size={150} strokeWidth={0.5} className="mr-4" />
          <div className="flex flex-col justify-between h-full">
            <h2 className="font-semibold text-[30px] mb-4 leading-[120%]">
              Are you sure you want to delete this post?
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  delePost(postId);
                  setTrash(false);
                }}
                className="bg-red-500 rounded-lg text-white px-4 py-2 hover:bg-red-600 w-full cursor-pointer flex items-center justify-center gap-3.5"
              >
                <Trash />
                {/* <p>Delete</p> */}
              </button>
              <button
                onClick={() => setTrash(false)}
                className="bg-[#242535] rounded-lg text-white px-4 py-2 hover:bg-[#343a40] w-full cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Button */}
      <Ellipsis className="cursor-pointer" onClick={() => setIsOpen(!isOpen)} />

      {/* Dropdown Menu */}
      <div
        className={`bg-[#181A2A] w-[200px] min-h-[100px] rounded-[5px] absolute top-[30px] right-0 z-50 p-5 flex-col gap-1 ${
          isOpen ? "flex" : "hidden"
        }`}
      >
        <button
          onClick={() => {
            setTrash(true);
            setIsOpen(false);
          }}
          className="bg-[#242535] text-white -[5px] px-4 py-2 hover:bg-[#343a40] w-full cursor-pointer flex items-center gap-3.5 justify-between"
        >
          <Trash strokeWidth={1.25} />
          <p>Delete</p>
        </button>
        <button className="bg-[#242535] text-white -[5px] px-4 py-2 hover:bg-[#343a40] w-full cursor-pointer flex items-center gap-3.5 justify-between">
          <PenLine strokeWidth={1.25} />
          <p>Edit Post</p>
        </button>
      </div>
    </div>
  );
}
