"use client"

import * as React from "react"
import { ResponsiveContainer } from "recharts"

export type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactElement
}

export function ChartContainer({
  config,
  children,
  className,
  ...props
}: ChartProps) {
  return (
    <div {...props} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}
