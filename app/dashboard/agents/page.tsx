import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AgentsList } from "@/components/dashboard/agents-list"
import { Skeleton } from "@/components/ui/skeleton"

export default function AgentsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Suivi des Agents" description="Visualisez les performances de tous les agents" />

      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <AgentsList />
      </Suspense>
    </DashboardShell>
  )
}

