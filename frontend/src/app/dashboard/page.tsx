"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import ProjectList from "../components/ProjectList";
import ProjectForm from "../components/ProjectForm";

const FILTERS = ["all", "active", "completed"];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskFilter, setTaskFilter] = useState<string>("all");
  const router = useRouter();

  const fetchProjects = async (token: string) => {
    const res = await fetch("http://localhost:7777/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProjects(data);
    if (data.length && !selectedProject) setSelectedProject(String(data[0].id));
  };

  const fetchTasks = async (token: string) => {
    const res = await fetch("http://localhost:7777/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetch("http://localhost:7777/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          setUser(data.user);
          fetchProjects(token);
          fetchTasks(token);
        }
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [router, refresh]);

  // Add project/task to state immediately after add
  const handleAddProject = (newProject: any) => {
    setProjects((prev) => [newProject, ...prev]);
    setSelectedProject(String(newProject.id));
  };
  const handleAddTask = (newTask: any) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  const token = localStorage.getItem("token")!;

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTasks = totalTasks - completedTasks;

  return (
    <div className="min-h-screen min-w-screen w-screen h-screen flex flex-col bg-gradient-to-br from-blue-400 via-purple-500 to-orange-400">
      <header className="w-full bg-white/90 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
          <span className="text-2xl font-bold text-purple-600 tracking-wide">
            Todoist Lite
          </span>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user.email}</span>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-md hover:from-orange-400 hover:to-purple-600 transition-all duration-200 hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto mt-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects Section */}
          <section className="relative bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-xl p-8 min-h-[480px] border-2 border-purple-200 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-200/20 rounded-full"></div>
            <h3 className="text-xl font-bold text-purple-600 mb-4 relative z-10">
              Projects
            </h3>
            <ProjectForm token={token} onAdd={handleAddProject} />
            <ProjectList
              token={token}
              onChange={() => setRefresh((r) => r + 1)}
            />
          </section>

          {/* Tasks Section */}
          <section className="relative bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl p-8 min-h-[480px] border-2 border-blue-200 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-200/20 rounded-full"></div>
            <h3 className="text-xl font-bold text-blue-600 mb-4 relative z-10">
              Tasks
            </h3>

            {/* Stats */}
            <div className="flex gap-6 font-bold text-blue-600 mb-3">
              <span>Total: {totalTasks}</span>
              <span>Active: {activeTasks}</span>
              <span>Completed: {completedTasks}</span>
            </div>

            {/* Add Task Input First */}
            <TaskForm token={token} projects={projects} onAdd={handleAddTask} />

            {/* Filter Tabs */}
            <div className="flex gap-3 mb-4">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  className={`px-5 py-2 rounded-lg font-bold text-sm border-2 transition-all duration-200 ${
                    taskFilter === f
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-purple-600"
                      : "bg-gray-50 text-purple-600 border-purple-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white"
                  }`}
                  onClick={() => setTaskFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {projects.length > 0 && (
              <div className="mb-3">
                <label htmlFor="project-filter" className="mr-2 text-gray-700">
                  Filter by project:
                </label>
                <select
                  id="project-filter"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-1 bg-gradient-to-r from-gray-50 to-purple-50"
                >
                  {projects.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <TaskList
              token={token}
              projectId={selectedProject}
              filter={taskFilter}
              tasks={tasks.filter(
                (t) => String(t.projectId) === selectedProject
              )}
              onTaskUpdate={() => fetchTasks(token)}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
