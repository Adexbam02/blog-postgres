import { useEffect, useState } from "react";

export default function UserStats({ userId }: { userId: number }) {
  const [totalViews, setTotalViews] = useState<number | null>(null);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/user/views/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch total views");
        const data = await res.json();
        setTotalViews(data.totalViews);
      } catch (err) {
        console.error(err);
      }
    };

    fetchViews();
  }, [userId]);

  if (totalViews === null) return <p>&mdash;</p>;

  return <span>{totalViews}</span>;
}
