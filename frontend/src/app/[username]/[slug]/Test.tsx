"use client";

import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

import NavbarCopy from "@/components/NavbarCopy";
import { geistMono, radioCanadaBig, sourceSerifPro } from "@/fonts/fonts";
import Image from "next/image";
import { DesktopHero } from "../../../../public/imgs/imgs";
import UserStats from "./UserStat";
import PercentageIncrease from "./PercentageIncrease";
import { getTimeOfDay } from "@/utils/getTimeOfDay";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

type DecodedToken = {
  userId: number;
  username: string;
  exp: number;
};

type PublicUser = {
  id: number;
  username: string;
  followers: number;
  following: number;
};

async function getUserPublicProfile(username: string): Promise<PublicUser | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${apiUrl}/user/profile/${username}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default function InsightsPage() {
  const router = useRouter();

  const [decoded, setDecoded] = useState<DecodedToken | null>(null);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // 🔐 Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/sign-in");
      return;
    }

    try {
      const decodedToken: DecodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.push("/sign-in");
        return;
      }

      setDecoded(decodedToken);
    } catch {
      localStorage.removeItem("token");
      router.push("/sign-in");
    }
  }, [router]);

  // 👤 Fetch public profile
  useEffect(() => {
    if (!decoded?.username) return;

    const fetchProfile = async () => {
      const profile = await getUserPublicProfile(decoded.username);
      setUser(profile);
      setLoadingUser(false);
    };

    fetchProfile();
  }, [decoded]);

  if (!decoded) return <p>Loading...</p>;

  return (
    <div className="md:py-8 min-h-screen bg-[#F6F8FB] flex flex-col gap-6 items-center md:px-[50px] px-4">
      <NavbarCopy />

      <div className="w-full mt-10 flex flex-col gap-10">
        <div>
          <h1 className={`${radioCanadaBig.className} text-[36px]`}>
            Good {getTimeOfDay()}, {capitalizeFirstLetter(decoded.username)}!
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Views */}
          <div className="bg-white p-4 h-[150px]">
            <h3>Views</h3>
            <h1 className={`${geistMono.className} text-[36px]`}>
              <PercentageIncrease userId={decoded.userId} />
              <p className="text-[10px]">
                Total views: <UserStats userId={decoded.userId} />
              </p>
            </h1>
          </div>

          {/* Followers */}
          <div className="bg-white p-4 h-[150px]">
            <h3>Followers</h3>
            <h1 className={`${geistMono.className} text-[36px]`}>
              {loadingUser ? "—" : user?.followers ?? 0}
            </h1>
          </div>

          {/* Top Post */}
          <div className="bg-white p-4 grid grid-cols-2 h-[150px]">
            <Image src={DesktopHero} alt="Hero" className="object-cover" />
            <div>
              <h2 className="bg-amber-300 rounded-full px-3 w-fit">Top Post</h2>
              <h2 className={`${sourceSerifPro.className}`}>
                The Civilisation of the Unknown
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
