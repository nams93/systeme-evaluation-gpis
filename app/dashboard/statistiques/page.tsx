import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function StatistiquesPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Statistiques" text="Analysez les tendances et performances globales" />
      <div className="rounded-md border p-8 text-center">
        <h2 className="text-lg font-medium">Statistiques d'évaluation</h2>
        <p className="text-sm text-muted-foreground mt-2">Cette page est en cours de développement.</p>
      </div>
    </DashboardShell>
  )
}

