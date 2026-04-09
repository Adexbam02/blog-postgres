"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Logo, Profile, searchIcon } from "../../public/imgs/imgs";
import { NavMenu } from "../../public/data";
import Router from "next/router";
import { radioCanadaBig, sourceSerifPro } from "@/fonts/fonts";

type DecodedToken = {
  username: string;
  profile_picture_url: string;
  email: string;
  exp: number;
};

function NavbarCopy() {
  const router = Router;
  const [openTab, setOpenTab] = useState(false);
  const [decodedUser, setDecodedUser] = useState<DecodedToken | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const toggleTab = () => setOpenTab(!openTab);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const decoded: DecodedToken = jwtDecode(token);

      // Check if token expired
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return;
      }

      setDecodedUser(decoded);
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched user data:", data);
        setDecodedUser({
          username: data.username || "",
          profile_picture_url: data.profile_picture_url || "",
          email: data.email || "",
          exp: data.exp || 0, // You might want to handle exp differently
        });
      }
    };
    fetchProfile();
  }, []);

  return (
    <nav className="w-full flex items-center justify-between gap-12 md:px-[] md:py-2.5">
      {/* LOGO */}

      <div className="flex items-center justify-center gap-1">
        <Link href={`/`} className={`${radioCanadaBig.className} text-[20px]`}>
          MetaBlog
        </Link>
      </div>

      {/* MENU */}
      <div
        className={`${sourceSerifPro.className} text-[18px] md:text-[20px] tracking-[-3%] md:tracking-[-4%] text-black flex-1 flex items-center justify-center gap-5`}
      >
        {NavMenu.map((item, index) => (
          <Link key={index} href={item.link} className="text-nowrap">
            {item.name}
          </Link>
        ))}
      </div>

      {/* SEARCH + USER */}
      <div className="flex items-center justify-center">
        {/* <form
          action="#"
          className="bg-[#242535] rounded-[5px] p-1 flex items-center gap-2 mr-4"
        >
          <input
            type="text"
            name="search"
            id="search"
            className="outline-none bg-[#52525B] rounded-[5px] px-2 py-1 text-white"
            placeholder="Search..."
          />
          <button type="submit" className="cursor-pointer">
            <Image src={searchIcon} alt="Search" width={20} height={20} />
          </button>
        </form> */}

        {/* USER PROFILE */}
        <div className="flex flex-col relative">
          <div
            className="w-[30px]  h-[30px] rounded-full bg-white flex items-center justify-center cursor-pointer"
            onClick={toggleTab}
          >
            <Image
              src={decodedUser?.profile_picture_url || Profile}
              alt="Profile"
              fill
              className="object-cover rounded-full border border-amber-50"
            />
          </div>

          <div
            className={`bg-[#181A2A] w-[200px] min-h-[150px] max-h-fit rounded-[10px] absolute top-[40px] right-0 z-50 p-5 flex-col gap-4 ${
              openTab ? "flex" : "hidden"
            }`}
          >
            {decodedUser ? (
              <>
                <p className="text-white text-sm">
                  Signed in as <b>{decodedUser.username}</b>
                </p>
                <Link
                  href={`/${decodedUser.username.toLowerCase()}`}
                  className="bg-[#242535] text-white rounded-[5px] px-4 py-2 hover:bg-[#343a40]"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload();
                    router.push("/");
                  }}
                  className="bg-red-500 text-white rounded-[5px] px-4 py-2 hover:bg-red-600 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/sign-in"
                className="bg-[#242535] text-white rounded-[5px] px-4 py-2 hover:bg-[#343a40]"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarCopy;
