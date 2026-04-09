"use client";

import { useEffect, useState } from "react";

export type UserProfileForm = {
  username: string;
  email: string;
  bio: string;
  profile_picture_url: string;
  banner_picture_url: string;
};

export function useUserProfile(username: string) {
  const [formData, setFormData] = useState<UserProfileForm>({
    username: "",
    email: "",
    bio: "",
    profile_picture_url: "",
    banner_picture_url: "",
  });

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/user/profile/${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) return;

      const data = await res.json();

      setFormData({
        username: data.username ?? "",
        email: data.email ?? "",
        bio: data.bio ?? "",
        profile_picture_url: data.profile_picture_url ?? "",
        banner_picture_url: data.banner_picture_url ?? "",
      });
    };

    fetchProfile();
  }, [username]);

  return { formData, setFormData };
}
