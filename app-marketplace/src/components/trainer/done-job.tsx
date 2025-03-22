"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DoneJobProps {
  name: string
  modelId: string
  architecture: string
  trainingFile: string
  modelParams: Record<string, string | number>
}

export function DoneJob({ name, modelId, architecture, trainingFile, modelParams }: DoneJobProps) {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Training Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model ID</TableHead>
                <TableHead>Architecture</TableHead>
                <TableHead>Training File</TableHead>
                <TableHead>Precision</TableHead>
                <TableHead>Batch Size</TableHead>
                <TableHead>Learning Rate</TableHead>
                <TableHead>Max Steps</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{modelId}</TableCell>
                <TableCell>{architecture}</TableCell>
                <TableCell>{trainingFile}</TableCell>
                <TableCell>{modelParams.precision}</TableCell>
                <TableCell>{modelParams.batchSize}</TableCell>
                <TableCell>{modelParams.learningRate}</TableCell>
                <TableCell>{modelParams.maxSteps}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="mt-6 flex justify-end">
            <Button 
              size="lg"
              onClick={() => {
                // TODO: Implement start training functionality
                alert("Starting training job: " + name)
              }}
            >
              Start Training
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 