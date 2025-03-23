"use client"

import { useRouter } from "next/navigation"
import { CurrentModel } from "./current-model"
import { ModelProgress } from "./model-progress"
import { BackloggedJobsTable, type BackloggedJob } from "./backlogged-jobs-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"

export default function TrainerHomePage() {

  const trainingModelsId = useQuery(api.tasks.getTrainingModels);

  let terminalOutput = "";
  const logs = useQuery(api.tasks.getLogs);
  if(logs){
    terminalOutput = logs.join("\n");
  }
  const router = useRouter();
  const exampleBackloggedJobs = useQuery(api.tasks.getJobs);

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Trainer Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage and monitor training jobs
        </p>
      </div>

       <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Backlogged Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <BackloggedJobsTable data={exampleBackloggedJobs || []} />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Server Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <pre className="font-mono text-sm">
                {terminalOutput}
                {/* terminalOutput ={
                  await {
                    id: id
                    logging: terminalOutput
                  }
                } */}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}