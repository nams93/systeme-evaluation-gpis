import type React from "react"
interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-8">{children}</div>
    </div>
  )
}

