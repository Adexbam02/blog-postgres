import { useEffect, useState } from "react";

export default function PercentageIncrease({ userId }: { userId: number }) {
  const [totalViewsInLastOneHr, setTotalViewsInLastOneHr] = useState<
    number | null
  >(null);
  const [totalViews, setTotalViews] = useState<number | null>(null);

  useEffect(() => {
    const fetchIncreaseInViews = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/user/views/growth/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch increase in views");
        const data = await res.json();
        setTotalViewsInLastOneHr(data.totalViewsInLastOneHr);
      } catch (err) {
        console.error(err);
      }
    };

    fetchIncreaseInViews();
  }, [userId]);

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

  if (totalViewsInLastOneHr === null) return <p>&mdash;</p>;
  if (totalViews === null) return <p>&mdash;</p>;

 let calculatedIncrease = 0;

if (totalViews > 0) {
  calculatedIncrease = (totalViewsInLastOneHr / totalViews) * 100;
}

  return <p>{calculatedIncrease.toFixed(2)}%</p>;
}
