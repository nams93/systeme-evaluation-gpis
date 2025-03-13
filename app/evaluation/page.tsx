"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import EvaluationForm from "@/components/forms/evaluation-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function EvaluationPage() {
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (formData) => {
    // Récupérer les évaluations existantes
    const existingEvaluations = JSON.parse(localStorage.getItem("evaluations") || "[]")

    // Ajouter la nouvelle évaluation
    localStorage.setItem("evaluations", JSON.stringify([...existingEvaluations, formData]))

    // Afficher un toast de confirmation
    toast({
      title: "Évaluation enregistrée",
      description: "L'évaluation a été enregistrée avec succès.",
    })

    setIsSubmitted(true)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" /> Retour
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Évaluation Agent d'Exploitation</h1>
      </div>

      {isSubmitted ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-green-600">Évaluation Soumise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">Votre évaluation a été soumise avec succès. Merci!</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setIsSubmitted(false)}>Créer une nouvelle évaluation</Button>
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Voir le tableau de bord
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <EvaluationForm onSubmit={handleSubmit} />
      )}

      <Toaster />
    </div>
  )
}

