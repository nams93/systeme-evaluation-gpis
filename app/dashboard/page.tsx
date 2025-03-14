import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SectionStats } from "@/components/dashboard/section-stats"
import { AgentsPerformance } from "@/components/dashboard/agents-performance"
import { SectionReports } from "@/components/dashboard/section-reports"

export const dynamic = "force-dynamic"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Tableau de Bord des Évaluations"
        text="Visualisez et analysez les performances des agents GPIS"
      />

      <div className="space-y-8">
        <SectionStats />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AgentsPerformance />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SectionReports />
        </div>
      </div>
    </DashboardShell>
  )
}

