"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-orange-400">
      <div className="bg-white/85 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
          Todoist Lite
        </h1>
        <div className="flex justify-center gap-4">
          <a
            href="/login"
            className="w-32 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg rounded-lg shadow-md hover:from-orange-400 hover:to-purple-600 transition-all duration-200 hover:shadow-lg text-center inline-block"
          >
            Login
          </a>
          <a
            href="/signup"
            className="w-32 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg rounded-lg shadow-md hover:from-orange-400 hover:to-purple-600 transition-all duration-200 hover:shadow-lg text-center inline-block"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
