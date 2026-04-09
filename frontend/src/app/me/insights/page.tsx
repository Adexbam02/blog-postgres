"use client";
// import  {getUserViewGrowthToday} from "./../../../../../backend/src/services/getUserViewGrowthToday"

import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import NavbarCopy from "@/components/NavbarCopy";
import { geistMono, radioCanadaBig, sourceSerifPro } from "@/fonts/fonts";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DesktopHero } from "../../../../public/imgs/imgs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import UserStats from "./UserStat";
import { getTimeOfDay } from "@/utils/getTimeOfDay";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import PercentageIncrease from "./PercentageIncrease";

type DecodedToken = {
  userId: number;
  username: string;
  email: string;
  exp: number;
};

type PublicUser = {
  id: number;
  username: string;
  followers: number;
  following: number;
};

type FollowersProps = {
  followers: number;
  followersGrowthLast30Minutes: number;
  followersGrowthPercentage: number;
  followersLostLast30Minutes: number;
  followersLostPercentage: number;
};

async function getUserPublicProfile(
  username: string
): Promise<PublicUser | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${apiUrl}/user/profile/${username}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

async function getFollowersStat(
  username: string
): Promise<FollowersProps | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${apiUrl}/user/followers/growth/${username}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default function InsightsPage() {
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [followersStat, setFollowersStat] = useState<FollowersProps | null>(
    null
  );

  const [loadingUser, setLoadingUser] = useState(true);
  // const params = useParams();
  // const username = params.username as string;
  const [decoded, setDecoded] = useState<DecodedToken | null>(null);
  //  Check if user is logged in before showing page
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/sign-in");
      return;
    }

    try {
      // console.log("RAW TOKEN:", token);
      const decodedToken: DecodedToken = jwtDecode(token);
      // console.log("DECODED TOKEN PAYLOAD:", {
      //   userId: decodedToken.userId,
      //   username: decodedToken.username,
      //   email: decodedToken.email,
      //   exp: decodedToken.exp,
      //   expiresAt: new Date(decodedToken.exp * 1000).toLocaleString(),
      // });
      // // Token expired check
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.push("/sign-in");
        return;
      }

      setDecoded(decodedToken);
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      router.push("/sign-in");
    }
  }, [router]);

  // Safe rendering
  // if (!decoded) return <p>Loading...</p>;

  const data = [
    { date: "Feb 1", value: 70 },
    { date: "Feb 2", value: 75 },
    { date: "Feb 3", value: 82 },
    { date: "Feb 4", value: 88 },
    { date: "Feb 5", value: 95 },
    { date: "Feb 6", value: 92 },
    { date: "Feb 7", value: 105 },
    { date: "Feb 8", value: 110 },
    { date: "Feb 9", value: 115 },
    { date: "Feb 10", value: 120 },
    { date: "Feb 11", value: 125 },
    { date: "Feb 12", value: 130 },
    { date: "Feb 13", value: 135 },
    { date: "Feb 14", value: 145 },
    { date: "Feb 15", value: 150 },
    { date: "Feb 16", value: 155 },
    { date: "Feb 17", value: 160 },
    { date: "Feb 18", value: 165 },
    { date: "Feb 19", value: 175 },
    { date: "Feb 20", value: 180 },
    { date: "Mar 1", value: 185 },
    { date: "Mar 5", value: 190 },
    { date: "Mar 10", value: 195 },
    { date: "Mar 15", value: 205 },
    { date: "Mar 20", value: 210 },
    { date: "Apr 1", value: 215 },
    { date: "Apr 5", value: 218 },
    { date: "Apr 10", value: 220 },
    { date: "Apr 15", value: 220 },
    { date: "Apr 20", value: 215 },
    { date: "Apr 25", value: 210 },
    { date: "May 1", value: 200 },
  ];

  useEffect(() => {
    if (!decoded?.username) return;

    const fetchProfile = async () => {
      const profile = await getUserPublicProfile(decoded.username);
      setUser(profile);
      setLoadingUser(false);
    };

    fetchProfile();

    const fetchFollowersStat = async () => {
      const stats = await getFollowersStat(decoded.username);
      setFollowersStat(stats);
    };

    fetchFollowersStat();
  }, [decoded]);

  if (!decoded) return <p>Loading...</p>;
  return (
    <div className="md:py-8 min-h-screen bg-[#F6F8FB] flex flex-col gap-6 items-center md:px-[50px] px-4">
      <NavbarCopy />

      <div className="w-full mt-10 flex flex-col  items-start md:items-center justify-between gap-10">
        <div className="w-full mb-10">
          <h1
            className={`${radioCanadaBig.className} text-[36px] md:text-[40px]`}
          >
            Good {getTimeOfDay()}, {capitalizeFirstLetter(decoded.username)}!
          </h1>
          <h3
            className={`${geistMono.className} text-[18px] md:text-[20px] text-gray-300`}
          >
            Your daily impact are ready to review.
          </h3>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-sm p-2 grid grid-cols-2  h-[150px]">
              <span className="flex flex-col items-start justify-between">
                <h3
                  className={`${radioCanadaBig.className} text-[18px] md:text-[20px]`}
                >
                  Views
                </h3>

                <h1
                  className={`${geistMono.className} text-[36px] md:text-[40px] font-medium`}
                >
                  {/* 0% */}
                  <PercentageIncrease userId={decoded.userId} />
                  <p className="text-[10px] flex">
                    Total views: <UserStats userId={decoded.userId} />
                  </p>
                </h1>
              </span>

              <div className="bg-yellow-300"></div>
            </div>

            <div className="bg-white rounded-sm p-2 flex flex-col justify-between h-[150px]">
              <span className="flex flex-col items-start justify-between h-full">
                <h3
                  className={`${radioCanadaBig.className} text-[18px] md:text-[20px]`}
                >
                  Followers
                </h3>

                <div className="flex justify-between items-start w-full">
                  <h1
                    className={`${geistMono.className} text-[36px] md:text-[40px] font-medium leaing-0`}
                  >
                    {followersStat?.followers}
                  </h1>
                  <span className="flex flex-col items-end">
                    <small
                      className={`${geistMono.className} text-[14px] md:text-[16px] text-green-500`}
                    >
                      {followersStat?.followersGrowthPercentage.toFixed(2)}
                      &#9650;
                    </small>
                    <small
                      className={`${geistMono.className} text-[14px] md:text-[16px] text-red-500/20`}
                    >
                      {followersStat?.followersLostPercentage.toFixed(2)}&#9660;
                    </small>
                  </span>
                </div>
              </span>
            </div>

            <div className="bg-white rounded-sm p-2 grid grid-cols-2 flex-col justify-between gap-3 h-[150px]">
              <Image
                src={DesktopHero}
                alt="Hero"
                className="object-cover rounded-md"
              />

              <div className="flex flex-col items-start justify-between">
                <h2
                  className={`${radioCanadaBig.className} text-[10px] md:text-[15px] bg-amber-300 rounded-full w-fit py-1 px-3`}
                >
                  Top Post
                </h2>
                <h2
                  className={`${sourceSerifPro.className} text-md font-medium`}
                >
                  The Civilisation of the Unknown
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start bg-white p-7 outline-none w-full gap-5 ">
          <p className={`${geistMono.className} text-[14px] md:text-[18px]`}>
            Followers Trends
          </p>
          <ResponsiveContainer width="100%" height={300} className={`border-0`}>
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="0"
                strikethroughThickness={1}
                vertical={false}
                cursor="default"
              />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#000000"
                barSize={3}
                // cursor="pointer"
                cursor="default"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
