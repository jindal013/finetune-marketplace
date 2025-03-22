"use client"

import { redirect } from "next/navigation"

type UserRole = "client" | "trainer"

export default function HomePage() {
  // TODO: Add authentication check here
  const isAuthenticated = true // Replace with actual auth check
  const userRole: UserRole = "client" // Replace with actual user role check
  
  if (isAuthenticated) {
    redirect(userRole === "trainer" ? "/trainer" : "/client")
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Welcome to LLM Market
        </h1>
        <p className="text-lg text-muted-foreground">
          The marketplace for fine-tuning and deploying language models
        </p>
        <div className="flex justify-center gap-4">
          <a href="/login" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Login
          </a>
          <a href="/register" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            Register
          </a>
        </div>
      </div>
    </div>
  )
} 