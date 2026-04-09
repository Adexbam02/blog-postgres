"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Github, Google } from "../../../public/imgs/imgs";

function Page() {
  const route = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
   e.preventDefault();
    setIsLoading(true);
    setError("");

    const apiUrl = process.env.API_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); // Get response body

      // Check if the response was an error
      if (!response.ok) {
        // Use data.error (from your backend)
        throw new Error(data.error || "Failed to sign in");
      }

      // ---- THIS IS THE MOST IMPORTANT FIX ----
      // Save the token to "log the user in"
      localStorage.setItem("token", data.token);
      // ----------------------------------------

      console.log("✅ Logged in:", data.message);

      // Redirect to the user's page
      // route.push(`/${data.username}`);
      // route.push(`/${`write`}`);
      route.push(`/${``}`);
      
    } catch (error: any) {
      console.error(error);
      setError(error.message || "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:grid grid-cols-2 md:p-5 gap-15 flex items-center justify-center flex-col max-h-screen">
      <div className="w-full rounded-3xl bg-cover bg-center bg-no-repeat"></div>

      <div className="w-full px-25 py-15">
        <div className="flex flex-col gap-2 max-w-[70%]">
          <h1 className="text-2xl font-medium">Welcome Back</h1>
          <p className="text-gray-500">
            Sign in to continue sharing your thoughts and exploring the community.
          </p>
        </div>
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 mt-6 "
        >
          <span className="flex flex-col items-start gap-2">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              type="email"
              name="email"
              placeholder="ngaruba@gmail.com"
              required
              className="w-full outline-none bg-transparent border focus- border-gray-500 p-[7px] rounded-[6px] text-black"
            />
          </span>

          <span className="flex flex-col items-start gap-2">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full outline-none bg-transparent border focus- border-gray-500 p-[7px] rounded-[6px] text-black"
            />
          </span>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        <div className="flex flex-col items-center justify-center mt-2.5 gap-2.5">
          <p className="text-gray-400 text-sm">or continue with</p>
          <div className="flex items-center gap-3">
            <button className="cursor-pointer" type="button">
              <Image
                src={Google}
                alt="Google"
                className="w-[30px] h-[30px] object-contain"
              />
            </button>
            <button className="cursor-pointer" type="button">
              <Image
                src={Github}
                alt="Github"
                className="w-[30px] h-[30px] object-contain"
              />
            </button>
          </div>
          <span className="text-gray-400 text-sm flex items-center gap-2">
            <p>Don&apos;t have an account?</p>
            <Link href="/sign-up" className="text-blue-500">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Page;
