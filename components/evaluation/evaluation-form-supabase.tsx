"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function EvaluationFormSupabase() {
  const router = useRouter()
  const [evaluations, setEvaluations] = useState<Record<string, number>>({})
  const [observation, setObservation] = useState("")
  const [selectedIndicatif, setSelectedIndicatif] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [agentMatricule, setAgentMatricule] = useState("")
  const [evaluateurNom, setEvaluateurNom] = useState("")
  const [evaluationDate, setEvaluationDate] = useState(new Date().toISOString().split("T")[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data: agentData, error: agentError } = await supabase
        .from("agents")
        .select("id")
        .eq("matricule", agentMatricule)
        .single()

      if (agentError || !agentData) {
        throw new Error("Agent introuvable ou matricule incorrect.")
      }

      const { data: evaluateurData, error: evaluateurError } = await supabase
        .from("evaluateurs")
        .select("id")
        .eq("nom", evaluateurNom)
        .single()

      if (evaluateurError || !evaluateurData) {
        throw new Error("Évaluateur introuvable ou nom incorrect.")
      }

      const finalScore = Object.values(evaluations).reduce((sum, score) => sum + score, 0) / Object.keys(evaluations).length * 5

      const evaluationData = {
        agentId: agentData.id,
        evaluateurId: evaluateurData.id,
        date: evaluationDate,
        section: selectedSection,
        indicatif: selectedIndicatif,
        score: finalScore,
        commentaireGeneral: observation,
        status: "completee",
      }

      const response = await fetch("/api/evaluations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(evaluationData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Échec de l'enregistrement")
      }

      toast({ title: "Évaluation enregistrée", description: "L'évaluation a été enregistrée avec succès." })
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'évaluation:", error)
      toast({ title: "Erreur", description: error.message, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
          <CardTitle>Formulaire d'évaluation GPIS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="matricule">Matricule de l'agent</Label>
              <Input id="matricule" value={agentMatricule} onChange={(e) => setAgentMatricule(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="evaluateur">Nom de l'évaluateur</Label>
              <Input id="evaluateur" value={evaluateurNom} onChange={(e) => setEvaluateurNom(e.target.value)} required />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 bg-gray-50 rounded-b-lg">
          <Button variant="outline" type="button" onClick={() => router.push("/dashboard")} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enregistrer l'évaluation"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
