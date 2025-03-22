"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Model {
  name: string
  type: string
  status: string
  progress: number
  client: string
}

interface CurrentModelProps {
  model: Model | null
}

export function CurrentModel({ model }: CurrentModelProps) {
  if (!model) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Current Model</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[150px]">
          <p className="text-muted-foreground">No model in training</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Current Model</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{model.name}</h3>
            <Badge
              variant={
                model.status === "Done"
                  ? "secondary"
                  : model.status === "Failed"
                  ? "destructive"
                  : "default"
              }
            >
              {model.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{model.type}</span>
            <span>Client: {model.client}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 