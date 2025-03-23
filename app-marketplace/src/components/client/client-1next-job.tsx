"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface CurrentJobProps {
  name: string;
  architecture: string;
  date: string;
  onClick?: () => void;
}

export function CurrentJob({
  name,
  architecture,
  date,
  onClick,
}: CurrentJobProps) {
  return (
    <Card
      className={`
        border border-zinc-800 bg-black text-white
        transition-colors duration-300
        ${onClick ? "cursor-pointer hover:border-[0.5px] hover:border-purple-300" : ""}
      `}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <div className="h-2 w-2 rounded-full bg-purple-300 animate-pulse" />
          Current Job
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent">
          {name === null ? "No active training" : name}
          <div className="text-sm font-normal text-zinc-400 mt-1">{date}</div>
        </div>
      </CardContent>
    </Card>
  );
}
