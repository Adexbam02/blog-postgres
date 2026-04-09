"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  id: number;
  username: string;
  email: string;
  exp: number;
};

export function useAuthUser() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/sign-in");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.push("/sign-in");
        return;
      }

      setUserId(decoded.id);
      setUsername(decoded.username);
    } catch {
      localStorage.removeItem("token");
      router.push("/sign-in");
    }
  }, [router]);

  return { userId, username };
}
