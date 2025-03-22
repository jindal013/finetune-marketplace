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
  name: string
  currentStep: number
  totalSteps: number
}

export function OngoingJob({ name, currentStep, totalSteps }: OngoingJobProps) {
  const progress = (currentStep / totalSteps) * 100

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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Training Progress</CardTitle>
            <CardDescription>Step {currentStep} of {totalSteps}</CardDescription>
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
                              {`${Math.round(progress)}%`}
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
              Estimated completion in {Math.round((totalSteps - currentStep) / 2)} minutes
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 