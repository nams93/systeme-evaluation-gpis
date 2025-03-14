"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

export function PerformanceChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Performance par compétence</CardTitle>
          <CardDescription>Scores moyens par catégorie de compétence</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">Chargement du graphique...</CardContent>
      </Card>
    )
  }

  // Ici, vous pourriez intégrer une bibliothèque de graphiques comme Chart.js ou Recharts
  // Pour l'instant, nous affichons un graphique simulé avec des barres en HTML/CSS

  const competences = [
    { name: "Communication", score: 85 },
    { name: "Travail d'équipe", score: 92 },
    { name: "Connaissances techniques", score: 78 },
    { name: "Résolution de problèmes", score: 65 },
    { name: "Ponctualité", score: 88 },
  ]

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Performance par compétence</CardTitle>
        <CardDescription>Scores moyens par catégorie de compétence</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {competences.map((competence) => (
            <div key={competence.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{competence.name}</span>
                <span className="text-sm font-medium">{competence.score}%</span>
              </div>
              <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                <div className="h-full bg-primary" style={{ width: `${competence.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

