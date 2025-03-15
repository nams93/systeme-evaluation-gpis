import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { EvaluationReports } from "@/components/dashboard/evaluation-reports"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReportsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Rapports d'évaluation" description="Générez et consultez les rapports d'évaluation" />

      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <EvaluationReports />
      </Suspense>
    </DashboardShell>
  )
}

