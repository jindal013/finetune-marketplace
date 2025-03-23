"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorJobProps {
  jobId: string;
}

export function ErrorJob({ jobId }: ErrorJobProps) {
  // In a real app, you would fetch the error details using the jobId
  const error = "An error occurred during training. Please contact support.";

  return (
    <div className="min-h-screen p-6">
      <Card className="mb-4 border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Training Error</CardTitle>
          <CardDescription>
            The training job encountered an error and was stopped
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
          <div className="mt-4 flex gap-3">
            <Button variant="outline">Retry Job</Button>
            <Button className="bg-purple-400 hover:bg-purple-500 text-black">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
