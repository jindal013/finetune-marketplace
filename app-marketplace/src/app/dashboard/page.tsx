"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Dashboard() {
  const tasks = useQuery(api.tasks.get);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Dashboard Page</h1>
      <div className="max-w-md w-full">
        <h2 className="text-xl mb-4">Your Tasks</h2>
        {tasks === undefined ? (
          <p>Loading...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task._id} className="p-3 bg-gray-800 rounded-md">
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-gray-400 mt-1">{task.text}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
