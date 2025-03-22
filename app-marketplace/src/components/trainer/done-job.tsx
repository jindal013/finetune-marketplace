"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DoneJobProps {
  name: string
  modelId: string
  architecture: string
  trainingFile: string
  modelParams: Record<string, string | number>
}

export function DoneJob({ name, modelId, architecture, trainingFile, modelParams }: DoneJobProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Training Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">Final Accuracy</h3>
              <p className="text-2xl">{modelParams.accuracy}%</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">Final Loss</h3>
              <p className="text-2xl">{modelParams.loss}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">Training Time</h3>
              <p className="text-2xl">{modelParams.trainingTime}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">Model Size</h3>
              <p className="text-2xl">{modelParams.modelSize}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Training Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Architecture</h3>
              <p>{architecture}</p>
            </div>
            <div>
              <h3 className="font-semibold">Hyperparameters</h3>
              <ul className="list-disc pl-4">
                <li>Learning Rate: {modelParams.learningRate}</li>
                <li>Batch Size: {modelParams.batchSize}</li>
                <li>Epochs: {modelParams.epochs}</li>
                <li>Optimizer: {modelParams.optimizer}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Dataset</h3>
              <ul className="list-disc pl-4">
                <li>Training File: {trainingFile}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Training Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full">
            <pre className="font-mono text-sm whitespace-pre-wrap">
              {modelParams.trainingLogs || "No logs available"}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}