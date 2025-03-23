"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface DoneJobProps {
  name: string;
  modelId: string;
  architecture: string;
  trainingFile: string;
  modelParams: Record<string, any>;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function DoneJob({
  name,
  modelId,
  architecture,
  trainingFile,
  modelParams,
}: DoneJobProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input },
      {
        role: "assistant",
        content:
          "This is a sample response. Connect to your API for real responses.",
      },
    ];
    setMessages(newMessages);
    setInput("");
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Left Panel - Model Information */}
      <div className="space-y-4">
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
                  <TableCell className="font-medium">Architecture</TableCell>
                  <TableCell>{architecture}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Learning Rate</TableCell>
                  <TableCell>{modelParams.learningRate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Batch Size</TableCell>
                  <TableCell>{modelParams.batchSize}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Epochs</TableCell>
                  <TableCell>{modelParams.epochs}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Optimizer</TableCell>
                  <TableCell>{modelParams.optimizer}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Accuracy</TableCell>
                  <TableCell>{modelParams.accuracy}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Loss</TableCell>
                  <TableCell>{modelParams.loss}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Training File</TableCell>
                  <TableCell>{trainingFile}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button
              className="w-full mt-6 bg-purple-400 hover:bg-purple-500 text-black"
              onClick={() => window.open(modelParams.weightsUrl)}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Model Weights
            </Button>
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
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.role === "user"
                            ? "bg-purple-400 text-black"
                            : "bg-muted"
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
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask your model something..."
                  className="flex-grow p-2 border rounded-md"
                />
                <Button
                  onClick={sendMessage}
                  className="bg-purple-400 hover:bg-purple-500 text-black"
                >
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
