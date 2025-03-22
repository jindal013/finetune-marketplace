import { ReactNode } from "react"
import { redirect } from "next/navigation"

interface ClientLayoutProps {
  children: ReactNode
}

export default function ClientLayout({
  children,
}: ClientLayoutProps): ReactNode {
  // TODO: Add authentication check here
  const isAuthenticated = true // Replace with actual auth check
  const userRole = "client" // Replace with actual user role check
  
  if (!isAuthenticated) {
    redirect("/login")
  }

  if (userRole !== "client") {
    redirect("/trainer")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* TODO: Add navigation here */}
      <main>{children}</main>
    </div>
  )
} 