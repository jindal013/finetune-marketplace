"use client";

import { ArrowUpDown, Settings, Terminal } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default function TrainerHomePage() {
  const router = useRouter();
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);

  const trainingModelsId = useQuery(api.tasks.getTrainingModels);
  const convexJobs = useQuery(api.tasks.getJobs) || [];
  const updateStatus = useMutation(api.tasks.updateJob);

  let terminalOutput = "";
  const logs = useQuery(api.tasks.getLogs);
  if (logs) {
    terminalOutput = logs.join("\n");
  }

  async function sendPostRequest(
    id: string,
    firebasePath: string
  ): Promise<void> {
    try {
      await updateStatus({
        id: id as Id<"tasks">,
        status: "training",
      });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 300000);

      const response = await fetch('http://100.66.215.153:4200/train', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ "firebase_path": firebasePath, "id": id}),
        signal: controller.signal
      });

      if (!response.ok) {
        await updateStatus({
          id: id as Id<"tasks">,
          status: "queued",
        });
        alert("Failed to start training: " + response.statusText);
        return;
      }

      const data = await response.json();
      console.log("Training started:", data);
      await updateStatus({
        id: id as Id<"tasks">,
        status: "done",
      });
    } catch (error) {
      console.error("Error starting training:", error);
      throw error;
    }
  }

  function floatToDateTime(timestamp: number): string {
    const date = new Date(Math.floor(timestamp));
    return date.toISOString().split("T")[0];
  }

  return (
    <div className="flex h-screen flex-col bg-black overflow-hidden">
      <header className="flex h-14 items-center justify-between border-b border-zinc-800 px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">
            <span className="font-semibold">Project Name Here</span> /{" "}
            <span className="font-normal">Trainer Dashboard</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </header>
      <main className="flex flex-1 p-4 overflow-hidden">
        <div className="flex w-full gap-4">
          {/* Backlogged Jobs */}
          <Card
            className={`border-zinc-800 bg-black text-white w-1/2 transition-all duration-200 ${
              hoveredPanel === "jobs" ? "border-purple-300/60" : ""
            }`}
            onMouseEnter={() => setHoveredPanel("jobs")}
            onMouseLeave={() => setHoveredPanel(null)}
          >
            <div className="p-0">
              <div className="px-6 pt-[-1] pb-1">
                <h2 className="text-2xl font-semibold">Job Board</h2>
                <p className="text-zinc-400 mt-0.5">
                  View and manage training jobs
                </p>
              </div>
              <div className="px-0 pt-5">
                <div className="border border-zinc-800 rounded-md overflow-hidden mx-6">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 border-b border-zinc-800 bg-black px-4 py-3 text-sm font-medium">
                    <div className="flex items-center gap-1">
                      Job Name <ArrowUpDown className="h-3 w-3 ml-1" />
                    </div>
                    <div className="flex items-center">Status</div>
                    <div className="flex items-center gap-1">
                      Date <ArrowUpDown className="h-3 w-3 ml-1" />
                    </div>
                    <div className="flex items-center">Actions</div>
                  </div>

                  {/* Table Body */}
                  {convexJobs && convexJobs.length > 0 ? (
                    convexJobs.map((job, index) => (
                      <div
                        key={job.id || `job-${index}`}
                        className="grid grid-cols-4 border-b border-zinc-800 px-4 py-3 text-sm"
                      >
                        <div className="flex items-center">
                          <span
                            className="cursor-pointer hover:underline"
                            onClick={() =>
                              router.push(`/trainer/jobs/${job._id}`)
                            }
                          >
                            {job.name}
                          </span>
                        </div>
                        <div className="flex items-center">
                          {job.status === "done" ? (
                            <Badge className="bg-purple-500/80 hover:bg-purple-700/80 text-white">
                              Done
                            </Badge>
                          ) : job.status === "training" ? (
                            <Badge className="bg-purple-400/80 hover:bg-purple-500/80 text-black">
                              Training
                            </Badge>
                          ) : (
                            <Badge className="bg-purple-300/90 hover:bg-purple-300/80 text-purple-900 border-purple-300/90">
                              Queued
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center">
                          {job._creationTime
                            ? floatToDateTime(job._creationTime)
                            : "N/A"}
                        </div>
                        <div className="flex items-center">
                          <Button
                            size="sm"
                            className={`${
                              job.status.toLowerCase() === "queued"
                                ? "bg-purple-400 hover:bg-purple-500 text-black"
                                : "bg-purple-400/40 text-purple-400/70 hover:bg-purple-400/40"
                            }`}
                            style={{
                              cursor:
                                job.status.toLowerCase() === "queued"
                                  ? "pointer"
                                  : "not-allowed",
                            }}
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (job.status.toLowerCase() !== "queued") return;

                              try {
                                console.log(
                                  "Starting training for job:",
                                  job._id
                                );
                                console.log("Firebase path:", job.firebasePath);
                                await sendPostRequest(
                                  job._id,
                                  job.firebasePath
                                );
                              } catch (error: unknown) {
                                const errorMessage =
                                  error instanceof Error
                                    ? error.message
                                    : "Unknown error occurred";
                                alert(
                                  "Failed to start training: " + errorMessage
                                );
                              }
                            }}
                            disabled={job.status.toLowerCase() !== "queued"}
                          >
                            Start Training
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-zinc-500">
                      No jobs found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Server Logs */}
          <Card
            className={`border-zinc-800 bg-black text-white w-1/2 transition-all duration-200 ${
              hoveredPanel === "logs" ? "border-purple-300/60" : ""
            }`}
            onMouseEnter={() => setHoveredPanel("logs")}
            onMouseLeave={() => setHoveredPanel(null)}
          >
            <div className="p-0">
              <div className="px-6 pt-[-1] pb-1">
                <h2 className="text-2xl font-semibold">Server Logs</h2>
                <p className="text-zinc-400 mt-0.5">Monitor server activity</p>
              </div>
              <div className="px-0 pt-5">
                <div
                  className="border border-zinc-800 rounded-md overflow-auto mx-6 p-3"
                  style={{ maxHeight: "calc(100vh - 220px)" }}
                >
                  {terminalOutput ? (
                    <pre className="font-mono text-sm text-zinc-400">
                      {terminalOutput}
                    </pre>
                  ) : (
                    <div className="flex items-start gap-2 text-sm text-zinc-400">
                      <Terminal className="mt-0.5 h-4 w-4 shrink-0" />
                      <div className="font-mono">No logs available</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
