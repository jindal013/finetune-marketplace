"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

interface EvaluationData {
  date: string
  loss: number
  accuracy: number
}

interface EvaluationChartProps {
  evaluationData: EvaluationData[]
}

const chartConfig = {
  loss: {
    label: "Loss",
    color: "hsl(var(--chart-1))",
  },
  accuracy: {
    label: "Accuracy",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function EvaluationChart({ evaluationData }: EvaluationChartProps) {
  const [activeMetric, setActiveMetric] = useState<keyof typeof chartConfig>("loss")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Evaluation</CardTitle>
          <CardDescription>Model performance metrics</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-2">
          {(["loss", "accuracy"] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setActiveMetric(metric)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                ${activeMetric === metric 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              {chartConfig[metric].label}
            </button>
          ))}
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-[2/1] w-full"
        >
          <LineChart
            data={evaluationData}
            margin={{
              left: 0,
              right: 0,
              top: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: string) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <Line
              type="monotone"
              dataKey={activeMetric}
              stroke={`var(--color-${activeMetric})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}