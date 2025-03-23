"use client";

import { useRouter } from "next/navigation";
import { CurrentJob } from "@/components/client/client-1next-job";
import { ProgressChart } from "@/components/client/client-2progress-chart";
import { EvaluationChart } from "@/components/client/client-3eval-chart";
import { JobPopup } from "./job-popup";
import { JobsTable, type Job } from "./jobs-table";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BackloggedJobsTable,
  type BackloggedJob,
} from "@/components/trainer/backlogged-jobs-table";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function ClientHomePage() {
  const router = useRouter();
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);
  const exampleBackloggedJobs = useQuery(api.tasks.getJobs) ?? [];

  // Find ongoing job and ensure proper typing
  const ongoingJobs = exampleBackloggedJobs.filter(
    (job) => job.status === "training"
  );
  const ongoingJob = ongoingJobs.length > 0 ? ongoingJobs[0] : null;

  const metrics = useQuery(api.tasks.getMetrics) ?? [];
  const steps = useQuery(api.tasks.getSteps) ?? {
    currentStep: 0,
    totalSteps: 0,
  };

  return (
    <div className="flex h-screen flex-col bg-black overflow-hidden">
      <header className="flex h-14 items-center justify-between border-b border-zinc-800 px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">
            <span className="font-semibold">Project Name Here</span> /{" "}
            <span className="font-normal">Client Marketplace</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <JobPopup />
        </div>
      </header>

      <main className="flex flex-1 p-4 pb-16 overflow-auto relative">
        <div className="flex w-full gap-4 h-[calc(100vh-240px)] relative z-10">
          <div className="space-y-4 w-1/3 flex flex-col">
            <CurrentJob
              name={ongoingJob?.name || "No active training"}
              architecture={ongoingJob?.architecture || "-"}
              date={ongoingJob?.date || "-"}
              onClick={() =>
                ongoingJob && router.push(`/jobs/${ongoingJob._id}`)
              }
            />
            <Card
              className={`border border-zinc-800 bg-black text-white transition-all duration-200 flex-1 ${
                hoveredPanel === "backlog"
                  ? "border-[0.5px] border-purple-300"
                  : ""
              }`}
              onMouseEnter={() => setHoveredPanel("backlog")}
              onMouseLeave={() => setHoveredPanel(null)}
            >
              <CardHeader>
                <CardTitle className="text-white">Job Board</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <BackloggedJobsTable
                  data={exampleBackloggedJobs || []}
                  variant="client"
                />
              </CardContent>
            </Card>
          </div>
          <div className="w-1/3 flex flex-col">
            <ProgressChart
              currentStep={steps.currentStep}
              totalSteps={steps.totalSteps}
            />
          </div>
          <div className="w-1/3 flex flex-col">
            <EvaluationChart evaluationData={metrics || []} />
          </div>
        </div>

        {/* Purple glow effect at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden">
          <div
            className="w-full h-80 blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(192, 132, 252, 0.4) 0%, rgba(168, 85, 247, 0.2) 40%, rgba(126, 34, 206, 0.08) 60%, transparent 80%)",
              transform: "translateY(55%)",
              filter: "saturate(1.1) brightness(0.7)",
            }}
          ></div>
          <div
            className="absolute bottom-0 left-1/2 w-[120%] h-40 blur-2xl opacity-25"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(216, 180, 254, 0.5) 0%, rgba(192, 132, 252, 0.2) 50%, transparent 80%)",
              transform: "translate(-50%, 45%)",
              mixBlendMode: "lighten",
            }}
          ></div>
        </div>
      </main>
    </div>
  );
}
