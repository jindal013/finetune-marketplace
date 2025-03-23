"use client";

import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface ProgressChartProps {
  currentStep?: number;
  totalSteps?: number;
}

export function ProgressChart({ currentStep, totalSteps }: ProgressChartProps) {
  const progress =
    currentStep && totalSteps ? (currentStep / totalSteps) * 100 : 0;

  const chartData = [
    {
      progress: progress,
      fill: "#d8b4fe",
    },
  ];

  const chartConfig = {
    progress: {
      label: "Progress",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col border-[0.5px] border-zinc-800 bg-black text-white hover:border-[0.5px] hover:border-purple-300 transition-all duration-200 h-full z-10">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-white">Training Progress</CardTitle>
        <CardDescription className="text-zinc-400">
          {currentStep && totalSteps
            ? `Step ${currentStep} of ${totalSteps}`
            : "No active training"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
        {currentStep && totalSteps ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-[200px] h-[200px] relative">
              <RadialBarChart
                width={200}
                height={200}
                data={chartData}
                startAngle={90}
                endAngle={-((currentStep / totalSteps) * 360) + 90}
                innerRadius={60}
                outerRadius={80}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-zinc-800 last:fill-background"
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
                              className="fill-white text-3xl font-bold"
                            >
                              {`${Math.round(progress)}%`}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-zinc-400 text-sm"
                            >
                              Complete
                            </tspan>
                          </text>
                        );
                      }
                      return null;
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </div>
          </div>
        ) : (
          <div className="text-2xl font-bold text-center text-white">-</div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-2"></CardFooter>
    </Card>
  );
}
