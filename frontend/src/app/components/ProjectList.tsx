"use client";
import { useEffect, useState } from "react";

export default function ProjectList({
  token,
  onChange,
}: {
  token: string;
  onChange: () => void;
}) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:7777/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProjects(data);
    setLoading(false);
    onChange && onChange();
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  const deleteProject = async (id: number) => {
    await fetch(`http://localhost:7777/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProjects();
  };

  if (loading)
    return (
      <div className="text-gray-500 text-center py-4">Loading projects...</div>
    );
  if (!projects.length)
    return (
      <div className="text-gray-500 text-center py-4">No projects yet.</div>
    );

  return (
    <ul className="list-none p-0 m-0 space-y-3">
      {projects.map((project) => (
        <li
          key={project.id}
          className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-200 rounded-xl shadow-sm p-3 transition-all duration-200 hover:shadow-md hover:border-blue-400"
        >
          <span className="flex-1 text-lg text-gray-800 select-none">
            📁 {project.name}
          </span>
          <button
            className="bg-none border-none text-red-500 cursor-pointer text-xl ml-4 transition-colors duration-200 hover:text-red-700"
            onClick={() => deleteProject(project.id)}
            title="Delete project"
          >
            🗑️
          </button>
        </li>
      ))}
    </ul>
  );
}
