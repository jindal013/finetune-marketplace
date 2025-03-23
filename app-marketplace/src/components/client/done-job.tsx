"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Id } from "../../../convex/_generated/dataModel"
import { EvaluationChart } from "@/components/client/client-3eval-chart"

interface DoneJobProps {
  name: string
  modelId: string
  trainingFile: string
  modelParams: Record<string, any>
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function DoneJob({ name, modelId, trainingFile, modelParams }: DoneJobProps) {

  const metrics = useQuery(api.tasks.getMetricsDone, {id: modelId as Id<"tasks">} ) ?? [];

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  async function sendMessage(){
    if (!input.trim()) return

    let newMessage: Message[] = [
      ...messages,
      { role: 'user' , content: input },
    ]

    setMessages(newMessage)
    setInput('')

    const address = `http://100.66.215.153:4200/inference`;
    const response = await fetch(address,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ "message": newMessage }),
      });

    const data = await response.json();
    console.log(data);
    newMessage = [
      ...newMessage,
      { role: 'assistant', content: data.output }
    ]

    setMessages(newMessage)
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {/* Left Panel - Model Info + Evaluation Chart */}
      <div className="flex flex-col gap-y-2 col-start-1">
        <Card>
          <CardHeader>
            <CardTitle>Model Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Learning Rate</TableCell>
                  <TableCell>{modelParams.learningRate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Batch Size</TableCell>
                  <TableCell>{modelParams.batchSize}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Optimizer</TableCell>
                  <TableCell>{modelParams.optimizer}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Training File</TableCell>
                  <TableCell>{trainingFile}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button style={{cursor:'pointer'}}className="w-full mt-4" onClick={() => window.open(modelParams.weightsUrl)}>
              <Download className="mr-2 h-4 w-4" />
              Download Model Weights
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evaluation Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <EvaluationChart evaluationData={metrics || []} />
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Chatbot Interface */}
      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Chat with Your Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-[600px]">
              <ScrollArea className="flex-grow mb-4 p-4 border rounded-md bg-muted/10">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask your model something..."
                  className="flex-grow p-2 border rounded-md"
                />
                <Button style={{cursor:'pointer'}} onClick={sendMessage}>Send</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
