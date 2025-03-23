"use client";

import React, { use } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { DoneJob } from "@/components/client/done-job";
import { OngoingJob } from "@/components/client/ongoing-job";
import { ErrorJob } from "@/components/client/error-job";
import { Id } from "../../../../../convex/_generated/dataModel";

import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBz0XRFZjisjl2m2kjefJwt5ydxUc5FabA",
  authDomain: "finetunemarketplace-1323f.firebaseapp.com",
  databaseURL: "https://finetunemarketplace-1323f-default-rtdb.firebaseio.com",
  projectId: "finetunemarketplace-1323f",
  storageBucket: "finetunemarketplace-1323f.firebasestorage.app",
  messagingSenderId: "163760710265",
  appId: "1:163760710265:web:676a8e7c5116ad6661eaa8",
  measurementId: "G-2HQ21J89S1"
};

let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
let storage = getStorage(firebase_app);

export default function ClientJobPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  const job = useQuery(api.tasks.getJob, { id: resolvedParams.id as Id<"tasks">}) || "";
  if (!job) {
    return <div>Loading...</div>;
  }


  // Determine which component to render based on status
  switch ((job.status ?? "unknown").toLowerCase()) {
    case "done":
      return (
        <DoneJob
          name={job.jobName}
          modelId={job._id}
          trainingFile="data.txt"
          modelParams={job.config}
        />
      );
    case "training":
      return <OngoingJob jobId={job._id} />;
    case "queued":
      return <div>Queued</div>;
    case "error":
      return <ErrorJob jobId={job._id} />;
    default:
      return <div>Unknown status: {job.status}</div>;
  }
}
