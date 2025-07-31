"use client";
import { useState } from "react";

export default function ProjectForm({
  token,
  onAdd,
}: {
  token: string;
  onAdd: (project: any) => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Project name cannot be empty");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:7777/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      console.log("Project add response:", data);
      if (!res.ok) {
        throw new Error(data.error || "Failed to add project");
      }
      setName("");
      onAdd(data); // Pass the new project to parent
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4 items-center">
      <input
        type="text"
        placeholder="New project"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="min-w-[90px] px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-md hover:from-orange-400 hover:to-purple-600 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading || !name.trim()}
      >
        {loading ? (
          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ) : (
          "+ Add"
        )}
      </button>
      {error && <div className="text-red-600 ml-2 font-semibold">{error}</div>}
    </form>
  );
}
