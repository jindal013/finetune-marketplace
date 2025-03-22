"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface CurrentJobProps {
  name: string
  architecture: string
  date: string
  onClick?: () => void
}

export function CurrentJob({ name, architecture, date, onClick }: CurrentJobProps) {
  return (
    <Card 
      className={`
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:border-primary/50' : ''}
      `}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Current Job
        </CardTitle>
        <CardDescription>
          {name === "No active training" ? name : "Active training"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
          {architecture}
          <div className="text-sm font-normal text-muted-foreground mt-1">
            {date}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
