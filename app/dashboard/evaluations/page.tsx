import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function EvaluationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Évaluations" text="Gérez toutes les évaluations des agents GPIS" />
      <div className="rounded-md border p-8 text-center">
        <h2 className="text-lg font-medium">Liste des évaluations</h2>
        <p className="text-sm text-muted-foreground mt-2">Cette page est en cours de développement.</p>
      </div>
    </DashboardShell>
  )
}

