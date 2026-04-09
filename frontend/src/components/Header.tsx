"use client";
import Image from "next/image";
import {
  Christiana,
  DesktopHero,
  EnergyConsupDesktop,
  User,
} from "../../public/imgs/imgs";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import { geistMono, radioCanadaBig, sourceSerifPro } from "../fonts/fonts";
import Headers from "./Headers";
import Value from "./Value";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Post {
  category: string;
  title: string;
  slug: string;
  author: string;
  name: string;
  profile_picture_url: string;
  img_url: string;
  created_at: string;
}

function Header() {
  const [data, setData] = useState<Post | null>(null);
  useEffect(() => {
    const getHeading = async () => {
      try {
        const response = await fetch(`${apiUrl}/posts/most-liked`);
        if (!response.ok) throw new Error("Failed to fetch");
        const [postData] = await response.json();
        setData(postData);
      } catch (error) {
        console.error("Error fetching most liked posts:", error);
      }
    };

    getHeading();
  }, []);

  return (
    <>
      <Headers />
      {/* <Value /> */}
      {/* <header className=" md:min-h-screen md:px-[150px] md:py-8 flex items-center justify-center overflow-hiden">
        <div className="relative w-full h-fit flex items-center justify-center">
          <div className="w-full h-[600px] overflow-hidden rounded-2xl bg-gray-950 relative">
            <Image
              src={data?.img_url || Christiana}
              alt="Christiana"
              fill
              className="object-cover"
            />
          </div>

          <Link href={`/${data?.author.toLowerCase()}/${data?.slug}`}>
            <div className="flex flex-col items-start justify-center gap-4 bg-[#181A2A] rounded-xl p-10 border border-[#242535] shadow-md absolute mb-10 -bottom-[30%] right-[40%] ">
              <h3 className="p-2 rounded-md bg-[#4B6BFB] text-white font-medium">
                {data?.category}
              </h3>

              <h1 className="font-semibold text-[36px] text-white leading-[100%] max-w-[450px]">
                {data?.title}
              </h1>

              <div>
                <span>
                  <Image
                    src={data?.profile_picture_url || User}
                    alt="Author"
                    width={40}
                    height={40}
                    className="rounded-full  w-[50px] h-[50px] flex items-center justify-center shrink-0 inline-block mr-2"
                  />
                  <span className="text-white ">
                    {data?.author || "Unknown Author"}
                  </span>
                </span>
                <span className="text-gray-400 ml-4">
                  {data
                    ? new Date(data.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown Date"}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </header> */}
    </>
  );
}

export default Header;
