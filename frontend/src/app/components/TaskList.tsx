"use client";
import { useEffect, useState } from "react";

export default function TaskList({
  token,
  projectId,
  filter = "all",
  tasks: propTasks,
  onTaskUpdate,
}: {
  token: string;
  projectId?: string;
  filter?: string;
  tasks?: any[];
  onTaskUpdate?: () => void;
}) {
  // Use tasks from parent props, don't maintain internal state
  const tasks = propTasks || [];

  const toggleComplete = async (task: any) => {
    await fetch(`http://localhost:7777/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: !task.completed }),
    });
    // Notify parent to refresh tasks
    if (onTaskUpdate) {
      onTaskUpdate();
    }
  };

  const deleteTask = async (id: number) => {
    await fetch(`http://localhost:7777/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    // Notify parent to refresh tasks
    if (onTaskUpdate) {
      onTaskUpdate();
    }
  };

  let filteredTasks = tasks;
  if (projectId) {
    filteredTasks = filteredTasks.filter(
      (t) => String(t.projectId) === String(projectId)
    );
  }
  if (filter === "active") {
    filteredTasks = filteredTasks.filter((t) => !t.completed);
  } else if (filter === "completed") {
    filteredTasks = filteredTasks.filter((t) => t.completed);
  }

  if (!filteredTasks.length)
    return <div className="text-gray-500 text-center py-4">No tasks yet.</div>;

  return (
    <ul className="list-none p-0 m-0 space-y-3">
      {filteredTasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-purple-50 border border-purple-200 rounded-xl shadow-sm p-3 transition-all duration-200 hover:shadow-md hover:border-purple-400"
        >
          <span
            className={`flex-1 text-lg text-gray-800 cursor-pointer select-none transition-colors duration-200 ${
              task.completed ? "line-through text-gray-400" : ""
            }`}
            onClick={() => toggleComplete(task)}
            title={task.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.completed ? "✅ " : "⬜ "}
            {task.title}
          </span>
          <button
            className="bg-none border-none text-red-500 cursor-pointer text-xl ml-4 transition-colors duration-200 hover:text-red-700"
            onClick={() => deleteTask(task.id)}
            title="Delete task"
          >
            🗑️
          </button>
        </li>
      ))}
    </ul>
  );
}
