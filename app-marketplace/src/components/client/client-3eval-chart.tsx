"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

interface EvaluationData {
  step: number
  loss: number
  eval: number
}

interface EvaluationChartProps {
  evaluationData: EvaluationData[]
}

const chartConfig = {
  loss: {
    label: "Loss",
    color: "#ef4444", // red-500
  },
  eval: {
    label: "Eval Loss",
    color: "#22c55e", // green-500
  },
} satisfies ChartConfig

export function EvaluationChart({ evaluationData }: EvaluationChartProps) {
  const [activeMetric, setActiveMetric] = useState<keyof typeof chartConfig>("loss")

  const formatStep = (step: number) => {
    return `${step}`
  }

  const formatValue = (value: number) => {
    return value.toFixed(2)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="text-sm font-medium">Step {label}</div>
          <div className="text-sm text-muted-foreground">
            {chartConfig[activeMetric].label}: {formatValue(payload[0].value)}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Evaluation</CardTitle>
          <CardDescription>Model performance metrics</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          {(["loss", "eval"] as const).map((metric) => (
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
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={evaluationData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 20,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="hsl(var(--muted-foreground))"
                opacity={0.2}
              />
              <XAxis
                dataKey="step"
                tickFormatter={formatStep}
                stroke="#ffffff"
                fontSize={12}
                tickLine={true}
                axisLine={true}
                dy={10}
                opacity={0.5}
                label={{
                  value: "Steps",
                  position: "bottom",
                  offset: 0,
                  opacity: 0.5
                }}
              />
              <YAxis
                tickFormatter={formatValue}
                stroke="#ffffff"
                fontSize={12}
                tickLine={true}
                axisLine={true}
                dx={-10}
                opacity={0.5}
                width={35}
                label={{
                  value: chartConfig[activeMetric].label,
                  angle: -90,
                  position: "insideLeft",
                  offset: -15,
                  dx:-1.5,
                  opacity: 0.5
                }}
              />
              <Tooltip
                content={CustomTooltip}
                cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey={activeMetric}
                stroke={chartConfig[activeMetric].color}
                strokeWidth={2}
                dot={{
                  r: 2,
                  fill: chartConfig[activeMetric].color,
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 4,
                  fill: "hsl(var(--background))",
                  stroke: chartConfig[activeMetric].color,
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}