"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export type DecodedToken = {
  username: string;
  profile_picture_url: string;
  email: string;
  exp: number;
};

export function useAuth() {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // First decode the token to check expiry
        const decoded: DecodedToken = jwtDecode(token);
        
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setLoading(false);
          return;
        }

        // Fetch fresh user data from API
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser({
            username: data.username || "",
            profile_picture_url: data.profile_picture_url || "",
            email: data.email || "",
            exp: decoded.exp, // Use exp from token
          });
        } else {
          // Token invalid, remove it
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Auth error:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, loading, logout };
}