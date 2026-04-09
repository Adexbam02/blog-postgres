"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuthUser } from "@/hooks/useAuthUser";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserPosts } from "@/hooks/useUserPosts";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary ";

export default function EditProfilePage() {
  const router = useRouter();
  const { userId, username } = useAuthUser();
  const { formData, setFormData } = useUserProfile(username);
  useUserPosts(userId); // posts available if needed later

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      let profileUrl = formData.profile_picture_url;
      let bannerUrl = formData.banner_picture_url;

      if (imageFile) {
        profileUrl = await uploadToCloudinary(imageFile);
      }

      if (bannerImageFile) {
        bannerUrl = await uploadToCloudinary(bannerImageFile);
      }

      const res = await fetch("http://localhost:5000/user/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          bio: formData.bio,
          profile_picture_url: profileUrl,
          banner_picture_url: bannerUrl,
        }),
      });

      const data = await res.json();
      alert(data.message || "Profile updated successfully");
      router.push("/");
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  return (
    <div className="grid grid-cols-4">
      <div />
      <div className="col-span-2 border-x border-black/30 h-screen px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />

          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

          <input name="email" value={formData.email} onChange={handleChange} />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBannerImageFile(e.target.files?.[0] ?? null)}
          />

          <textarea name="bio" value={formData.bio} onChange={handleChange} />

          <button type="submit">Save Changes</button>
        </form>
      </div>
      <div />
    </div>
  );
}
