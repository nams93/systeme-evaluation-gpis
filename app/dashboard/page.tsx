import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentEvaluations } from "@/components/dashboard/recent-evaluations"
import { EvaluationsBySection } from "@/components/dashboard/evaluations-by-section"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Tableau de bord" description="Vue d'ensemble des évaluations GPIS" />

      <div className="grid gap-6">
        <Suspense fallback={<Skeleton className="h-[120px] w-full" />}>
          <DashboardStats />
        </Suspense>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Suspense fallback={<Skeleton className="h-[350px] md:col-span-1 lg:col-span-4" />}>
            <RecentEvaluations className="md:col-span-1 lg:col-span-4" />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-[350px] md:col-span-1 lg:col-span-3" />}>
            <EvaluationsBySection className="md:col-span-1 lg:col-span-3" />
          </Suspense>
        </div>
      </div>
    </DashboardShell>
  )
}

