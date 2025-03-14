import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EvaluationForm } from "@/components/evaluation/evaluation-form"

export default function NouvellePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Nouvelle Évaluation" text="Créez une nouvelle évaluation pour un agent GPIS" />
      <EvaluationForm />
    </DashboardShell>
  )
}

