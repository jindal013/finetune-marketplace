"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { RadialBarChart, RadialBar, PolarGrid } from "recharts"

interface ModelProgressProps {
  currentStep?: number
  totalSteps?: number
  jobName?: string
}

export function ModelProgress({ currentStep, totalSteps, jobName }: ModelProgressProps) {
  if (!currentStep || !totalSteps) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Training Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[150px]">
          <p className="text-muted-foreground">No training in progress</p>
        </CardContent>
      </Card>
    )
  }

  const progress = (currentStep / totalSteps) * 100
  const data = [{ value: progress }]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Progress</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ChartContainer className="max-h-[200px]">
          <RadialBarChart
            width={200}
            height={200}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            barSize={10}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarGrid radialLines={false} polarRadius={[65, 55]} />
            <RadialBar
              background
              dataKey="value"
              cornerRadius={30}
              fill="hsl(var(--primary))"
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground text-3xl font-bold"
            >
              {Math.round(progress)}%
            </text>
            <text
              x="50%"
              y={(100 + 20)}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-sm"
            >
              Complete
            </text>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="pt-2 justify-center text-sm text-muted-foreground">
        {jobName && <span className="font-medium">{jobName}</span>}
        <span className="mx-2">•</span>
        Step {currentStep} of {totalSteps}
      </CardFooter>
    </Card>
  )
} 