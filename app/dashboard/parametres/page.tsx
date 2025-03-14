import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function ParametresPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Paramètres" text="Configurez le système d'évaluation selon vos besoins" />
      <div className="rounded-md border p-8 text-center">
        <h2 className="text-lg font-medium">Paramètres du système</h2>
        <p className="text-sm text-muted-foreground mt-2">Cette page est en cours de développement.</p>
      </div>
    </DashboardShell>
  )
}

