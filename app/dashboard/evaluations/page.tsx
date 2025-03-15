import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { EvaluationsList } from "@/components/dashboard/evaluations-list"
import { Skeleton } from "@/components/ui/skeleton"

export default function EvaluationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Évaluations" description="Gérez toutes les évaluations GPIS" />

      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <EvaluationsList />
      </Suspense>
    </DashboardShell>
  )
}

