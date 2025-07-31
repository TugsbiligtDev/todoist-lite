"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:7777/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      // Auto-login after signup
      const loginRes = await fetch("http://localhost:7777/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.error || "Login failed");
      localStorage.setItem("token", loginData.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-orange-400">
      <div className="bg-white/85 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg rounded-lg shadow-md hover:from-orange-400 hover:to-purple-600 transition-all duration-200 hover:shadow-lg"
          >
            Sign Up
          </button>
          {error && (
            <div className="text-red-600 text-center mt-2">{error}</div>
          )}
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-600 hover:text-purple-800 font-semibold"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
