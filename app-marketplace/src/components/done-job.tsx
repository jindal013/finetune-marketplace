"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface DoneJobProps {
  name: string
  modelId: string
  architecture: string
  trainingFile: string
  modelParams: Record<string, string | number>
}

export function DoneJob({ name, modelId, architecture, trainingFile, modelParams }: DoneJobProps) {
  const [message, setMessage] = useState("")

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="font-medium">Model ID</dt>
                  <dd className="text-muted-foreground">{modelId}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Architecture</dt>
                  <dd className="text-muted-foreground">{architecture}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Training File</dt>
                  <dd className="text-muted-foreground">{trainingFile}</dd>
                </div>
                <div className="border-t my-4" />
                {Object.entries(modelParams).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <dt className="font-medium">{key}</dt>
                    <dd className="text-muted-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Download Weights
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Chat with Model</CardTitle>
            <CardDescription>Test your trained model</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              {/* Chat messages will go here */}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <div className="flex w-full gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    // Handle send message
                  }
                }}
              />
              <Button>Send</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
