"use client"

import { useParams } from "next/navigation"
import { OngoingJob } from "@/components/ongoing-job"
import { ErrorJob } from "@/components/error-job"
import { DoneJob } from "@/components/done-job"

// Example data - replace with real data from your backend
const jobs = [
  {
    id: "1",
    name: "BERT Fine-tuning",
    modelId: "facebook/opt-350m",
    architecture: "DenseNet",
    status: "Done" as const,
    trainingTime: "1h 24m",
    trainer: "Eric",
    date: "2024-03-22",
    trainingFile: "training_data.txt",
    modelParams: {
      precision: "bfloat16",
      modulesLimit: 8,
      loraRank: 16,
      loraAlpha: 32,
      batchSize: 4,
      optimizer: "adamw_torch",
      warmupSteps: 100,
      maxSteps: 1000,
      evalSteps: 100,
      learningRate: 0.0003,
      loggingSteps: 10,
      outputDir: "./output"
    }
  },
  {
    id: "2",
    name: "GPT Training",
    modelId: "facebook/opt-125m",
    architecture: "ResNet",
    status: "Ongoing" as const,
    currentStep: 45,
    totalSteps: 100,
    trainingTime: "45m",
    trainer: "Eric",
    date: "2024-03-21"
  },
  {
    id: "3",
    name: "T5 Model Training",
    modelId: "google/t5-small",
    architecture: "VGGNet",
    status: "Error" as const,
    trainingTime: "2h 15m",
    trainer: "Eric",
    date: "2024-03-20",
    error: "CUDA out of memory. Tried to allocate 2.30 GiB."
  },
]

export default function JobPage() {
  const params = useParams()
  const jobId = params.id as string
  const job = jobs.find(j => j.id === jobId)

  if (!job) {
    return (
      <div className="min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-4">Job not found</h1>
        <p className="text-muted-foreground">The job you're looking for doesn't exist.</p>
      </div>
    )
  }

  switch (job.status) {
    case "Error":
      return <ErrorJob name={job.name} error={job.error} />
    case "Ongoing":
      return (
        <OngoingJob 
          name={job.name}
          currentStep={job.currentStep}
          totalSteps={job.totalSteps}
        />
      )
    case "Done":
      return (
        <DoneJob 
          name={job.name}
          modelId={job.modelId}
          architecture={job.architecture}
          trainingFile={job.trainingFile}
          modelParams={job.modelParams}
        />
      )
  }
} 