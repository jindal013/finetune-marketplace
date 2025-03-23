"use client"

import { useRouter } from "next/navigation"
import { CurrentJob } from "@/components/client/client-1next-job"
import { ProgressChart } from "@/components/client/client-2progress-chart"
import { EvaluationChart } from "@/components/client/client-3eval-chart"
import { JobPopup } from "./job-popup"
import { JobsTable, type Job } from "./jobs-table"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BackloggedJobsTable, type BackloggedJob } from "@/components/trainer/backlogged-jobs-table"

import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"


export function ClientHomePage() {
  const router = useRouter()
  const exampleBackloggedJobs = useQuery(api.tasks.getJobs) ?? [];
  let ongoingJob = exampleBackloggedJobs.filter(job => job.status === "training") || null;
  if (ongoingJob){
    ongoingJob = ongoingJob[0];
  }


  const metrics = useQuery(api.tasks.getMetrics) ?? [];
  const steps = useQuery(api.tasks.getSteps) ?? {currentStep: 0, totalSteps: 0};

  return (
    <div className="min-h-screen p-8 space-y-12 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome to LLM Market, Eric
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor and manage your AI model training jobs
          </p>
        </div>
        <div className="flex justify-end">
          <JobPopup />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-4">
          <CurrentJob
            name={ongoingJob?.name || "No active training"}
            date={ongoingJob?.date || "-"}
            onClick={() => ongoingJob && router.push(`/jobs/${ongoingJob.id}`)}
          />
          <Card>
            <CardHeader>
              <CardTitle>Backlogged Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <BackloggedJobsTable data={exampleBackloggedJobs || []} variant="client" />
            </CardContent>
          </Card>
        </div>
        <ProgressChart
          currentStep={steps.currentStep}
          totalSteps={steps.totalSteps}
        />
        <EvaluationChart evaluationData={metrics || []} />
      </div>
    </div>
  )
}
