"use client";
import { useState } from "react";

export default function TaskForm({
  token,
  projects,
  onAdd,
}: {
  token: string;
  projects: any[];
  onAdd: (task: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title cannot be empty");
      return;
    }
    if (!projectId) {
      setError("Please select a project");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:7777/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, projectId: Number(projectId) }),
      });
      const data = await res.json();
      console.log("Task add response:", data);
      if (!res.ok) {
        throw new Error(data.error || "Failed to add task");
      }
      setTitle("");
      onAdd(data); // Pass the new task to parent
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (!projects.length) {
    return (
      <div className="text-purple-600 mb-4 font-medium">
        Create a project first to add tasks.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4 items-center">
      <input
        type="text"
        placeholder="New task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      <select
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        className="rounded-lg border-2 border-purple-600 px-4 py-2 font-semibold bg-gradient-to-r from-gray-50 to-purple-50 text-gray-800 shadow-sm transition-all duration-200 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        required
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="min-w-[90px] px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-md hover:from-orange-400 hover:to-purple-600 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading || !title.trim()}
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
