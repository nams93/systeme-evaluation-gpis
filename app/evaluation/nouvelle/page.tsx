import { EvaluationFormSupabase } from "@/components/evaluation/evaluation-form-supabase"

export default function NouvelleEvaluationPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Nouvelle évaluation</h1>
      <EvaluationFormSupabase />
    </div>
  )
}

