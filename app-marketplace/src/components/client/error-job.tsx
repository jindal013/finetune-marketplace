"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorJobProps {
  name: string
  error: string
}

export function ErrorJob({ name, error }: ErrorJobProps) {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      <Card className="mb-4 border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Training Error</CardTitle>
          <CardDescription>The training job encountered an error and was stopped</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg whitespace-pre-wrap font-mono text-sm">
            {error}
          </pre>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigator.clipboard.writeText(error)}
          >
            Copy Error
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
