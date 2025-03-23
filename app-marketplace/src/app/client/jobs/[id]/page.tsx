"use client"

import { use } from "react"
import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { DoneJob } from "@/components/client/done-job"
import { OngoingJob } from "@/components/client/ongoing-job"
import { ErrorJob } from "@/components/client/error-job"

export default function ClientJobPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const job = useQuery(api.tasks.getById, { taskId: resolvedParams.id });
  const exampleBackloggedJobs = useQuery(api.tasks.getJobs) ?? []

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
    case "ongoing":
    case "training":
      return <OngoingJob jobId={job.id} />;
    case "error":
      return <ErrorJob jobId={job.id} />;
    default:
      return <div>Unknown status: {job.status}</div>;
  }
}