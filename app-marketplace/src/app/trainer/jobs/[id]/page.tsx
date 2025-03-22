"use client"

import { use } from "react"
import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { DoneJob } from "@/components/trainer/done-job"

export default function TrainerJobPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const job = useQuery(api.tasks.getById, { taskId: resolvedParams.id });

  if (!job) {
    return <div>Loading...</div>;
  }

  switch (job.status.toLowerCase()) {
    case "done":
      return (
        <DoneJob
          name={job.name}
          modelId={job.id}
          architecture={job.architecture}
          trainingFile={job.trainingFile}
          modelParams={job.modelParams}
        />
      );
    // Add other status cases as needed
    default:
      return <div>Unknown status: {job.status}</div>;
  }
}