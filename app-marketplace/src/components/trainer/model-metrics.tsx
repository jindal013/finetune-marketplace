"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface Metric {
  epoch: number
  loss: number
  accuracy: number
}

interface ModelMetricsProps {
  metrics: Metric[] | null
}

export function ModelMetrics({ metrics }: ModelMetricsProps) {
  if (!metrics || metrics.length === 0) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Training Metrics</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[150px]">
          <p className="text-muted-foreground">No metrics available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Training Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={metrics}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="epoch"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value.toFixed(2)}`}
              />
              <Line
                type="monotone"
                dataKey="loss"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={false}
                name="Loss"
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                name="Accuracy"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 