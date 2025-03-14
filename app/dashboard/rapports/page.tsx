import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function RapportsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Rapports" text="Générez et consultez les rapports d'évaluation" />
      <div className="rounded-md border p-8 text-center">
        <h2 className="text-lg font-medium">Rapports d'évaluation</h2>
        <p className="text-sm text-muted-foreground mt-2">Cette page est en cours de développement.</p>
      </div>
    </DashboardShell>
  )
}

