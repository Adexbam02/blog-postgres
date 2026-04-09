"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Github, Google, SignUpBg } from "../../../public/imgs/imgs";
import Link from "next/link";

function page() {
  const route = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const Register = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register");
      }
      const data = await response.json();

      console.log(data);
      route.push(`/${formData.username}`); // Redirect to user's page after successful registration
    } catch (error: any) {
      console.error(error);
      setError(error.message || "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:grid grid-cols-2 md:p-5 gap-15 flex items-center justify-center flex-col max-h-screen">
      <div className="w-full  rounded-3xl bg-cover bg-center bg-no-repeat"></div>

      <div className="w-full px-25 py-15">
        <div className="flex flex-col gap-2 max-w-[70%]">
          <h1 className="text-2xl font-medium">Create Account</h1>
          <p className="text-gray-500">
            Welcome to our community! Join us and share your thoughts with the
            world.
          </p>
        </div>
        <form
          action=""
          method="post"
          className="flex flex-col gap-4 mt-6 "
          onSubmit={Register}
        >
          <span className="flex flex-col items-start gap-2">
            <label htmlFor="username">Username</label>
            <input
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value.trim() })
              }
              type="text"
              name="username"
              placeholder="Nurain"
              required
              className=" w-full  outline-none bg-transparent border focus- border-gray-500 p-[7px] rounded-[6px] text-black"
            />
          </span>
          <span className="flex flex-col items-start gap-2">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value.trim() })
              }
              type="email"
              name="email"
              placeholder="ngaruba@gmail.com"
              required
              className=" w-full  outline-none bg-transparent border focus- border-gray-500 p-[7px] rounded-[6px] text-black"
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
              className=" w-full  outline-none bg-transparent border focus- border-gray-500 p-[7px] rounded-[6px] text-black"
            />
          </span>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        <div className="flex flex-col items-center justify-center mt-2.5 gap-2.5">
          <p className="text-gray-400 text-sm">or continue with</p>
          <div className="flex items-center gap-3">
            <button className="cursor-pointer">
              <Image
                src={Google}
                alt="Google"
                className="w-[30px] h-[30px] object-contain"
              />
            </button>
            <button className="cursor-pointer">
              <Image
                src={Github}
                alt="Github"
                className="w-[30px] h-[30px] object-contain"
              />
            </button>
          </div>
          <span className="text-gray-400 text-sm flex items-center gap-2">
            <p>Already have an account?</p>
            <Link href="/login" className="text-blue-500">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default page;
