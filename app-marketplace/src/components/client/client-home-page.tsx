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

// Example data for regular jobs
const jobs: Job[] = [
  {
    id: "1",
    name: "BERT Fine-tuning",
    architecture: "DenseNet",
    status: "Done",
    trainingTime: "1h 24m",
    trainer: "Eric",
    date: "2024-03-22"
  },
  {
    id: "2",
    name: "GPT Training",
    architecture: "ResNet",
    status: "Ongoing",
    currentStep: 45,
    totalSteps: 100,
    trainingTime: "45m",
    trainer: "Eric",
    date: "2024-03-21"
  },
  {
    id: "3",
    name: "T5 Model Training",
    architecture: "VGGNet",
    status: "Error",
    trainingTime: "2h 15m",
    trainer: "Eric",
    date: "2024-03-20"
  }
]

const evaluationData = [
  { date: "2024-03-20", loss: 2.5, accuracy: 0.65 },
  { date: "2024-03-21", loss: 2.1, accuracy: 0.72 },
  { date: "2024-03-22", loss: 1.8, accuracy: 0.78 },
  { date: "2024-03-23", loss: 1.5, accuracy: 0.82 },
  { date: "2024-03-24", loss: 1.3, accuracy: 0.85 },
  { date: "2024-03-25", loss: 1.1, accuracy: 0.87 },
  { date: "2024-03-26", loss: 0.9, accuracy: 0.89 },
  { date: "2024-03-27", loss: 0.8, accuracy: 0.91 },
  { date: "2024-03-28", loss: 0.7, accuracy: 0.92 },
  { date: "2024-03-29", loss: 0.6, accuracy: 0.93 }
]

export function ClientHomePage() {
  const router = useRouter()
  const exampleBackloggedJobs = useQuery(api.tasks.getJobs) ?? [];
  let ongoingJob = exampleBackloggedJobs.filter(job => job.status === "training") || null;
  if (ongoingJob){
    ongoingJob = ongoingJob[0];
  }


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
          currentStep={ongoingJob?.currentStep}
          totalSteps={ongoingJob?.totalSteps}
        />
        <EvaluationChart evaluationData={evaluationData || []} />
      </div>
    </div>
  )
}
