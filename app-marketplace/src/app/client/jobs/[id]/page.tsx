"use client";

import React, { use } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { DoneJob } from "@/components/client/done-job";
import { OngoingJob } from "@/components/client/ongoing-job";
import { ErrorJob } from "@/components/client/error-job";
import { Id } from "../../../../../convex/_generated/dataModel";

// Firebase
import {app, storage } from "@/lib/firebase";
import {  ref as storageRef, getDownloadURL } from "firebase/storage";


export default function ClientJobPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  const job = useQuery(api.tasks.getJob, { id: resolvedParams.id as Id<"tasks">}) || "";
  if (!job) {
    return <div>Loading...</div>;
  }

  const getpath = async () => {
    const path = await getDownloadURL(storageRef(storage, `${job.firebasePath}/json.config`));
    console.log("path: ", path);
    return getpath;
  }

  getpath();


  // Determine which component to render based on status
  switch ((job.status ?? "unknown").toLowerCase()) {
    case "done":
      return (
        <DoneJob
          name={job.jobName}
          modelId={job.modelId}
          trainingFile="data.txt"
          modelParams={job}
        />
      );
    case "training":
      return <OngoingJob jobId={job.modelId} />;
    case "error":
      return <ErrorJob jobId={job.modelId} />;
    default:
      return <div>Unknown status: {job.status}</div>;
  }
}
