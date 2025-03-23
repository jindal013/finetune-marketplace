"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { DoneJob } from "@/components/client/done-job";
import { OngoingJob } from "@/components/client/ongoing-job";
import { ErrorJob } from "@/components/client/error-job";

// Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, get } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";

// -- Replace with your real config if necessary --
const firebaseConfig = {
  apiKey: "AIzaSyBz0XRFZjisjl2m2kjefJwt5ydxUc5FabA",
  authDomain: "finetunemarketplace-1323f.firebaseapp.com",
  databaseURL: "https://finetunemarketplace-1323f-default-rtdb.firebaseio.com",
  projectId: "finetunemarketplace-1323f",
  storageBucket: "finetunemarketplace-1323f.appspot.com",
  messagingSenderId: "163760710265",
  appId: "1:163760710265:web:676a8e7c5116ad6661eaa8",
  measurementId: "G-2HQ21J89S1",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

export default function ClientJobPage() {
  // The path in your Firebase bucket/DB
  const firebasePath = useQuery(api.tasks.getFireBasePathById);

  const [loading, setLoading] = React.useState(true);
  const [job, setJob] = React.useState<any>(null);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      // If the query has not returned yet, do nothing:
      if (!firebasePath) return;

      try {
        // Fetch the status from Firebase Realtime Database
        const statusSnapshot = await get(dbRef(db, `${firebasePath}/status`));
        const statusValue = statusSnapshot.val() ?? "training";

        // Fetch config.json from Firebase Storage
        const configFileRef = storageRef(storage, `${firebasePath}/config.json`);
        const downloadURL = await getDownloadURL(configFileRef);
        const response = await fetch(downloadURL);
        const configData = await response.json();

        // Merge data and update state
        setJob({
          status: statusValue,
          ...configData,
        });
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [firebasePath]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!job) {
    return <div>No job found</div>;
  }

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
