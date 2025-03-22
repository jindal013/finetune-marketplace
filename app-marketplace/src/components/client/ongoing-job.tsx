"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

interface OngoingJobProps {
  jobId: string
}

export function OngoingJob({ jobId }: OngoingJobProps) {
  // Use the jobId to fetch current progress from your API
  const progress = 0.75; // This should come from your API

  const chartData = [
    {
      progress,
      fill: "var(--color-progress)"
    }
  ]

  const chartConfig = {
    progress: {
      label: "Progress",
      color: "hsl(var(--chart-1))"
    }
  } satisfies ChartConfig

  return (
    <div className="min-h-screen p-6">
      <Card>
        <CardHeader>
          <CardTitle>Training in Progress</CardTitle>
          <CardDescription>Your model is currently being trained</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Progress</p>
              <p className="text-sm text-muted-foreground">{Math.round(progress * 100)}% Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Training Progress</CardTitle>
            <CardDescription>Step {Math.round(progress * 100)}% Complete</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[200px]"
            >
              <RadialBarChart
                data={chartData}
                startAngle={0}
                endAngle={250}
                innerRadius={60}
                outerRadius={80}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[65, 55]}
                />
                <RadialBar dataKey="progress" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {`${Math.round(progress * 100)}%`}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-muted-foreground text-sm"
                            >
                              Complete
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm pt-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Training at optimal speed <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Estimated completion in {Math.round((1 - progress) * 10)} minutes
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}